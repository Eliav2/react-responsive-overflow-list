import { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew"];

const codeSample = `const [isNarrow, setIsNarrow] = useState(false);

<div style={{ width: isNarrow ? "250px" : "100%" }}>
  <OverflowList
    items={fruits}
    renderItem={(item, index) => (
      <span key={index} className="fruit-item">
        {item}
      </span>
    )}
    style={{ gap: "8px" }}
  />
</div>

<button onClick={() => setIsNarrow(!isNarrow)}>
  {isNarrow ? "Expand" : "Shrink"} Container
</button>`;

export function ShrinkingContainerExample() {
  const [isNarrow, setIsNarrow] = useState(false);

  return (
    <section className="demo">
      <h2 id="shrinking-container-example">Shrinking Container</h2>
      <p>
        Click the button to shrink the container width and see how items automatically overflow when space becomes
        limited. The list seamlessly adapts when the container expands back to full width.
      </p>

      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {codeSample}
        </SyntaxHighlighter>
      </div>

      <div className="demo-container">
        <div
          style={{
            width: isNarrow ? "250px" : "100%",
            // transition: "width 0.3s ease",
            padding: "12px",
            border: "2px dashed #ccc",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        >
          <OverflowList
            items={fruits}
            renderItem={(item, index) => (
              <span key={index} className="fruit-item">
                {item}
              </span>
            )}
            style={{ gap: "8px" }}
          />
        </div>
        <button
          onClick={() => setIsNarrow(!isNarrow)}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
            backgroundColor: "#0366d6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0256c5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0366d6")}
        >
          {isNarrow ? "Expand" : "Shrink"} Container
        </button>
        <div className="demo-note" style={{ marginTop: "12px" }}>
          <strong>Current width:</strong> {isNarrow ? "250px (narrow)" : "100% (full)"}
        </div>
      </div>
    </section>
  );
}
