import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExampleCard } from "../components/ExampleCard";

export function ChildrenPatternExample() {
  return (
    <ExampleCard
      id="children-pattern"
      title="Children Pattern"
      description="Using children instead of items array"
    >
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
    </ExampleCard>
  );
}
