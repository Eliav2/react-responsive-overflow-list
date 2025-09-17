import { Theme } from "@radix-ui/themes";
import { CustomOverflowExample } from "./examples/CustomOverflowExample";
import { BasicExample } from "./examples/BasicExample";
import { ChildrenPatternExample } from "./examples/ChildrenPatternExample";
import { MultiRowExample } from "./examples/MultiRowExample";
import { CustomHostElementExample } from "./examples/CustomHostElementExample";
import { RadixVirtualizationExample } from "./examples/RadixVirtualizationExample";
import { FlushImmediatelyExample } from "./examples/FlushImmediatelyExample";
import { OneItemWiderExample } from "./examples/OneItemWiderExample";
import { MaxRowsOverflowExample } from "./examples/MaxRowsOverflowExample";
import { Github } from "lucide-react";
import "./App.css";

function App() {
  return (
    <Theme>
      <div className="app">
        <header>
          <h1>React Responsive Overflow List</h1>
          <p>A responsive component that automatically handles overflow items</p>
          <a
            href="https://github.com/eliav2/react-responsive-overflow-list"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "12px",
              color: "#0366d6",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <Github size={16} />
            View on GitHub
          </a>
        </header>

        <main>
          <BasicExample />
          <ChildrenPatternExample />
          <MultiRowExample />
          <CustomOverflowExample />
          <CustomHostElementExample />
          <RadixVirtualizationExample />
          <FlushImmediatelyExample />
          <OneItemWiderExample />
          <MaxRowsOverflowExample />
        </main>

        <footer>
          <p>Resize the window or demo containers to see the responsive behavior in action!</p>
        </footer>
      </div>
    </Theme>
  );
}

export default App;
