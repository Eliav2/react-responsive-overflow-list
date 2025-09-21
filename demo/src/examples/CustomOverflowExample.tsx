import React, { useMemo } from "react";
import { OverflowList, type OverflowElementProps } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CollapsibleCodePreview } from "../components/CollapsibleCodePreview";
import { VirtualizedRadixOverflowMenu } from "./VirtualizedRadixOverflowMenu";
import { RadixOverflowMenu } from "./RadixOverflowMenu";
import virtualizedCodeExample from "./VirtualizedRadixOverflowMenu?raw";
import radixCodeExample from "./RadixOverflowMenu?raw";

const tags = ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Node.js", "Express", "MongoDB", "Vite", "ESLint"];

const CustomOverflowElement = React.forwardRef<HTMLDivElement, OverflowElementProps<string>>(({ items }, ref) => (
  <div ref={ref} className="custom-overflow">
    <span>+{items.length} more items</span>
  </div>
));

export function CustomOverflowExample() {

  return (
    <section className="demo">
      <h2 id="custom-overflow-example">Custom Overflow Element</h2>
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
  maxRows={1}
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
      <span>+{items.length} more items</span>
    </div>
  )
);

<OverflowList
  items={tags}
  renderItem={(tag) => <span className="tag">#{tag}</span>}
  renderOverflow={(items) => <CustomOverflowElement items={items} />}
  maxRows={1}
  style={{ gap: "6px" }}
/>`}
          </SyntaxHighlighter>
        </div>
        <div className="demo-container">
          <OverflowList
            items={tags}
            renderItem={(tag) => <span className="tag">#{tag}</span>}
            renderOverflow={(items) => <CustomOverflowElement items={items} />}
            maxRows={1}
            style={{ gap: "6px" }}
          />
        </div>
      </div>

      {/* Example 3: Radix UI Dropdown Menu */}
      <div className="example-section">
        <h3>Radix UI Dropdown Menu</h3>
        <p>Advanced example using Radix UI's dropdown menu with proper accessibility and keyboard navigation.</p>
        <CollapsibleCodePreview
          title="Radix UI Dropdown Implementation"
          code={radixCodeExample}
          usageCode={`<OverflowList
  items={tags}
  renderItem={(tag) => <span className="tag">#{tag}</span>}
  renderOverflow={(items) => <RadixOverflowMenu items={items} />}
  maxRows={1}
  style={{ gap: "6px" }}
/>`}
          defaultCollapsed={false}
        />
        <div className="demo-container">
          <OverflowList
            items={tags}
            renderItem={(tag) => <span className="tag">#{tag}</span>}
            renderOverflow={(items) => <RadixOverflowMenu items={items} />}
            maxRows={1}
            style={{ gap: "6px" }}
          />
        </div>
      </div>

      {/* Example 4: Virtualized Radix UI Dropdown for Large Datasets */}
      <div className="example-section">
        <h3>Virtualized Radix UI Dropdown (10,000+ Items)</h3>
        <p>
          Advanced example combining Radix UI with TanStack Virtual for handling thousands of items efficiently. The{" "}
          <code>maxVisibleItems</code> prop (default: 100) ensures that only the first N items are rendered in the main
          list, while everything beyond that threshold gets moved to the overflow dropdown.
        </p>
        <CollapsibleCodePreview
          title="Virtualized Radix UI Dropdown Implementation"
          code={virtualizedCodeExample}
          usageCode={`<OverflowList
  items={Array.from({ length: 10000 }, (_, i) => \`Item \${i + 1}\`)}
  renderItem={(item) => <span className="tag">#{item}</span>}
  renderOverflow={(items) => <VirtualizedRadixOverflowMenu items={items} />}
  maxRows={5}
  maxVisibleItems={100} // the default value is 100
  style={{ gap: "6px" }}
/>`}
          defaultCollapsed={true}
        />
        <div className="demo-container">
          <OverflowList
            items={Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`)}
            renderItem={(item) => <span className="tag">#{item}</span>}
            renderOverflow={(items) => <VirtualizedRadixOverflowMenu items={items} />}
            maxRows={5}
            maxVisibleItems={100} // the default value is 100
            style={{ gap: "6px" }}
          />
        </div>
        <div className="demo-note">
          <strong>Note:</strong> This example demonstrates how the <code>maxVisibleItems</code> prop (default: 100)
          ensures only the first 100 items are rendered in the main list, even on the initial render. The remaining
          9,900 items are efficiently handled by the virtualized dropdown, which only renders the visible portion of the
          scrollable list.
          <br />
          <br />
          <strong>Performance Tip:</strong> Lower <code>maxVisibleItems</code> values provide better performance (fewer
          DOM nodes on initial render), while higher values allow more items to be visible before overflowing but with
          reduced performance. The default of 100 provides a good balance between performance and usability.
        </div>
      </div>
    </section>
  );
}
