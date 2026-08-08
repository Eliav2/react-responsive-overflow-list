// @vitest-environment jsdom
// Unit cover for useChildrenResizeObserver on its own, for the parts of it that the list's behaviour cannot
// discriminate. Uses the same fake layout model, since jsdom has no layout engine — see ./layout-harness.

import { act, cleanup, render } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useChildrenResizeObserver } from "../../src/hooks/useChildrenResizeObserver";
import { installLayoutHarness } from "./layout-harness";

/**
 * Advances past the hook's quiet-frame wait. It waits two chained frames, because within a frame the browser
 * runs rAF callbacks before ResizeObserver ones, so a single frame lands before the next notification would.
 */
function advanceToSettled() {
  vi.advanceTimersToNextFrame();
  vi.advanceTimersToNextFrame();
}

let harness: ReturnType<typeof installLayoutHarness> | null = null;

beforeEach(() => {
  vi.useFakeTimers();
  harness = installLayoutHarness({ containerWidth: 500 });
});

afterEach(() => {
  cleanup();
  harness?.restore();
  harness = null;
  vi.useRealTimers();
});

function Host({ enabled, onSettled }: { enabled: boolean; onSettled: () => void }) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  useChildrenResizeObserver(containerRef, enabled, onSettled);
  return (
    <div ref={containerRef} data-testid="container">
      <span data-test-width={100}>a</span>
      <span data-test-width={100}>b</span>
    </div>
  );
}

describe("useChildrenResizeObserver", () => {
  it("calls the latest callback, not the one it started observing with", () => {
    // The observer is created once and outlives the render that created it, so a callback captured at that
    // moment would be frozen along with everything it closes over. In the list that means a stale `phase`,
    // which is not visible in its behaviour: the pieces the check mutates are refs, shared either way.
    const first = vi.fn();
    const second = vi.fn();

    const view = render(<Host enabled onSettled={first} />);
    // An observer delivers an initial observation for each target it starts on, which arms the wait. Let that
    // one through first, so what this asserts is the swap and not the mount.
    act(() => {
      advanceToSettled();
    });
    first.mockClear();

    view.rerender(<Host enabled onSettled={second} />);

    act(() => {
      harness!.notifyResizeObservers();
      advanceToSettled();
    });

    expect(second).toHaveBeenCalled();
    expect(first).not.toHaveBeenCalled();
  });

  it("observes nothing while disabled, and picks the children up when turned on", () => {
    const onSettled = vi.fn();
    const view = render(<Host enabled={false} onSettled={onSettled} />);
    const container = view.getByTestId("container");
    const isChild = ({ target }: { target: Element }) => target.parentElement === container;

    expect(harness!.observedBoxes().filter(isChild)).toEqual([]);

    view.rerender(<Host enabled onSettled={onSettled} />);

    expect(harness!.observedBoxes().filter(isChild)).toHaveLength(2);
  });

  it("drops a pending callback when turned off mid-flight", () => {
    // Turning it off has to cancel work already queued, not just stop new work. Otherwise a list that opts out
    // still gets one more pass after the fact.
    const onSettled = vi.fn();
    const view = render(<Host enabled onSettled={onSettled} />);
    act(() => {
      advanceToSettled();
    });
    onSettled.mockClear();

    act(() => {
      harness!.notifyResizeObservers();
      // One frame in, so the wait is armed but has not completed.
      vi.advanceTimersToNextFrame();
    });
    expect(onSettled).not.toHaveBeenCalled();

    view.rerender(<Host enabled={false} onSettled={onSettled} />);

    act(() => {
      advanceToSettled();
    });

    expect(onSettled).not.toHaveBeenCalled();
  });

  it("stops observing on unmount", () => {
    const onSettled = vi.fn();
    const view = render(<Host enabled onSettled={onSettled} />);

    expect(harness!.observedBoxes().length).toBeGreaterThan(0);

    view.unmount();

    expect(harness!.observedBoxes()).toEqual([]);
  });
  it("keeps waiting while the sizes are still moving, then fires once", () => {
    // The mechanism, stated directly: a notification every frame means still moving, and one quiet frame means
    // stopped. No duration is involved, so nothing here has a number to tune.
    const onSettled = vi.fn();
    render(<Host enabled onSettled={onSettled} />);
    act(() => {
      advanceToSettled();
    });
    onSettled.mockClear();

    act(() => {
      for (let frame = 0; frame < 10; frame++) {
        harness!.notifyResizeObservers();
        vi.advanceTimersToNextFrame();
      }
    });

    expect(onSettled).not.toHaveBeenCalled();

    act(() => {
      advanceToSettled();
    });

    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  // Not covered here, deliberately: whether the wait needs one frame or two. This harness delivers a
  // notification the moment a test asks for one, where a browser delivers it at a fixed point in the frame, so
  // a one-frame wait passes everything below. The second frame is justified by measurement instead — in Chrome
  // a frame's ResizeObserver callbacks run after its rAF callbacks, so a single frame would be compared before
  // the next notification exists and would fire in the middle of a continuous change. Covering it properly
  // means teaching the harness to deliver at the frame's observer point, which every other test's timing
  // currently depends on not doing.
  //
  // Whether a browser delivers resize observations before or after that frame's rAF callbacks is not
  // specified: the ResizeObserver spec only places its algorithms somewhere inside "update the rendering", and
  // https://github.com/WICG/resize-observer/issues/37 has been open on exactly this since 2017. Chrome runs
  // rAF first (measured). So drive both orders and require the same outcome, rather than trusting the one
  // engine that was measured.
  for (const notifyAfterFrame of [true, false]) {
    const order = notifyAfterFrame ? "after that frame's callbacks (Chrome)" : "before that frame's callbacks";

    it(`settles when notifications arrive ${order}`, () => {
      const onSettled = vi.fn();
      render(<Host enabled onSettled={onSettled} />);
      act(() => {
        advanceToSettled();
      });
      onSettled.mockClear();

      act(() => {
        for (let frame = 0; frame < 10; frame++) {
          if (notifyAfterFrame) {
            vi.advanceTimersToNextFrame();
            harness!.notifyResizeObservers();
          } else {
            harness!.notifyResizeObservers();
            vi.advanceTimersToNextFrame();
          }
        }
      });

      // Still moving under either order, so nothing has run yet.
      expect(onSettled).not.toHaveBeenCalled();

      act(() => {
        advanceToSettled();
      });

      expect(onSettled).toHaveBeenCalledTimes(1);
    });
  }
});
