import { useEffect, useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const placeholderItems = Array.from({ length: 10 }, (_, index) => `Item ${index + 1}`);

const codeSample = `const placeholderItems = Array.from({ length: 10 }, (_, index) => \`Item \${index + 1}\`);

const HIDDEN_ITEM_STYLES: React.CSSProperties = {
  position: "absolute",
  visibility: "hidden",
  pointerEvents: "none",
  top: 0,
  left: 0,
};

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
        width: \`\${size}px\`,
        height: \`\${size}px\`,
        lineHeight: \`\${size}px\`,
      }}
    >
      {label}
    </span>
  );
}

export function DynamicSizeExample() {
  return (
    <OverflowList
      items={placeholderItems}
      renderItem={(item, { index }) => (
        <GrowingItem label={item} delay={800 + index * 150} />
      )}
      style={{ gap: "8px" }}
      renderHiddenItem={(node, meta) => (
        <span
          key={meta.index}
          aria-hidden={!meta.visible}
          style={!meta.visible ? HIDDEN_ITEM_STYLES : undefined}
        >
          {node}
        </span>
      )}
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
        By default the list temporarily unmounts overflowed children while it measures, so elements that change size
        (e.g. skeletons growing from 20px to 50px) can flicker as they re-enter the DOM. React 19.2+ solves this via
        <code>React.Activity</code>; in older versions you can pass <code>renderHiddenItem</code> to keep every child
        mounted and simply hide the overflowed ones yourself.
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
          renderHiddenItem={(node, meta) => {
            return (
              <span key={meta.index} aria-hidden={!meta.visible} style={!meta.visible ? HIDDEN_ITEM_STYLES : undefined}>
                {node}
              </span>
            );
          }}
        />
        <div className="demo-note" style={{ marginTop: "12px" }}>
          <strong>Tip:</strong> In React &lt; 19.2, pass a <code>renderHiddenItem</code> callback like above to keep
          custom elements mounted. React 19.2+ users can rely on the built-in <code>React.Activity</code> that the
          component uses internally.
        </div>
      </div>
    </section>
  );
}

const HIDDEN_ITEM_STYLES: React.CSSProperties = {
  position: "absolute",
  visibility: "hidden",
  pointerEvents: "none",
  top: 0,
  left: 0,
};
