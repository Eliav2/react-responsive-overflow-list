import { useEffect, useRef, useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExampleCard } from "../components/ExampleCard";

const items = ["Overview", "Assets", "Issues", "Policies", "Reports", "Settings", "Audit", "Billing"];

/** Native resize handle. `resize` needs an overflow other than `visible` and a block-level box. */
const ITEM_STYLES: React.CSSProperties = {
  display: "inline-block",
  overflow: "hidden",
  resize: "horizontal",
  minWidth: 40,
  padding: "4px 8px",
  border: "1px dashed #94a3b8",
  borderRadius: 9999,
  background: "#f1f5f9",
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
};

/** Starting width of the resizable box. Reset restores this rather than clearing the inline width, since
 * clearing it would drop React's own value too and let the box grow to fill the page. */
const BOX_WIDTH = 340;

const codeSample = `// Off by default. Turn it on when item sizes can change without a render:
// a web font swapping in, an image inside an item loading, a CSS transition, a drag handle.
<OverflowList
  items={items}
  observeItemSizes
  renderItem={(item) => <span style={ITEM_STYLES}>{item}</span>}
  renderOverflow={(hidden) => <span>+{hidden.length}</span>}
  style={{ gap: 8 }}
/>`;

export function ObserveItemSizesExample() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLPreElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [observeItemSizes, setObserveItemSizes] = useState(false);
  // Dragging writes inline widths that React does not own, so it will not undo them on a re-render. Changing
  // this key remounts the items, which is the only way back to the starting widths.
  const [resetKey, setResetKey] = useState(0);

  const reset = () => {
    if (boxRef.current) boxRef.current.style.width = `${BOX_WIDTH}px`;
    setResetKey((key) => key + 1);
  };

  // Written straight into the DOM on every frame. Deliberately not React state: a `setState` here would
  // re-render the list, and a render is itself enough to re-measure, so the whole point of the example would
  // be hidden by its own readout.
  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const list = listRef.current;
      const readout = readoutRef.current;
      if (list && readout) {
        const laidOut = Array.from(list.children).filter(
          (child) => child.getClientRects().length > 0 && getComputedStyle(child).position === "static",
        );
        const listBox = list.getBoundingClientRect();
        const lastRight = laidOut.length
          ? Math.round(laidOut[laidOut.length - 1].getBoundingClientRect().right - listBox.left)
          : 0;
        const rows = new Set(laidOut.map((child) => Math.round(child.getBoundingClientRect().top))).size;

        readout.textContent = [
          `showing     ${laidOut.map((child) => child.textContent).join("  ")}`,
          `rows        ${rows}${rows > 1 ? "   <-- wrapped past one row" : ""}`,
          `free space  ${Math.round(listBox.width) - lastRight}px of ${Math.round(listBox.width)}`,
        ].join("\n");
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <ExampleCard id="observe-item-sizes-example" title="Items That Resize Without a Render">
      <p style={{ marginBottom: "20px", color: "#666", fontSize: "0.9rem" }}>
        Measurement re-runs on every render and whenever the container's own size changes. A size change React is not
        involved in trips neither: a web font swapping in, an image inside an item loading, a CSS transition, or a drag
        handle. <code>observeItemSizes</code> covers that with a ResizeObserver over the children, and is off by
        default because most lists never need one.
      </p>

      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {codeSample}
        </SyntaxHighlighter>
      </div>

      <div className="demo-container">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <button
            onClick={() => setObserveItemSizes((on) => !on)}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: observeItemSizes ? "1px solid #059669" : "1px solid #cbd5e1",
              background: observeItemSizes ? "#d1fae5" : "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            observeItemSizes: {observeItemSizes ? "ON" : "OFF"}
          </button>
          <button
            onClick={reset}
            style={{
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Reset sizes
          </button>
          <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
            drag the corner of any item, or of the box around them
          </span>
        </div>

        {/*
          The container gets a handle too, for contrast. Dragging it changes the container's own box, which the
          list already watches with nothing opted in, so it re-measures either way. Dragging an item changes
          only a child, and that is the case the option exists for.
        */}
        <div
          ref={boxRef}
          style={{
            width: BOX_WIDTH,
            minWidth: 140,
            maxWidth: "100%",
            resize: "horizontal",
            overflow: "hidden",
            padding: 8,
            border: "1px solid #cbd5e1",
            borderRadius: 8,
          }}
        >
          <OverflowList
            key={resetKey}
            ref={listRef}
            items={items}
            maxRows={1}
            observeItemSizes={observeItemSizes}
            style={{ gap: 8, height: 34, overflow: "hidden" }}
            renderItem={(item: string) => <span style={ITEM_STYLES}>{item}</span>}
            renderOverflow={(hidden: string[]) => (
              <span
                style={{
                  padding: "4px 8px",
                  border: "1px solid #94a3b8",
                  borderRadius: 9999,
                  background: "#fef3c7",
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                }}
              >
                +{hidden.length}
              </span>
            )}
          />
        </div>

        <pre
          ref={readoutRef}
          data-observe-item-sizes-readout
          style={{
            marginTop: 12,
            padding: 8,
            background: "#f1f5f9",
            borderRadius: 6,
            fontSize: "0.75rem",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        />

        <div className="demo-note" style={{ marginTop: "12px" }}>
          <strong>With it OFF:</strong> drag an item narrower and free space opens up while the indicator keeps
          claiming the same hidden items. The list's height is pinned here, so it cannot notice its own box changing
          and rescue itself. Dragging the outer box still works, because that is the container's own size.
          <br />
          <strong>With it ON:</strong> the count corrects a frame or two after you let go. It waits for the sizes to
          hold still rather than re-measuring every frame, so dragging stays cheap.
          <br />
          <em>Note:</em> toggling is itself a render, and a render re-measures, so it heals the list on the way. Drag
          again after toggling to see the difference.
        </div>
      </div>
    </ExampleCard>
  );
}
