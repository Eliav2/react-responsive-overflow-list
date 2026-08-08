import { Popover } from "@base-ui/react/popover";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";

/**
 * Repros for container children that are *not* items but were still measured as rows.
 *
 * `getRowPositionsData` used to group every child of the container into rows by its `top` coordinate,
 * excluding only the overflow indicator. Two kinds of child break that assumption:
 *
 * 1. **Overflowed items kept mounted but hidden** — what React 19.2's `Activity mode="hidden"` does,
 *    and therefore what the default `renderItemVisibility` does. A `display: none` element has no
 *    layout box, so its rect reads as all zeros and it groups into a phantom row keyed at `top: 0`.
 *
 * 2. **Focus guards** — popover libraries put guards next to an open trigger. They are real children of
 *    the container but `position: fixed`, so they are out of flow and their top lands outside the
 *    items' row.
 *
 * Row keys are read in ascending numeric order, so either kind sorts *ahead* of the real items and gets
 * measured as the first row. `countVisibleItems` then reports however many non-items that row held, and
 * the inflated row count makes `updateOverflowIndicator` (since v0.4.1's `itemRowCount > maxRows`
 * check) subtract until the list collapses to a bare overflow indicator.
 */
const ITEMS: string[] = ["alpha", "beta", "gamma", "delta", "epsilon"];

const itemStyle: React.CSSProperties = { padding: "2px 6px", background: "#fec", whiteSpace: "nowrap" };
const indicatorStyle: React.CSSProperties = { padding: "2px 6px", background: "#fcc", whiteSpace: "nowrap" };
const containerStyle: React.CSSProperties = {
  gap: 8,
  border: "2px solid red",
  padding: 8,
  resize: "horizontal",
  overflow: "auto",
  width: 220,
  maxWidth: "100%",
};

/**
 * The consumer keeps overflowed items mounted (so their state survives) and hides them with
 * `display: none` — the same thing `Activity mode="hidden"` does on React 19.2, spelled out here so
 * the repro does not depend on the React version.
 */
const HiddenItemsRepro = ({ maxRows = 1 }: { maxRows?: number }) => (
  <OverflowList
    items={ITEMS}
    maxRows={maxRows}
    renderItem={(item) => <span style={itemStyle}>{item}</span>}
    renderOverflow={(hidden) => <span style={indicatorStyle}>+{hidden.length}</span>}
    renderItemVisibility={(node, meta) => (
      <span key={meta.index} style={{ display: meta.visible ? "inline-flex" : "none" }}>
        {node}
      </span>
    )}
    style={containerStyle}
  />
);

/**
 * The guard markup below is copied verbatim from the DOM of an open `@base-ui/react` popover whose
 * trigger sits inside an OverflowList (two `data-base-ui-focus-guard` spans around the trigger plus an
 * inert marker span). Rendering it directly keeps this repro deterministic — a live popover only
 * exposes the bug once something re-runs the measuring pass while the popup is still open.
 */
const FOCUS_GUARD_STYLE: React.CSSProperties = {
  clipPath: "inset(50%)",
  overflow: "hidden",
  whiteSpace: "nowrap",
  border: 0,
  padding: 0,
  width: 1,
  height: 1,
  margin: -1,
  position: "fixed",
  top: 0,
  left: 0,
};

const FocusGuardsRepro = ({ maxRows = 1 }: { maxRows?: number }) => (
  <OverflowList
    items={ITEMS}
    maxRows={maxRows}
    renderItem={(item, index) =>
      index === 0 ? (
        <>
          <span aria-hidden="true" tabIndex={0} data-base-ui-focus-guard="" style={FOCUS_GUARD_STYLE} />
          <span style={{ ...itemStyle, background: "#cef" }}>{item}</span>
          <span aria-hidden="true" tabIndex={-1} data-base-ui-inert="" style={FOCUS_GUARD_STYLE} />
          <span aria-hidden="true" tabIndex={0} data-base-ui-focus-guard="" style={FOCUS_GUARD_STYLE} />
        </>
      ) : (
        <span style={itemStyle}>{item}</span>
      )
    }
    renderOverflow={(hidden) => <span style={indicatorStyle}>+{hidden.length}</span>}
    style={containerStyle}
  />
);

/** The same guards, produced by a real open popover instead of hand-written markup. */
const LivePopoverRepro = ({ maxRows = 1 }: { maxRows?: number }) => {
  const [selected, setSelected] = useState(ITEMS);

  const toggle = (item: string) =>
    setSelected((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));

  return (
    <OverflowList
      maxRows={maxRows}
      renderOverflow={(hidden) => <span style={indicatorStyle}>+{hidden.length}</span>}
      style={containerStyle}
    >
      <Popover.Root>
        <Popover.Trigger style={{ ...itemStyle, background: "#cef" }}>Filter ▾</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={4}>
            <Popover.Popup style={{ background: "#fff", border: "1px solid #ccc", padding: 8 }}>
              {ITEMS.map((item) => (
                <label key={item} style={{ display: "block" }}>
                  <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
                  {item}
                </label>
              ))}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      {selected.map((item) => (
        <span key={item} style={itemStyle}>
          {item}
        </span>
      ))}
    </OverflowList>
  );
};

const section: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" };

const NonItemChildrenRepro = ({ maxRows = 1 }: { maxRows?: number }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
    <section style={section}>
      <strong>1. Overflowed items kept mounted with `display: none`</strong>
      <HiddenItemsRepro maxRows={maxRows} />
    </section>
    <section style={section}>
      <strong>2. Focus guards next to the first item</strong>
      <FocusGuardsRepro maxRows={maxRows} />
    </section>
    <section style={section}>
      <strong>3. Live popover trigger inside the list</strong>
      <span style={{ fontSize: 12, color: "#666" }}>
        Open "Filter ▾" and toggle a checkbox — the item count changes while the guards are mounted.
      </span>
      <LivePopoverRepro maxRows={maxRows} />
    </section>
  </div>
);

const meta = {
  title: "Issues/Non-Item Children",
  component: NonItemChildrenRepro,
} satisfies Meta<typeof NonItemChildrenRepro>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Expected: every list shows as many items as fit on one row, plus a `+N` indicator.
 *
 * Before the fix lists 1 and 2 collapse to a bare `+5` on mount. Drag the resize handle to check that
 * the counts still track the container width afterwards.
 */
export const CollapsesToBareIndicator: Story = {
  args: { maxRows: 1 },
};
