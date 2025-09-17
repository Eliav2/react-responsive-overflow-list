import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew", "Kiwi", "Lemon"];

export function BasicExample() {
  return (
    <section className="demo">
      <h2 id="basic-example">Basic Example</h2>
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
  );
}
