import { useEffect, useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const placeholderItems = Array.from({ length: 10 }, (_, index) => `Item ${index + 1}`);

const codeSample = `const items = ["Item 1", "Item 2", /* ... */];

const GrowingItem = ({ label }: { label: string }) => {
  const [size, setSize] = useState(20);

  useEffect(() => {
    const timer = setTimeout(() => setSize(50), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      className="dynamic-size-item"
      style={{
        width: \`\${size}px\`,
        height: \`\${size}px\`,
        lineHeight: \`\${size}px\`,
      }}
    >
      {label}
    </span>
  );
};

export function ChangingSizeItems() {
  return (
    <OverflowList
      items={items}
      renderItem={(item) => <GrowingItem label={item} />}
      style={{ gap: "8px" }}
    />
  );
}`;

function GrowingItem({ label, delay = 1200 }: { label: string; delay?: number }) {
  const [size, setSize] = useState(20);

  useEffect(() => {
    const timer = setTimeout(() => setSize(50), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className="dynamic-size-item"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        lineHeight: `${size}px`,
      }}
    >
      {label}
    </span>
  );
}

export function DynamicSizeExample() {
  return (
    <section className="demo">
      <h2 id="dynamic-size-example">Changing Item Sizes After Load</h2>
      <p>
        Simulates skeleton items that start tiny (20px) and expand to their full size (50px) after a short delay—useful
        for testing measurements when children resize after initial render.
      </p>

      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {codeSample}
        </SyntaxHighlighter>
      </div>

      <div className="demo-container">
        <OverflowList
          items={placeholderItems}
          renderItem={(item, { index }) => <GrowingItem label={item} delay={800 + index * 150} />}
          style={{ gap: "8px" }}
        />
      </div>
    </section>
  );
}
