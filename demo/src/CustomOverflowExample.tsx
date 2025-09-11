import React from "react";
import { OverflowList, type OverflowElementProps } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const tags = ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Node.js", "Express", "MongoDB", "Vite", "ESLint"];

const CustomOverflowElement = React.forwardRef<HTMLDivElement, OverflowElementProps<string>>(({ items }, ref) => (
  <div ref={ref} className="custom-overflow">
    <button className="demo-button demo-button--primary">+{items.length} more</button>
  </div>
));

export function CustomOverflowExample() {
  return (
    <section className="demo">
      <h2>Custom Overflow Element</h2>
      <p>You would generally want to provide your own overflow element</p>

      {/* Example 1: Simple overflow function */}
      <div className="example-section">
        <h3>Simple Overflow Function</h3>
        <div className="code-preview">
          <SyntaxHighlighter language="tsx" style={tomorrow}>
            {`<OverflowList
  items={tags}
  renderItem={(tag) => <span className="tag">#{tag}</span>}
  renderOverflow={(items) => <div>{items.length} items are hidden</div>}
  maxRows={2}
  style={{ gap: "6px" }}
/>`}
          </SyntaxHighlighter>
        </div>
        <div className="demo-container">
          <OverflowList
            items={tags}
            renderItem={(tag) => <span className="tag">#{tag}</span>}
            renderOverflow={(items) => <div>{items.length} items are hidden</div>}
            style={{ gap: "6px" }}
          />
        </div>
      </div>

      {/* Example 2: ForwardRef component */}
      <div className="example-section">
        <h3>ForwardRef Component</h3>
        <p>
          When you provide a custom overflow component, it should be a forwardRef component to ensure proper ref
          forwarding for measurements.
        </p>
        <div className="code-preview">
          <SyntaxHighlighter language="tsx" style={tomorrow}>
            {`// Custom overflow component with forwardRef
const CustomOverflowElement = React.forwardRef<HTMLDivElement, { items: string[] }>(
  ({ items }, ref) => (
    <div ref={ref} className="custom-overflow">
      <button>+{items.length} more</button>
    </div>
  )
);

<OverflowList
  items={tags}
  renderItem={(tag) => <span className="tag">#{tag}</span>}
  renderOverflow={(items) => <CustomOverflowElement items={items} />}
  maxRows={2}
  style={{ gap: "6px" }}
/>`}
          </SyntaxHighlighter>
        </div>
        <div className="demo-container">
          <OverflowList
            items={tags}
            renderItem={(tag) => <span className="tag">#{tag}</span>}
            renderOverflow={(items) => <CustomOverflowElement items={items} />}
            maxRows={2}
            style={{ gap: "6px" }}
          />
        </div>
      </div>
    </section>
  );
}
