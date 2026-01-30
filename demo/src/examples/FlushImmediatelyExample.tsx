import { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Switch } from "@radix-ui/themes";
import { ExampleCard } from "../components/ExampleCard";

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew", "Kiwi", "Lemon"];

export function FlushImmediatelyExample() {
  const [flushImmediately, setFlushImmediately] = useState(false);

  return (
    <ExampleCard
      id="flush-immediately-example"
      title="Flush Immediately Example"
    >
      <p style={{ marginBottom: "20px", color: "#666", fontSize: "0.9rem" }}>
        Control how updates are applied when the container resizes.
        <strong> flushImmediately={flushImmediately ? "true" : "false"}</strong>
        (default: true)
      </p>
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`<OverflowList
  items={fruits.concat(tags)}
  renderItem={(item) => <span className="multi-item">{item}</span>}
  flushImmediately={${flushImmediately}}
  style={{ gap: "4px" }}
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="controls">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="flush-toggle">Flush Immediately:</label>
          <Switch id="flush-toggle" checked={flushImmediately} onCheckedChange={setFlushImmediately} />
          <span style={{ fontSize: "14px", color: "#666" }}>
            {flushImmediately ? "Enabled (No flickering)" : "Disabled (better performance)"}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>Trade-offs:</h4>
        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px" }}>
          <li>
            <strong>flushImmediately=true:</strong> Updates are applied immediately using flushSync, avoiding flickering
            but may impact performance
          </li>
          <li>
            <strong>flushImmediately=false:</strong> Updates are applied in the requestAnimationFrame callback, avoiding
            forced reflow and improving performance but may cause slight flickering
          </li>
          <li>
            <strong>Default behavior:</strong> flushImmediately is true by default to prioritize smooth visual
            experience
          </li>
        </ul>

        <div style={{ marginTop: "12px", fontStyle: "italic", color: "#888", fontSize: "14px" }}>
          Resize quickly below to observe the difference!
        </div>
      </div>

      <div className="demo-container">
        <OverflowList
          items={fruits}
          renderItem={(item) => <span className="multi-item">{item}</span>}
          flushImmediately={flushImmediately}
          style={{ gap: "4px" }}
        />
      </div>
    </ExampleCard>
  );
}
