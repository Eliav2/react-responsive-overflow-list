import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";

/**
 * Hands you a drag handle on every item, so item sizes can be changed by hand with React uninvolved.
 *
 * Each item uses the browser's native `resize: horizontal`, which writes an inline width straight onto the
 * DOM node. No state changes, no render. That is the point: measurement is re-triggered by `[itemCount,
 * maxRows]`, by the container's own ResizeObserver, or by the content-signature check that runs on every
 * commit. Dragging a handle trips none of them directly, so whether the list keeps up depends entirely on
 * whether the drag happens to change the container's own box.
 *
 * `observeItemSizes` is the opt-in that closes that gap, and the toggle flips it live. Drag with it OFF to see
 * the list go stale, then turn it on and drag again. Off is the default, because it means a ResizeObserver over
 * every child, and most lists never need one.
 *
 * The container has a handle of its own, for contrast. Dragging it changes the container's own box, which the
 * list already watches with nothing opted into, so it re-measures either way. Dragging an item changes only a
 * child. Same gesture, and only one of the two is covered by default.
 *
 * Drag a handle (bottom-right corner of any item) and watch the readout. What to look for is in each story's
 * description.
 *
 * The readout is written straight into the DOM from a requestAnimationFrame loop, and this component holds no
 * state that changes while you drag. A `setState` here would re-render the list, the per-commit check would
 * run, and the whole thing would appear to work.
 */

const LABELS = ["Overview", "Assets", "Issues", "Policies", "Reports", "Settings", "Audit", "Billing"];

/** Repeats the label set up to `count`, so the same story can be run at a realistic list length. */
function labelsFor(count: number): string[] {
  return Array.from({ length: count }, (_, index) =>
    index < LABELS.length ? LABELS[index] : `${LABELS[index % LABELS.length]} ${Math.floor(index / LABELS.length) + 1}`,
  );
}

interface StoryProps {
  /**
   * Pin the height of the list element itself. A pinned list cannot report a size change of its own, which is
   * the normal shape of a tab bar. It has to be the list element and not a wrapper: a pinned wrapper still
   * lets the list grow to two rows inside it, and the list's own observer reports that.
   */
  pinListHeight?: boolean;
  containerWidth: number;
  maxRows?: number;
  /** Starting value for the in-story toggle. */
  observeItemSizes?: boolean;
  /** How many items to render. Every pass costs one render per item, so this is what scales the cost. */
  itemCount?: number;
}

function ResizableList({
  pinListHeight,
  containerWidth,
  maxRows = 1,
  observeItemSizes = false,
  itemCount = LABELS.length,
}: StoryProps) {
  const items = labelsFor(itemCount);
  const listRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLPreElement | null>(null);
  // Remounting is the one thing here that is allowed to change state, and only between drags.
  const [remountKey, setRemountKey] = useState(0);
  // A render that does not remount. The dragged widths survive it, because they live as inline styles that
  // React does not own, so this isolates the one thing a render adds: the per-commit signature check.
  const [renderCount, setRenderCount] = useState(0);
  // Flipping this is itself a render, so it heals the list on the way. Drag again afterwards to see the
  // difference: that is what the button label says.
  const [observing, setObserving] = useState(observeItemSizes);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const list = listRef.current;
      const readout = readoutRef.current;
      if (list && readout) {
        const children = Array.from(list.children) as HTMLElement[];
        const laidOut = children.filter(
          (child) => child.getClientRects().length > 0 && getComputedStyle(child).position === "static",
        );
        const rows = new Set(laidOut.map((child) => Math.round(child.getBoundingClientRect().top)));
        const listBox = list.getBoundingClientRect();
        const widths = laidOut.map((child) => Math.round(child.getBoundingClientRect().width));
        const used = widths.reduce((total, width) => total + width, 0);
        const lastRight = laidOut.length
          ? Math.round(laidOut[laidOut.length - 1].getBoundingClientRect().right - listBox.left)
          : 0;

        readout.textContent = [
          `showing        ${laidOut.map((child) => child.textContent).join("  ")}`,
          `rows           ${rows.size}${rows.size > maxRows ? `   <-- OVER maxRows=${maxRows}` : ""}`,
          `list box       ${Math.round(listBox.width)} x ${Math.round(listBox.height)}`,
          `item widths    ${widths.join(" + ")} = ${used}`,
          `last item ends ${lastRight} of ${Math.round(listBox.width)}${
            lastRight > Math.round(listBox.width) ? "   <-- PAST THE EDGE" : ""
          }`,
          `free space     ${Math.round(listBox.width) - lastRight}`,
          `container      ${Math.round(list.parentElement?.getBoundingClientRect().width ?? 0)} wide (drag its corner too)`,
        ].join("\n");
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [maxRows]);

  return (
    <div className="flex flex-col gap-3 p-4 font-sans">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          className={`rounded border px-3 py-1 ${observing ? "border-emerald-600 bg-emerald-100" : "bg-white"}`}
          onClick={() => setObserving((on) => !on)}
        >
          observeItemSizes: {observing ? "ON" : "OFF"}
        </button>
        <button className="rounded border px-3 py-1" onClick={() => setRenderCount((count) => count + 1)}>
          Force re-render ({renderCount})
        </button>
        <button className="rounded border px-3 py-1" onClick={() => setRemountKey((key) => key + 1)}>
          Remount ({remountKey})
        </button>
        <span className="text-slate-500">
          drag the bottom-right corner of any <strong>item</strong>, or of the <strong>container</strong> box
          itself. Toggling is a render, so it heals the list first: drag <em>after</em> toggling. Force
          re-render keeps your widths; Remount resets them.
        </span>
      </div>

      {/*
        The container gets a handle too, so both invalidation paths are reachable by hand: dragging this one
        changes the container's own box, which its ResizeObserver reports with no opt-in needed, while dragging
        an item changes only a child. `resize` needs an overflow other than `visible` to offer a handle.
      */}
      <div
        className="rounded border border-slate-300 p-2"
        style={{ width: containerWidth, minWidth: 120, resize: "horizontal", overflow: "hidden" }}
      >
        <OverflowList
          key={remountKey}
          ref={listRef}
          items={items}
          maxRows={maxRows}
          observeItemSizes={observing}
          style={{
            gap: 8,
            ...(pinListHeight ? { height: maxRows * 40, overflow: "hidden" } : {}),
          }}
          renderItem={(label: string) => (
            // `resize` needs an overflow other than `visible` and a block-level box to give a handle. Width is
            // deliberately not set from React: the native handle writes an inline width, and a React-owned
            // width would be reapplied on the next render and undo the drag.
            <span
              className="rounded border border-dashed border-slate-400 bg-slate-100 px-2 py-1 text-sm whitespace-nowrap"
              style={{ display: "inline-block", overflow: "hidden", resize: "horizontal", minWidth: 40 }}
            >
              {label}
            </span>
          )}
          renderOverflow={(hidden: string[]) => (
            <span className="rounded border border-slate-400 bg-amber-100 px-2 py-1 text-sm whitespace-nowrap">
              +{hidden.length}
            </span>
          )}
        />
      </div>

      <pre ref={readoutRef} className="rounded bg-slate-100 p-2 text-xs leading-5 whitespace-pre-wrap" />
    </div>
  );
}

const meta = {
  title: "Behaviour/ResizableChildren",
  component: ResizableList,
} satisfies Meta<typeof ResizableList>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Widen an item until the row cannot hold what is showing.
 *
 * The list's height is free to grow here, so the items wrap, the list gets taller, and its own
 * ResizeObserver reports that. A pass runs and the count catches up. This is the self-heal that made #21 look
 * intermittent: the list is not noticing the item, it is noticing itself.
 */
export const WidenAnItem: Story = {
  args: { containerWidth: 340 },
};

/**
 * Now shrink an item instead, and drag it well below its label width.
 *
 * Nothing wraps, so the list's box never changes and nothing re-triggers measurement. Free space opens up in
 * the row while the indicator keeps claiming the same hidden items, and they do not come back. Watch `free
 * space` in the readout climb with the indicator unchanged.
 *
 * The clearest one to try the toggle on: shrinking needs no pinned height to break, because shrinking never
 * wraps, so there is no self-heal to hide behind. With `observeItemSizes` on, the hidden items come back about
 * a frame or two after you let go of the handle.
 */
export const ShrinkAnItem: Story = {
  args: { containerWidth: 340 },
};

/**
 * Widen an item with the list's own height pinned, the shape of a fixed-height tab bar.
 *
 * The self-heal above is gone: the list cannot report a size change, so widening past the edge stays broken.
 * Watch `last item ends` go past the list width and stay there. Turning `observeItemSizes` on fixes it.
 */
export const WidenWithPinnedHeight: Story = {
  args: { containerWidth: 340, pinListHeight: true },
};

/** Same, with two rows allowed, in case the single-row case reads as a special case. */
export const WidenWithPinnedHeightTwoRows: Story = {
  args: { containerWidth: 340, pinListHeight: true, maxRows: 2 },
};

/**
 * The same thing at a list length where cost is measurable. Every pass renders every item, so this is where
 * re-measuring too eagerly shows up as dropped frames while you drag.
 */
export const HundredItemsPinnedHeight: Story = {
  args: { containerWidth: 340, pinListHeight: true, itemCount: 100 },
};
