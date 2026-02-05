import { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExampleCard } from "../components/ExampleCard";

const items = [
  { label: "Short", height: 30 },
  { label: "Medium", height: 50 },
  { label: "Tall Item", height: 70 },
  { label: "Extra Tall", height: 100 },
  { label: "Small", height: 35 },
  { label: "Large Box", height: 80 },
  { label: "Tiny", height: 25 },
  { label: "Big One", height: 90 },
  { label: "Normal", height: 45 },
  { label: "Giant", height: 110 },
];

export function DifferentHeightsExample() {
  const [maxRows, setMaxRows] = useState(2);

  return (
    <ExampleCard
      id="different-heights-example"
      title="Different Heights"
      description="Items with varying heights, vertically centered with alignItems"
    >
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`const items = [
  { label: "Short", height: 30 },
  { label: "Medium", height: 50 },
  { label: "Tall Item", height: 70 },
  { label: "Extra Tall", height: 100 },
  // ...more items
];

<OverflowList
  items={items}
  maxRows={${maxRows}}
  renderItem={(item, index) => (
    <div
      key={index}
      style={{
        height: item.height,
        minWidth: 80,
        padding: "8px 16px",
        background: "#fef3c7",
        border: "1px solid #f59e0b",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {item.label}
    </div>
  )}
  style={{ gap: 8, alignItems: "center" }}
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="controls">
        <label htmlFor="maxRowsHeight">Max Rows:</label>
        <input
          id="maxRowsHeight"
          type="number"
          min="1"
          max="10"
          value={maxRows}
          onChange={(e) => setMaxRows(parseInt(e.target.value) ?? 1)}
          className="max-rows-input"
        />
      </div>
      <div className="demo-container">
        <OverflowList
          items={items}
          maxRows={maxRows}
          renderItem={(item, index) => (
            <div
              key={index}
              style={{
                height: item.height,
                minWidth: 80,
                padding: "8px 16px",
                background: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              {item.label}
            </div>
          )}
          style={{ gap: 8, alignItems: "center" }}
        />
      </div>
    </ExampleCard>
  );
}
