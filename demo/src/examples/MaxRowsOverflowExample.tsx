import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export function MaxRowsOverflowExample() {
  return (
    <section className="demo">
      <h2 id="maxrows-overflow-placement">Max Rows with Overflow Placement</h2>
      <p>
        When using <code>maxRows</code> greater than 1, the overflow element can be placed in different positions within
        the grid layout.
      </p>
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`<OverflowList
  items={Array.from({ length: 20 }, (_, i) => \`Item \${i + 1}\`)}
  renderItem={(item) => <span className="multi-item">{item}</span>}
  maxRows={3}
  style={{ gap: "8px" }}
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="demo-container">
        <OverflowList
          items={Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`)}
          renderItem={(item) => <span className="multi-item">{item}</span>}
          maxRows={3}
          style={{ gap: "8px" }}
        />
      </div>
      <div className="demo-note">
        <strong>Behavior:</strong> With <code>maxRows={3}</code>, the component creates a 3-row grid layout. When items
        exceed the available space, the overflow element appears in the last available position, maintaining the grid
        structure.
      </div>
    </section>
  );
}
