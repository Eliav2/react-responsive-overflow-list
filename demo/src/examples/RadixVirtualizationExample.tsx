import { RadixVirtualizedOverflowList } from "../components/RadixVirtualizedOverflowList";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

const tags = ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Node.js", "Express", "MongoDB", "Vite", "ESLint"];

export function RadixVirtualizationExample() {
  const [maxRows, setMaxRows] = useState(1);
  return (
    <section className="demo">
      <h2 id="radix-ui-virtualization-example">Extending OverflowList</h2>
      <p>
        This is an example implementation showing how to wrap OverflowList with Radix UI dropdown and virtualization. In
        real-world applications, it's expected that you'll wrap OverflowList with your own components tailored to your
        specific needs, design system, etc.
      </p>
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`import { RadixVirtualizedOverflowList } from "../components/RadixVirtualizedOverflowList";

// Small dataset - uses simple dropdown
<RadixVirtualizedOverflowList
  items={tags}
  renderItem={(tag) => <span className="tag">#{tag}</span>}
  style={{ gap: "6px" }}
/>

// Large dataset - automatically uses virtualization
<RadixVirtualizedOverflowList
  items={Array.from({ length: 1000 }, (_, i) => \`Item \${i + 1}\`)}
  renderItem={(item) => <span className="tag">#{item}</span>}
  virtualizationThreshold={50}
  enableSearch={true}
  maxRows={${maxRows}}
  style={{ gap: "6px" }}
/>`}
        </SyntaxHighlighter>
      </div>

      <div className="demo-container">
        <h4 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>Small Dataset (Simple Dropdown)</h4>
        <RadixVirtualizedOverflowList
          items={tags}
          renderItem={(tag) => <span className="tag">#{tag}</span>}
          style={{ gap: "6px" }}
        />
      </div>

      <div className="demo-container" style={{ marginTop: "24px" }}>
        <h4 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>Large Dataset (Virtualized Dropdown with Search)</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <label htmlFor="maxRows" style={{ fontSize: "14px", fontWeight: "500" }}>
            Max Rows:
          </label>
          <input
            id="maxRows"
            type="number"
            min="0"
            max="10"
            value={maxRows}
            onChange={(e) => setMaxRows(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              padding: "4px",
            }}
          />
          <span style={{ fontSize: "12px", color: "#666" }}>
            Controls how many rows of items are visible before overflow
          </span>
        </div>

        <RadixVirtualizedOverflowList
          items={Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)}
          renderItem={(item) => <span className="tag">#{item}</span>}
          maxRows={maxRows}
          virtualizationThreshold={50}
          enableSearch={true}
          searchPlaceholder="Search items..."
          style={{ gap: "6px" }}
        />
      </div>

      <div className="demo-note">
        <strong>This example demonstrates:</strong>
        <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
          <li>
            <strong>Automatic virtualization:</strong> Switches to virtualized dropdown when item count exceeds
            threshold
          </li>
          <li>
            <strong>Search functionality:</strong> Built-in search/filter for large datasets
          </li>
          <li>
            <strong>Radix UI integration:</strong> Full accessibility and keyboard navigation support
          </li>
          <li>
            <strong>Customizable:</strong> Configurable thresholds, styling, and behavior
          </li>
          <li>
            <strong>Performance optimized:</strong> Efficient rendering for thousands of items
          </li>
        </ul>
        <p style={{ margin: "12px 0 0 0", fontStyle: "italic", color: "#666" }}>
          <strong>Note:</strong> This is just an example implementation. In real-world applications, it's expected that
          you'll wrap OverflowList with your own components tailored to your specific needs and design system.
          <br />
          <strong>Source:</strong>{" "}
          <a
            href="https://github.com/eliav2/react-responsive-overflow-list/blob/main/demo/src/components/RadixVirtualizedOverflowList.tsx"
            target="_blank"
            rel="noopener noreferrer"
          >
            View implementation on GitHub
          </a>
        </p>
      </div>
    </section>
  );
}
