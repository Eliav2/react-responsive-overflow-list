import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CustomHostElementExample() {
  return (
    <section className="demo">
      <h2 id="custom-host-element">Custom Host Element</h2>
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
  );
}
