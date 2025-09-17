import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export function ChildrenPatternExample() {
  return (
    <section className="demo">
      <h2 id="children-pattern">Children Pattern</h2>
      <p>Using children instead of items array</p>
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`<OverflowList>
  <button>Action 1</button>
  <button>Action 2</button>
  ...
</OverflowList>`}
        </SyntaxHighlighter>
      </div>
      <div className="demo-container">
        <OverflowList style={{ gap: "8px" }}>
          <button className="action-button">Action 1</button>
          <button className="action-button">Action 2</button>
          <button className="action-button">Action 3</button>
          <button className="action-button">Action 4</button>
          <button className="action-button">Action 5</button>
          <button className="action-button">Action 6</button>
        </OverflowList>
      </div>
    </section>
  );
}
