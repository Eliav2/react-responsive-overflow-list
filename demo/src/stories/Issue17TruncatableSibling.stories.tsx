import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";

/**
 * Repro for https://github.com/Eliav2/react-responsive-overflow-list/issues/17
 *
 * The OverflowList shares a flex row with a sibling whose width is elastic
 * (a truncatable `<span style={{ minWidth: 0 }}>`). Because the OverflowList's
 * own width is content-driven (flex-basis: auto), the width it is *measured* at
 * (all items rendered, sibling shrunk) differs from the width it is finally
 * *rendered* at (fewer items, sibling expanded). At certain container widths the
 * visible item + overflow indicator no longer fit on one line and wrap to a 2nd
 * row, violating `maxRows={1}`.
 *
 * Resize the red box slowly to reproduce — it happens at specific widths (~180-230px).
 */
const Issue17Repro = ({ maxRows = 1 }: { maxRows?: number }) => {
  // Bumping this key remounts the OverflowList, forcing a fresh measuring pass
  // (same effect as a page reload). Use it to check whether a stuck/collapsed
  // state re-resolves once re-measured at the current container width.
  const [renderKey, setRenderKey] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <button onClick={() => setRenderKey((k) => k + 1)} style={{ padding: "4px 10px" }}>
        Force re-render (remount) — count: {renderKey}
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "2px solid red",
          padding: 8,
          resize: "horizontal",
          overflow: "auto",
          width: 250,
          maxWidth: "100%",
        }}
      >
        <span
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            minWidth: 0,
            background: "#cef",
          }}
        >
          I could be truncated
        </span>
        <OverflowList
          key={renderKey}
          items={["foo", "bar", "baz"]}
          renderItem={(item) => <span style={{ padding: 4, background: "#fec" }}>{item}</span>}
          renderOverflow={(items) => <span style={{ padding: 4, background: "#fcc" }}>{items.length}</span>}
          style={{ gap: 8, border: "1px dashed blue" }}
          maxRows={maxRows}
        />
      </div>
    </div>
  );
};

const meta = {
  title: "Issues/Issue17 - Truncatable Sibling Wrapping",
  component: Issue17Repro,
} satisfies Meta<typeof Issue17Repro>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Items wrap onto 2 rows despite `maxRows={1}` at narrow container widths.
 * Drag the bottom-right resize handle of the red box to find the broken widths.
 */
export const WrapsDespiteMaxRows1: Story = {
  args: { maxRows: 1 },
};
