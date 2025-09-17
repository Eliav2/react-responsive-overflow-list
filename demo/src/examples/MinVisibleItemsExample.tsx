import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export function MinVisibleItemsExample() {
  return (
    <section className="demo">
      <h2 id="min-visible-items-guard">Min Visible Items Guard</h2>
      <p>
        The <code>minVisibleItems</code> prop ensures that at least a specified number of items are always visible, even
        if it means showing fewer items than would normally fit.
      </p>
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`<OverflowList
  items={["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]}
  renderItem={(item) => <span className="multi-item">{item}</span>}
  minVisibleItems={3}
  style={{ gap: "8px" }}
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="demo-container">
        <OverflowList
          items={["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]}
          renderItem={(item) => <span className="multi-item">{item}</span>}
          minVisibleItems={3}
          maxRows={1}
          style={{ gap: "8px" }}
        />
      </div>
      <div className="demo-note">
        <strong>Behavior:</strong> if <code>minVisibleItems={3}</code> is supplied, it ensures that at least 3 items
        will always be visible, its stronger than <code>maxRows</code> prop.
      </div>
    </section>
  );
}
