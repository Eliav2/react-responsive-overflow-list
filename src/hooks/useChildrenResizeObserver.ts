import { useRef } from "react";

import { useIsoLayoutEffect } from "./useIsoLayoutEffect";

/**
 * Runs `callback` once an animation frame has passed with no further call to the returned `bump`.
 *
 * Sizes have settled exactly when notifications stop arriving, and "stopped" is the absence of an event, so
 * something has to tick to notice it. That tick is the frame clock rather than a duration: a size that is still
 * moving notifies every frame, so one quiet frame separates moving from stopped, and no number has to be picked
 * out of the air. `bump` is cheap by design — the expensive work is the callback, and it runs once.
 *
 * Two chained frames rather than one. Chaining `requestAnimationFrame` to wait past the next rendering update
 * is an old idiom (Vue's `nextFrame` is `raf(() => raf(fn))`), and here the second frame is what makes the
 * comparison meaningful: measured in Chrome, callbacks within a frame run in the order `rAF, ResizeObserver`,
 * so a frame requested from inside a ResizeObserver callback runs *before* the next notification would be
 * delivered and could not tell quiet from busy.
 *
 * That order is deliberately not relied on. The ResizeObserver spec only places its algorithms somewhere within
 * "update the rendering", and https://github.com/WICG/resize-observer/issues/37 has been open on the relative
 * order since 2017, so it is not guaranteed and other engines may differ. Comparing a counter across a frame
 * boundary works under either order — it only ever asks "did anything notify during the frame I just waited
 * out" — and a test drives both to keep that true.
 */
function createFrameSettler(callback: () => void) {
  let seq = 0;
  let frame: number | null = null;

  const cancel = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  };

  /** Waits one frame and either fires or, if something moved in the meantime, waits another. */
  const waitOneFrame = () => {
    // Captured before requesting the frame, so it counts every notification delivered up to this point. Any
    // number of them within a single frame therefore reads as one.
    const seenAt = seq;
    frame = requestAnimationFrame(() => {
      frame = null;
      if (seq !== seenAt) {
        // Something moved during the frame just waited out, so it is still moving. One more frame, not a fresh
        // two: this keeps the wait bounded at two frames from any state once notifications stop.
        waitOneFrame();
        return;
      }
      callback();
    });
  };

  const arm = () => {
    // The first frame only gets us to a point where a comparison spans a frame boundary under either callback
    // order; the real test is in the frame after it.
    frame = requestAnimationFrame(() => {
      frame = null;
      waitOneFrame();
    });
  };

  return {
    bump() {
      seq += 1;
      // Already waiting: the comparison above will notice this and wait again, so do not stack frames.
      if (frame === null) arm();
    },
    cancel,
  };
}

/**
 * Watches a container's children for size changes and calls `onSettled` once they hold still.
 *
 * Exists for size changes React is not involved in: a web font swapping in, an image inside a child finishing
 * its load, a CSS transition on a child's width, a user dragging a resize handle. Nothing renders, so nothing
 * that runs on commit can notice them.
 *
 * Two details here are not cosmetic, both settled by measurement in Chrome:
 *
 * - Children are observed on their **border box**. A child's padding or border changing fires a border-box
 *   observer and not a content-box one, while `getBoundingClientRect` moves either way. Left on the default
 *   box, this would stay silent for a real change.
 *
 * - `onSettled` waits for **one quiet frame** rather than firing per notification. A child whose size is
 *   animating or being dragged notifies every frame, and the caller's work is usually far more expensive than
 *   the notification: measured with 100 children, calling back per notification while dragging a single child
 *   dropped 29 of 200 frames and took the page from 120fps to 88, where the same drag with the observer off
 *   dropped none. See `createFrameSettler` for why the wait is a frame count and not a duration.
 *
 * The observer is created once and its target set is re-synced on every commit rather than rebuilt, so adding
 * or removing children costs one `observe`/`unobserve` each rather than a full teardown.
 *
 * @param containerRef Container whose direct children are watched.
 * @param enabled When false, nothing is observed and any pending callback is dropped.
 * @param onSettled Called after the children's sizes stop changing. Re-read on every render, so it does not
 * need to be stable.
 */
export function useChildrenResizeObserver<T extends HTMLElement>(
  containerRef: React.RefObject<T | null>,
  enabled: boolean,
  onSettled: () => void,
): void {
  // Read through a ref so the observer, which outlives any single render, always calls the current closure.
  const latestOnSettled = useRef(onSettled);
  latestOnSettled.current = onSettled;

  const observerRef = useRef<ResizeObserver | null>(null);
  const observedRef = useRef<Set<Element>>(new Set());
  const settlerRef = useRef<ReturnType<typeof createFrameSettler> | null>(null);

  const stop = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
      observedRef.current.clear();
    }
    // Cancel a wait already in flight, so turning this off does not still cost one call afterwards.
    settlerRef.current?.cancel();
    settlerRef.current = null;
  };

  // No dependency array: the child list is what has to be tracked, and it is not something a dependency can
  // describe. Re-syncing is cheap, since only added and removed children are touched.
  useIsoLayoutEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container || typeof ResizeObserver === "undefined") {
      // Never enabled, or just turned off: drop the observer and any callback it was about to run.
      stop();
      return;
    }

    settlerRef.current ??= createFrameSettler(() => latestOnSettled.current());
    const settler = settlerRef.current;
    observerRef.current ??= new ResizeObserver(() => settler.bump());

    const observer = observerRef.current;
    const observed = observedRef.current;
    const children = new Set<Element>(Array.from(container.children));

    for (const child of Array.from(observed)) {
      if (!children.has(child)) {
        observer.unobserve(child);
        observed.delete(child);
      }
    }
    for (const child of children) {
      if (!observed.has(child)) {
        observer.observe(child, { box: "border-box" });
        observed.add(child);
      }
    }
  });

  useIsoLayoutEffect(() => stop, []);
}
