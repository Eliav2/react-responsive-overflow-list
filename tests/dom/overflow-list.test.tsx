// @vitest-environment jsdom
// Regression cover for the measurement machine, against the fake layout model in ./layout-harness.
// Read that file's header first: these tests prove the state machine's logic, not real browser layout.

import { act, cleanup, render } from "@testing-library/react";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OverflowList } from "../../src";
import { HARNESS_ROW_HEIGHT, installLayoutHarness } from "./layout-harness";

const ITEM_WIDTH = 100;
const INDICATOR_WIDTH = 40;
/** Advances past the item observer's quiet-frame wait, which is two chained frames. */
function advanceToSettled() {
  vi.advanceTimersToNextFrame();
  vi.advanceTimersToNextFrame();
}

let harness: ReturnType<typeof installLayoutHarness> | null = null;

afterEach(() => {
  cleanup();
  harness?.restore();
  harness = null;
});

interface Item {
  label: string;
  width: number;
}

interface ListOptions {
  containerWidth: number;
  itemWidths?: number[];
  itemCount?: number;
  maxRows?: number;
  fixedHeight?: number;
  /** Keep overflowed items mounted and hidden, the way React 19.2's `Activity` does. */
  keepHiddenItemsMounted?: boolean;
  /** Called on every render of the list, to count measurement passes. */
  onRender?: () => void;
  /** Opt into re-measuring on item-driven size changes. */
  observeItemSizes?: boolean;
}

/** Renders a list in the harness and returns helpers for asserting what ended up visible. */
function renderList(options: ListOptions) {
  const {
    containerWidth,
    itemWidths,
    itemCount = 5,
    maxRows = 1,
    fixedHeight,
    keepHiddenItemsMounted,
    onRender,
    observeItemSizes,
  } = options;

  harness = installLayoutHarness({ containerWidth });

  const widths = itemWidths ?? Array.from({ length: itemCount }, () => ITEM_WIDTH);
  const toItems = (source: number[]): Item[] => source.map((width, index) => ({ label: `item${index}`, width }));

  const Wrapper = ({ items }: { items: Item[] }) => (
    <OverflowList
      items={items}
      maxRows={maxRows}
      observeItemSizes={observeItemSizes}
      data-test-container=""
      {...(fixedHeight !== undefined ? { "data-test-fixed-height": String(fixedHeight) } : {})}
      renderItem={(item) => {
        onRender?.();
        return (
          <span data-testid={item.label} data-test-width={item.width}>
            {item.label}
          </span>
        );
      }}
      {...(keepHiddenItemsMounted
        ? {
            renderItemVisibility: (node: React.ReactNode, meta: { index: number; visible: boolean }) => (
              <span key={meta.index} style={{ display: meta.visible ? "inline" : "none" }} data-test-width={ITEM_WIDTH}>
                {node}
              </span>
            ),
          }
        : {})}
      renderOverflow={(hidden) => (
        <span data-testid="indicator" data-test-width={INDICATOR_WIDTH}>
          +{hidden.length}
        </span>
      )}
    />
  );

  const view = render(<Wrapper items={toItems(widths)} />);

  const container = () => view.container.querySelector("[data-test-container]") as HTMLElement;

  const laidOut = () =>
    Array.from(container().children).filter(
      (child) => child.getClientRects().length > 0 && (child as HTMLElement).style.position !== "fixed",
    );

  return {
    container,
    visibleLabels: () => laidOut().map((child) => child.textContent ?? ""),
    rowCount: () => new Set(laidOut().map((child) => child.getBoundingClientRect().top)).size,
    /** Re-render with new item widths, without changing the item count. */
    setItemWidths(next: number[]) {
      act(() => {
        view.rerender(<Wrapper items={toItems(next)} />);
      });
    },
    /**
     * Appends children the component did not render, the way a popover library injects focus guards around
     * an open trigger, then lets the list re-measure.
     */
    injectForeignChildren(nodes: { width: number; position?: string }[]) {
      act(() => {
        for (const node of nodes) {
          const element = document.createElement("span");
          element.setAttribute("data-test-width", String(node.width));
          element.setAttribute("aria-hidden", "true");
          if (node.position) element.style.position = node.position;
          container().appendChild(element);
        }
        harness!.notifyResizeObservers();
      });
    },
  };
}

describe("fitting items into the container", () => {
  it("shows every item and no indicator when they all fit", () => {
    const list = renderList({ containerWidth: 600, itemCount: 5 });

    expect(list.visibleLabels()).toEqual(["item0", "item1", "item2", "item3", "item4"]);
    expect(list.rowCount()).toBe(1);
  });

  it("hides the items that do not fit behind the indicator", () => {
    const list = renderList({ containerWidth: 250, itemCount: 5 });

    // 100 + 100 leaves 50 for the 40-wide indicator.
    expect(list.visibleLabels()).toEqual(["item0", "item1", "+3"]);
    expect(list.rowCount()).toBe(1);
  });

  it("respects maxRows greater than one", () => {
    const list = renderList({ containerWidth: 250, itemCount: 6, maxRows: 2 });

    expect(list.rowCount()).toBeLessThanOrEqual(2);
    const labels = list.visibleLabels();
    expect(labels[labels.length - 1]).toMatch(/^\+\d+$/);
  });
});

describe("children that are not items (#23)", () => {
  it("ignores overflowed items kept mounted but hidden", () => {
    // The default `renderItemVisibility` does this via `Activity` on React 19.2. Without the zero-rect filter
    // the hidden items form a phantom row and the list collapses to a bare indicator.
    const list = renderList({ containerWidth: 250, itemCount: 5, keepHiddenItemsMounted: true });

    expect(list.visibleLabels()).toEqual(["item0", "item1", "+3"]);
    expect(list.rowCount()).toBe(1);
  });

  it("ignores out-of-flow children such as popover focus guards", () => {
    const list = renderList({ containerWidth: 250, itemCount: 5 });
    const before = list.visibleLabels();

    list.injectForeignChildren([
      { width: 1, position: "fixed" },
      { width: 1, position: "fixed" },
    ]);

    expect(list.visibleLabels()).toEqual(before);
    expect(list.rowCount()).toBe(1);
  });
});

describe("items that change size on their own (#21)", () => {
  it("re-measures when items grow, with the container's box pinned", () => {
    const list = renderList({
      containerWidth: 250,
      itemWidths: [100, 100, 100, 100, 100],
      fixedHeight: HARNESS_ROW_HEIGHT,
    });

    expect(list.visibleLabels()).toEqual(["item0", "item1", "+3"]);

    // Badges appear: every item widens. The container's box cannot change, so its ResizeObserver stays quiet
    // and the settled content signature is the only thing left to notice.
    list.setItemWidths([140, 140, 140, 140, 140]);

    expect(list.rowCount()).toBe(1);
    expect(list.visibleLabels()).toEqual(["item0", "+4"]);
  });

  it("re-measures when items shrink, so hidden items come back", () => {
    const list = renderList({
      containerWidth: 250,
      itemWidths: [140, 140, 140, 140, 140],
      fixedHeight: HARNESS_ROW_HEIGHT,
    });

    expect(list.visibleLabels()).toEqual(["item0", "+4"]);

    list.setItemWidths([60, 60, 60, 60, 60]);

    expect(list.rowCount()).toBe(1);
    expect(list.visibleLabels()).toEqual(["item0", "item1", "item2", "+2"]);
  });

  it("notices a redistribution that leaves the total width identical", () => {
    // End-to-end cover for redistribution: both vectors total 160, and the outcome still differs, because
    // what fits is decided by the running sum along the row — [40,40,40,40] leaves room for two items beside
    // the 40-wide indicator, while [90,20,10,40] leaves room for none.
    //
    // This does not by itself prove the signature resists being reduced to a single number: the signature
    // only covers the *visible* children, so item0 widening from 40 to 90 moves any reduction of it too. The
    // cases that actually discriminate are the collision tests in ./content-signature.test.ts.
    const list = renderList({
      containerWidth: 120,
      itemWidths: [40, 40, 40, 40],
      fixedHeight: HARNESS_ROW_HEIGHT,
    });

    expect(list.visibleLabels()).toEqual(["item0", "item1", "+2"]);

    list.setItemWidths([90, 20, 10, 40]);

    expect(list.rowCount()).toBe(1);
    expect(list.visibleLabels()).toEqual(["+4"]);
  });
});

describe("container resize", () => {
  it("re-measures when the container's own width changes", () => {
    const list = renderList({ containerWidth: 600, itemCount: 5 });
    expect(list.visibleLabels()).toEqual(["item0", "item1", "item2", "item3", "item4"]);

    act(() => {
      harness!.setContainerWidth(250);
    });

    expect(list.visibleLabels()).toEqual(["item0", "item1", "+3"]);
    expect(list.rowCount()).toBe(1);
  });
});

describe("settling", () => {
  it("does not start a new pass when a re-render changes nothing", () => {
    // The signature check runs on every commit, so this is the loop it could cause. `renderItem` is called
    // once per item per render of the list, so one plain re-render must cost exactly one item's worth of
    // calls — anything more means a measuring pass was entered and nothing external had changed.
    const itemCount = 5;
    let renderItemCalls = 0;
    const list = renderList({
      containerWidth: 250,
      itemCount,
      onRender: () => {
        renderItemCalls += 1;
      },
    });

    const afterSettling = renderItemCalls;
    list.setItemWidths(Array.from({ length: itemCount }, () => ITEM_WIDTH));

    expect(renderItemCalls - afterSettling).toBe(itemCount);
    expect(list.visibleLabels()).toEqual(["item0", "item1", "+3"]);
    expect(list.rowCount()).toBe(1);
  });

  it("does not start a pass when a resize reports an unchanged box", () => {
    // An observer fires once when it starts observing, and hiding or revealing an element can produce a
    // notification without its box moving. `useResizeObserver` used to store a fresh object per
    // notification, so each of those cost a full re-measure downstream.
    const itemCount = 5;
    let renderItemCalls = 0;
    // Height pinned, so the container's box is genuinely identical across notifications. Without pinning it
    // the box really does change while measuring settles, and a notification reporting that is not churn.
    const list = renderList({
      containerWidth: 250,
      itemCount,
      fixedHeight: HARNESS_ROW_HEIGHT,
      onRender: () => {
        renderItemCalls += 1;
      },
    });

    const before = list.visibleLabels();
    const afterSettling = renderItemCalls;

    act(() => {
      harness!.notifyResizeObservers();
    });
    act(() => {
      harness!.notifyResizeObservers();
    });

    expect(renderItemCalls).toBe(afterSettling);
    expect(list.visibleLabels()).toEqual(before);
    expect(list.rowCount()).toBe(1);
  });
});

describe("observeItemSizes", () => {
  /** Widens every laid-out child in the DOM, with no re-render, the way a drag handle or a late font would. */
  function widenLaidOutChildren(container: HTMLElement, width: number) {
    for (const child of Array.from(container.children)) {
      if (child.getClientRects().length > 0) child.setAttribute("data-test-width", String(width));
    }
  }

  it("is off by default, so the children are not observed", () => {
    // The default has to stay off: the whole point of the option is that a list which never needs it pays
    // nothing. Asserted on what gets observed rather than on behaviour, since "nothing happened" is also what
    // a broken test looks like.
    const list = renderList({ containerWidth: 250, itemCount: 5 });
    const container = list.container();

    const observedChildren = harness!.observedBoxes().filter(({ target }) => target.parentElement === container);

    expect(observedChildren).toEqual([]);
    // The container itself is still observed, which is what drives every other invalidation path.
    expect(harness!.observedBoxes().some(({ target }) => target === container)).toBe(true);
  });

  it("leaves an item-driven change unnoticed when off", () => {
    const list = renderList({
      containerWidth: 250,
      itemWidths: [100, 100, 100, 100, 100],
      fixedHeight: HARNESS_ROW_HEIGHT,
    });

    expect(list.visibleLabels()).toEqual(["item0", "item1", "+3"]);

    act(() => {
      widenLaidOutChildren(list.container(), 140);
      harness!.notifyResizeObservers();
    });

    // The container's box cannot change and nothing rendered, so the count is stale by design.
    expect(list.visibleLabels()).toEqual(["item0", "item1", "+3"]);
  });

  it("observes the children on their border box when on", () => {
    // Not something this layout model can show by behaviour, and not cosmetic either: measured in Chrome, a
    // child's padding or border changing fires a border-box observer and not a content-box one, while the
    // signature reads `getBoundingClientRect`, which moves either way. Left on the default box the observer
    // would stay silent for exactly the changes the check is looking for, so assert what was asked for.
    const list = renderList({ containerWidth: 250, itemCount: 5, observeItemSizes: true });
    const container = list.container();

    const childBoxes = harness!.observedBoxes().filter(({ target }) => target.parentElement === container);

    expect(childBoxes.length).toBeGreaterThan(0);
    expect(childBoxes.every(({ box }) => box === "border-box")).toBe(true);
  });

  it("stops observing children that leave the container", () => {
    // The observed set is re-synced per commit rather than rebuilt, so a missed removal is not visible in the
    // list's behaviour: it just retains detached nodes and keeps being notified about them.
    const list = renderList({
      containerWidth: 250,
      itemWidths: [100, 100, 100, 100, 100],
      observeItemSizes: true,
      fixedHeight: HARNESS_ROW_HEIGHT,
    });

    expect(harness!.observedBoxes().length).toBeGreaterThan(1);

    list.setItemWidths([100, 100]);

    expect(harness!.observedBoxes().filter(({ target }) => !target.isConnected)).toEqual([]);
  });

  describe("when on", () => {
    beforeEach(() => {
      // The item-driven path waits for sizes to hold still, so these drive the clock rather than sleep.
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("re-measures when an item's box changes with no React involvement", () => {
      const list = renderList({
        containerWidth: 250,
        itemWidths: [100, 100, 100, 100, 100],
        observeItemSizes: true,
        fixedHeight: HARNESS_ROW_HEIGHT,
      });

      expect(list.visibleLabels()).toEqual(["item0", "item1", "+3"]);

      // The observer's initial observation of each child arms the wait, so let that settle before the change
      // under test, or the change reads as "still moving" and waits another frame.
      act(() => {
        advanceToSettled();
      });

      act(() => {
        widenLaidOutChildren(list.container(), 140);
        harness!.notifyResizeObservers();
        advanceToSettled();
      });

      expect(list.rowCount()).toBe(1);
      expect(list.visibleLabels()).toEqual(["item0", "+4"]);
    });

    it("waits for the sizes to hold still before measuring", () => {
      // A dragged handle or an animating width notifies on every frame. Re-measuring per frame is what the
      // quiet-frame wait exists to avoid, so notifications that keep arriving must keep the pass waiting.
      const itemCount = 5;
      let renderItemCalls = 0;
      const list = renderList({
        containerWidth: 250,
        itemWidths: Array.from({ length: itemCount }, () => 100),
        observeItemSizes: true,
        fixedHeight: HARNESS_ROW_HEIGHT,
        onRender: () => {
          renderItemCalls += 1;
        },
      });

      act(() => {
        advanceToSettled();
      });
      const settled = renderItemCalls;
      const before = list.visibleLabels();

      // Ten frames of a still-moving size: each notification arrives before the previous could settle.
      act(() => {
        for (let frame = 1; frame <= 10; frame++) {
          widenLaidOutChildren(list.container(), 100 + frame * 4);
          harness!.notifyResizeObservers();
          vi.advanceTimersToNextFrame();
        }
      });

      expect(renderItemCalls).toBe(settled);
      expect(list.visibleLabels()).toEqual(before);

      // Now the sizes hold still, and exactly one pass runs against the final sizes.
      act(() => {
        advanceToSettled();
      });

      expect(list.rowCount()).toBe(1);
      expect(list.visibleLabels()).toEqual(["item0", "+4"]);
    });
  });
});
