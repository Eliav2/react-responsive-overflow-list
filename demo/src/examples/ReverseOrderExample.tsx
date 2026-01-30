import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExampleCard } from "../components/ExampleCard";

const tags = ["React", "TypeScript", "CSS", "JavaScript", "HTML", "Node.js", "Express", "MongoDB", "PostgreSQL", "Redis"];

export function ReverseOrderExample() {
  return (
    <ExampleCard
      id="reverse-order-example"
      title="Reverse Order Example"
      description="Compare normal overflow (shrinks from end) vs reverse overflow (shrinks from start)"
    >
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`// Normal overflow - shrinks from end
<OverflowList
  items={tags}
  renderItem={(item, index) => (
    <span key={index} className="tag-item">
      {item}
    </span>
  )}
  style={{ gap: "8px" }}
/>

// Reverse overflow - shrinks from start
<OverflowList
  items={[...tags].reverse()}
  renderItem={(item, index) => (
    <span key={index} className="tag-item">
      {item}
    </span>
  )}
  style={{
    gap: "8px",
    flexDirection: "row-reverse",
    justifyContent: "flex-end"
  }}
/>`}
        </SyntaxHighlighter>
      </div>

      <div className="demo-section">
        <h3>Normal Overflow (shrinks from end)</h3>
        <div className="demo-container">
          <OverflowList
            items={tags}
            renderItem={(item, index) => (
              <span key={index} className="tag-item">
                {item}
              </span>
            )}
            style={{ gap: "8px" }}
          />
        </div>
      </div>

      <div className="demo-section">
        <h3>Reverse Overflow (shrinks from start)</h3>
        <div className="demo-container">
          <OverflowList
            items={[...tags].reverse()}
            renderItem={(item, index) => (
              <span key={index} className="tag-item">
                {item}
              </span>
            )}
            style={{
              gap: "8px",
              flexDirection: "row-reverse",
              justifyContent: "flex-end"
            }}
          />
        </div>
      </div>
    </ExampleCard>
  );
}
