// jsdom has no layout engine: `getBoundingClientRect` returns all zeros and `getClientRects` returns an
// empty list. Under those values `getRowPositionsData` filters out every child and measurement quietly does
// nothing — tests would pass against a component that does not work at all.
//
// So these tests run against a deliberately simple flex-wrap model. Items declare their width through
// `data-test-width`, the container declares its width, and rects are computed by filling rows left to right.
//
// What this buys: the phase machine, the invalidation triggers, and the visible-count arithmetic are all
// exercised deterministically. What it does not buy: anything that depends on real layout (`min-width: auto`
// on flex items, fractional pixel grids, font metrics). Those stay covered by the Storybook stories, which
// run in a real browser.

const ROW_HEIGHT = 20;
const GAP = 0;

export interface HarnessOptions {
  /** Width available to the container's content box. */
  containerWidth: number;
}

interface HarnessState {
  containerWidth: number;
}

const state: HarnessState = { containerWidth: 0 };

/** Width an element reports. Elements without `data-test-width` measure as zero-width. */
function declaredWidth(element: Element): number {
  const raw = element.getAttribute("data-test-width");
  return raw === null ? 0 : Number(raw);
}

/** True when the element is hidden the way the component hides overflowed items. */
function isHidden(element: Element): boolean {
  const style = (element as HTMLElement).style;
  if (style?.display === "none") return true;
  return element.getAttribute("data-test-hidden") === "true";
}

function isOutOfFlow(element: Element): boolean {
  const position = (element as HTMLElement).style?.position;
  return position === "absolute" || position === "fixed";
}

/**
 * Lays out a container's children by filling rows left to right, and returns each child's rect. Hidden and
 * out-of-flow children get a zero rect, matching how a browser treats them.
 */
function layoutOf(container: Element): Map<Element, { x: number; y: number; width: number; height: number }> {
  const rects = new Map<Element, { x: number; y: number; width: number; height: number }>();
  let rowIndex = 0;
  let usedInRow = 0;

  for (const child of Array.from(container.children)) {
    if (isHidden(child)) {
      rects.set(child, { x: 0, y: 0, width: 0, height: 0 });
      continue;
    }

    const width = declaredWidth(child);

    if (isOutOfFlow(child)) {
      // Out of flow: it has a box, but it does not consume row space and it does not sit on the item row.
      // Anchored above the container so a naive row grouping would sort it first — the #23 failure mode.
      rects.set(child, { x: 0, y: -1, width, height: 1 });
      continue;
    }

    const needed = usedInRow === 0 ? width : usedInRow + GAP + width;
    if (usedInRow > 0 && needed > state.containerWidth) {
      rowIndex += 1;
      usedInRow = 0;
    }

    const x = usedInRow === 0 ? 0 : usedInRow + GAP;
    rects.set(child, { x, y: rowIndex * ROW_HEIGHT, width, height: ROW_HEIGHT });
    usedInRow = x + width;
  }

  return rects;
}

function rectFor(element: Element): { x: number; y: number; width: number; height: number } {
  const parent = element.parentElement;
  if (!parent) return { x: 0, y: 0, width: 0, height: 0 };

  // The container itself reports the width it was given, and grows to fit however many rows its children use.
  if (element.hasAttribute("data-test-container")) {
    const rows = new Set(
      Array.from(layoutOf(element).entries())
        .filter(([child, rect]) => rect.height > 0 && !isOutOfFlow(child))
        .map(([, rect]) => rect.y),
    );
    const fixedHeight = element.getAttribute("data-test-fixed-height");
    return {
      x: 0,
      y: 0,
      width: state.containerWidth,
      height: fixedHeight !== null ? Number(fixedHeight) : Math.max(rows.size, 1) * ROW_HEIGHT,
    };
  }

  return layoutOf(parent).get(element) ?? { x: 0, y: 0, width: 0, height: 0 };
}

/**
 * Installs the layout model plus a ResizeObserver that reports the container's box, the way a browser's does.
 * Returns a handle for driving the container's width. Call `restore()` in cleanup.
 */
export function installLayoutHarness({ containerWidth }: HarnessOptions) {
  state.containerWidth = containerWidth;

  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const originalGetClientRects = Element.prototype.getClientRects;
  const originalResizeObserver = globalThis.ResizeObserver;

  Element.prototype.getBoundingClientRect = function (this: Element) {
    const { x, y, width, height } = rectFor(this);
    return {
      x,
      y,
      width,
      height,
      top: y,
      bottom: y + height,
      left: x,
      right: x + width,
      toJSON() {
        return this;
      },
    } as DOMRect;
  };

  Element.prototype.getClientRects = function (this: Element) {
    const { width, height } = rectFor(this);
    // A hidden element has no boxes at all, which is exactly what the component's filter checks for.
    const list = width === 0 && height === 0 ? [] : [this.getBoundingClientRect()];
    return Object.assign(list, { item: (i: number) => list[i] ?? null }) as unknown as DOMRectList;
  };

  interface Observation {
    target: Element;
    callback: ResizeObserverCallback;
    observer: ResizeObserver;
    /** Which box was requested. This model does not distinguish them, but the choice still matters: measured
     * in Chrome, a child's padding or border changing fires a border-box observer and not a content-box one,
     * while `getBoundingClientRect` moves either way. Recorded so a test can assert what was asked for. */
    box: ResizeObserverBoxOptions;
  }

  const observers = new Set<Observation>();

  /** Delivers one observation with its target's current box, the shape a browser reports. */
  function notifyOne({ target, callback, observer }: Observation) {
    const rect = target.getBoundingClientRect();
    callback(
      [
        {
          target,
          contentRect: rect,
          borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
          contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
          devicePixelContentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
        } as unknown as ResizeObserverEntry,
      ],
      observer,
    );
  }

  class HarnessResizeObserver implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}
    observe(target: Element, options?: ResizeObserverOptions) {
      const entry = { target, callback: this.callback, observer: this, box: options?.box ?? "content-box" };
      observers.add(entry);
      // A real ResizeObserver delivers an initial observation for every target it starts observing, so a
      // consumer has its box before anything resizes. Delivered synchronously here rather than in a
      // microtask, so that it lands during mount instead of being flushed by whatever a test does first.
      // Otherwise a test's own first notification stands in for it and looks like a change.
      notifyOne(entry);
    }
    unobserve(target: Element) {
      for (const entry of observers) if (entry.target === target && entry.observer === this) observers.delete(entry);
    }
    disconnect() {
      for (const entry of observers) if (entry.observer === this) observers.delete(entry);
    }
  }

  globalThis.ResizeObserver = HarnessResizeObserver as unknown as typeof ResizeObserver;

  /** Fires every observer with its target's current box, as a browser would after a layout change. */
  const notifyResizeObservers = () => {
    for (const observation of [...observers]) notifyOne(observation);
  };

  return {
    /** Change the width available to containers, then fire resize observers. */
    setContainerWidth(width: number) {
      state.containerWidth = width;
      notifyResizeObservers();
    },
    notifyResizeObservers,
    /** Every target currently observed, and which box it was registered with. */
    observedBoxes() {
      return [...observers].map(({ target, box }) => ({ target, box }));
    },
    restore() {
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
      Element.prototype.getClientRects = originalGetClientRects;
      globalThis.ResizeObserver = originalResizeObserver;
      observers.clear();
    },
  };
}

export const HARNESS_ROW_HEIGHT = ROW_HEIGHT;
