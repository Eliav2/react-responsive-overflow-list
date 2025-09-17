import { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew", "Kiwi", "Lemon"];
const tags = ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Node.js", "Express", "MongoDB", "Vite", "ESLint"];
const menuItems = ["Home", "About", "Services", "Portfolio", "Blog", "Contact", "Careers", "Support"];

export function MultiRowExample() {
  const [maxRows, setMaxRows] = useState(2);

  return (
    <section className="demo">
      <h2 id="multi-row-example">Multi-row Example</h2>
      <p>Allow up to {maxRows} rows before overflow</p>
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`<OverflowList
  items={fruits.concat(tags).concat(menuItems)}
  renderItem={(item) => <span className="multi-item">{item}</span>}
  maxRows={${maxRows}}
  style={{ gap: "4px" }}
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="controls">
        <label htmlFor="maxRows">Max Rows:</label>
        <input
          id="maxRows"
          type="number"
          min="0"
          max="10"
          value={maxRows}
          onChange={(e) => setMaxRows(parseInt(e.target.value) ?? 0)}
          className="max-rows-input"
        />
      </div>

      <div className="demo-container">
        <OverflowList
          items={fruits.concat(tags).concat(menuItems)}
          renderItem={(item) => <span className="multi-item">{item}</span>}
          maxRows={maxRows}
          style={{ gap: "4px" }}
        />
      </div>
    </section>
  );
}
