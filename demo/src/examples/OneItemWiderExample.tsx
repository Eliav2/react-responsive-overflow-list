import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExampleCard } from "../components/ExampleCard";

export function OneItemWiderExample() {
  return (
    <ExampleCard
      id="one-item-wider-than-container"
      title="One Item Wider Than Container"
      description="What happens when a single item is wider than the available container space? The component gracefully handles this by showing only the overflow element."
    >
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`<OverflowList
  items={["This is a very long item that exceeds container width"]}
  renderItem={(item) => (
    <span style={{ whiteSpace: "nowrap", padding: "8px 16px", backgroundColor: "#e3f2fd" }}>
      {item}
    </span>
  )}
  style={{ gap: "8px", width: "200px" }}
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="demo-container" style={{ border: "2px dashed #ccc", width: "200px" }}>
        <OverflowList
          items={["This is a very long item that exceeds container width"]}
          renderItem={(item) => (
            <span
              style={{
                whiteSpace: "nowrap",
                padding: "8px 16px",
                backgroundColor: "#e3f2fd",
                borderRadius: "4px",
              }}
            >
              {item}
            </span>
          )}
          style={{ gap: "8px" }}
        />
      </div>
      <div className="demo-note">
        <strong>Behavior:</strong> When a single item is wider than the container, the component shows only the overflow
        element (the "+X more" button), ensuring the layout remains stable.
      </div>
    </ExampleCard>
  );
}
