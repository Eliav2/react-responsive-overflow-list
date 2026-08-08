import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";

/**
 * Regression cover for https://github.com/Eliav2/react-responsive-overflow-list/issues/21
 *
 * Every list here must stay within its `maxRows` through the whole badge-growth sequence, in both
 * directions. Story names describe the bug each one reproduced, matching `WrapsDespiteMaxRows1` (#17) and
 * `CollapsesToBareIndicator` (#23).
 *
 * Filter tabs with counter badges. The badges grow as data arrives, so the *items* get wider while no item
 * is added or removed. Measurement used to be re-triggered only by `[itemCount, maxRows]` or by the
 * container's own ResizeObserver, and neither fires here: `itemCount` is constant and the container's width
 * is set from outside. `visibleCount` therefore stayed at whatever fit before the badges grew, and the
 * wider items plus the overflow indicator no longer fit on one line.
 *
 * What made it hard to see is that the component usually *rescued itself*: when the items wrap, the
 * container gets taller, `useResizeObserver` reports the height change, and a fresh measuring pass runs. It
 * only stayed broken when the container's box **could not** change, the normal shape of a tab bar: a fixed
 * height. Then nothing re-triggered measurement and the indicator sat on row 2 indefinitely.
 *
 * So the reported Firefox/Chromium split was not really about the engine. It was about whether the
 * container's box is free to change in the layout it happens to sit in.
 *
 * The fix compares the settled content signature after every commit, so a size change re-triggers a pass
 * on its own. `Remount` remains useful as a control: it forces a fresh pass at the current widths, and it
 * produced the same result as the fix does, which is what showed the measurement logic was right all along
 * and only the state was stale.
 */
const TABS = ["Overview", "Assets", "Issues", "Policies", "Reports"];

/** The width jumps called out in the issue: badge appears, 1 digit -> 2, then 2 digits -> "99+". */
const STAGES = [
  { label: "no badge", count: 0 },
  { label: "badge appears (1)", count: 1 },
  { label: "1 digit (9)", count: 9 },
  { label: "2 digits (10)", count: 10 },
  { label: "2 digits (99)", count: 99 },
  { label: '"99+" (100)', count: 100 },
];

const TAB_BAR_HEIGHT = 34;

const tabStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 10px",
  border: "1px solid #bbb",
  borderRadius: 6,
  background: "#f6f6f6",
  whiteSpace: "nowrap",
};

const badgeStyle: React.CSSProperties = {
  padding: "0 5px",
  borderRadius: 8,
  background: "#333",
  color: "#fff",
  fontSize: 11,
  lineHeight: "16px",
};

const Tab = ({ name, count }: { name: string; count: number }) => (
  <span style={tabStyle}>
    {name}
    {count > 0 && <span style={badgeStyle}>{count > 99 ? "99+" : count}</span>}
  </span>
);

interface Issue21Props {
  maxRows?: number;
  containerWidth?: number;
  /** Pin the list's height, as a real tab bar does, so wrapping cannot change its box. */
  fixedHeight?: boolean;
}

const Issue21Repro = ({ maxRows = 1, containerWidth = 340, fixedHeight = true }: Issue21Props) => {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [remountKey, setRemountKey] = useState(0);

  // Auto-advance, to mimic counters ticking up as data arrives.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStage((s) => {
        if (s >= STAGES.length - 1) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(id);
  }, [playing]);

  // Diagnostic only: count the rows the list's visible children actually occupy. Reads layout, never
  // writes to it, so it cannot influence what the component measures.
  //
  // Deliberately a passive effect, not a layout effect: OverflowList's own layout effects run first (child
  // before parent) and set the next phase, so a layout effect here would read the DOM of the phase that is
  // about to be replaced and report a stale row count. A passive effect runs after paint, on the layout
  // that is actually on screen.
  const containerRef = useRef<HTMLElement | null>(null);
  const [rows, setRows] = useState(1);
  // No dep array on purpose: re-read after every render, including the ones the measuring phases cause.
  // `setRows` bails when the value is unchanged, so this settles instead of looping.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const frame = requestAnimationFrame(() => {
      const tops = new Set(
        Array.from(el.children)
          .filter((child) => child.getClientRects().length > 0)
          .map((child) => Math.round(child.getBoundingClientRect().top)),
      );
      setRows((prev) => (prev === tops.size ? prev : tops.size));
    });
    return () => cancelAnimationFrame(frame);
  });

  const { count } = STAGES[stage];
  const violated = rows > maxRows;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setStage((s) => Math.max(0, s - 1))} disabled={stage === 0}>
          ◀ Prev
        </button>
        <button
          onClick={() => setStage((s) => Math.min(STAGES.length - 1, s + 1))}
          disabled={stage === STAGES.length - 1}
        >
          Next ▶
        </button>
        <button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</button>
        <button
          onClick={() => {
            setStage(0);
            setPlaying(false);
          }}
        >
          Reset
        </button>
        <button onClick={() => setRemountKey((k) => k + 1)}>Remount ({remountKey})</button>
      </div>

      <div style={{ fontSize: 13 }}>
        stage {stage + 1}/{STAGES.length}: <strong>{STAGES[stage].label}</strong> &nbsp;|&nbsp; measured rows:{" "}
        <strong style={{ color: violated ? "#c00" : "#070" }}>{rows}</strong> (maxRows={maxRows}){" "}
        {violated && <strong style={{ color: "#c00" }}>← maxRows violated</strong>}
      </div>

      {/* The width is set from outside, so growing items never change the list's width. With fixedHeight,
          wrapping cannot change its height either, so its ResizeObserver never fires and the content
          signature is the only thing left to notice the change. */}
      <div
        style={{
          width: containerWidth,
          resize: "horizontal",
          overflow: "auto",
          border: "2px solid red",
          padding: 8,
        }}
      >
        <OverflowList
          key={remountKey}
          ref={containerRef}
          items={TABS}
          maxRows={maxRows}
          renderItem={(name) => <Tab name={name} count={count} />}
          renderOverflow={(hidden) => (
            <span style={{ ...tabStyle, background: "#ffecec", borderColor: "#e0a0a0" }}>More ({hidden.length})</span>
          )}
          style={
            fixedHeight
              ? { gap: 8, height: TAB_BAR_HEIGHT * maxRows, alignContent: "flex-start" }
              : { gap: 8 }
          }
        />
      </div>

      <span style={{ fontSize: 12, color: "#666", maxWidth: 620 }}>
        Neither the item count nor the list's box changes here, so the only signal left is that the items
        themselves changed size. Drag the red box to park it near a fit boundary, then step the stages: the
        row count must stay within maxRows the whole way up and back down.
      </span>
    </div>
  );
};

const meta = {
  title: "Issues/Issue21 - Dynamic Item Widths",
  component: Issue21Repro,
} satisfies Meta<typeof Issue21Repro>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The case that was broken. Fixed-height tab bar, `maxRows={1}`.
 *
 * Expected: one row at every stage, items moving into `More (N)` as the badges grow and back out as they
 * shrink. Before the fix the indicator dropped to row 2 at the first badge and stayed there, at every width
 * from 300px to 540px.
 */
export const FixedHeightIndicatorWraps: Story = {
  args: { maxRows: 1, containerWidth: 340, fixedHeight: true },
};

/**
 * Control: same growth, height left elastic. This one was already correct before the fix — wrapping makes
 * the list taller, its ResizeObserver fires, and a new pass restores one row. Which is why the bug looked
 * intermittent and engine-specific in the wild.
 */
export const ElasticHeightSelfHeals: Story = {
  args: { maxRows: 1, containerWidth: 340, fixedHeight: false },
};

/**
 * The same case with two rows allowed, to show the constraint honoured is `maxRows` and not "1". Expected:
 * two rows throughout, never three.
 */
export const FixedHeightMaxRows2: Story = {
  args: { maxRows: 2, containerWidth: 260, fixedHeight: true },
};
