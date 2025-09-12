import { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Theme, Switch } from "@radix-ui/themes";
import { CustomOverflowExample } from "./examples/CustomOverflowExample";
import "./App.css";

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew", "Kiwi", "Lemon"];

const tags = ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Node.js", "Express", "MongoDB", "Vite", "ESLint"];

const menuItems = ["Home", "About", "Services", "Portfolio", "Blog", "Contact", "Careers", "Support"];

function MultiRowExample() {
  const [maxRows, setMaxRows] = useState(2);

  return (
    <section className="demo">
      <h2>Multi-row Example</h2>
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
          min="1"
          max="10"
          value={maxRows}
          onChange={(e) => setMaxRows(parseInt(e.target.value) || 1)}
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

function FlushImmediatelyExample() {
  const [flushImmediately, setFlushImmediately] = useState(false);

  return (
    <section className="demo">
      <h2>Flush Immediately Example</h2>
      <p>
        Control how updates are applied when the container resizes.
        <strong>flushImmediately={flushImmediately ? "true" : "false"}</strong>
        (default: true)
      </p>
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`<OverflowList
  items={fruits.concat(tags)}
  renderItem={(item) => <span className="multi-item">{item}</span>}
  flushImmediately={${flushImmediately}}
  style={{ gap: "4px" }}
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="controls">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="flush-toggle">Flush Immediately:</label>
          <Switch id="flush-toggle" checked={flushImmediately} onCheckedChange={setFlushImmediately} />
          <span style={{ fontSize: "14px", color: "#666" }}>
            {flushImmediately ? "Enabled (may cause flickering)" : "Disabled (better performance)"}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px" }}>Trade-offs:</h4>
        <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px" }}>
          <li>
            <strong>flushImmediately=true:</strong> Updates are applied immediately using flushSync, avoiding flickering
            but may impact performance
          </li>
          <li>
            <strong>flushImmediately=false:</strong> Updates are applied in the requestAnimationFrame callback, avoiding
            forced reflow and improving performance but may cause slight flickering
          </li>
          <li>
            <strong>Default behavior:</strong> flushImmediately is true by default to prioritize smooth visual
            experience
          </li>
        </ul>

        <div style={{ marginTop: "12px", fontStyle: "italic", color: "#888", fontSize: "14px" }}>
          Resize quickly below to observe the difference!
        </div>
      </div>

      <div className="demo-container">
        <OverflowList
          items={fruits}
          renderItem={(item) => <span className="multi-item">{item}</span>}
          flushImmediately={flushImmediately}
          style={{ gap: "4px" }}
        />
      </div>
    </section>
  );
}

function App() {
  return (
    <Theme>
      <div className="app">
        <header>
          <h1>React Responsive Overflow List</h1>
          <p>A responsive component that automatically handles overflow items</p>
        </header>

        <main>
          <section className="demo">
            <h2>Basic Example</h2>
            <p>Simple list with default overflow element</p>
            <div className="code-preview">
              <SyntaxHighlighter language="tsx" style={tomorrow}>
                {`<OverflowList
  items={fruits}
  renderItem={(item, index) => (
    <span key={index} className="fruit-item">
      {item}
    </span>
  )}
  style={{ gap: "8px" }}
/>`}
              </SyntaxHighlighter>
            </div>
            <div className="demo-container">
              <OverflowList
                items={fruits}
                renderItem={(item, index) => (
                  <span key={index} className="fruit-item">
                    {item}
                  </span>
                )}
                style={{ gap: "8px" }}
              />
            </div>
          </section>

          <section className="demo">
            <h2>Children Pattern</h2>
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

          <MultiRowExample />

          <CustomOverflowExample />

          <section className="demo">
            <h2>Custom Host Element</h2>
            <p>Using the 'as' prop to render as different HTML elements</p>
            <div className="code-preview">
              <SyntaxHighlighter language="tsx" style={tomorrow}>
                {`<OverflowList as="nav" style={{ gap: "8px" }}>
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <a href="#contact">Contact</a>
</OverflowList>`}
              </SyntaxHighlighter>
            </div>
            <div className="demo-container">
              <OverflowList as="nav" style={{ gap: "8px" }}>
                <a href="#home" className="demo-item demo-item--primary">
                  Home
                </a>
                <a href="#about" className="demo-item demo-item--primary">
                  About
                </a>
                <a href="#contact" className="demo-item demo-item--primary">
                  Contact
                </a>
                <a href="#services" className="demo-item demo-item--primary">
                  Services
                </a>
                <a href="#portfolio" className="demo-item demo-item--primary">
                  Portfolio
                </a>
              </OverflowList>
            </div>
          </section>
          <FlushImmediatelyExample />
        </main>

        <footer>
          <p>Resize the window or demo containers to see the responsive behavior in action!</p>
        </footer>
      </div>
    </Theme>
  );
}

export default App;
