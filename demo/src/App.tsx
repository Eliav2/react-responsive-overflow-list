import { useState } from "react";
import { OverflowList } from "react-responsive-overflow-list";
import "./App.css";

const fruits = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape", "Honeydew", "Kiwi", "Lemon"];

const toolbarItems = [
  { id: "new", label: "New", icon: "📄" },
  { id: "open", label: "Open", icon: "📂" },
  { id: "save", label: "Save", icon: "💾" },
  { id: "print", label: "Print", icon: "🖨️" },
  { id: "export", label: "Export", icon: "📤" },
  { id: "settings", label: "Settings", icon: "⚙️" },
  { id: "help", label: "Help", icon: "❓" },
];

const tags = ["React", "TypeScript", "CSS", "HTML", "JavaScript", "Node.js", "Express", "MongoDB", "Vite", "ESLint"];

const menuItems = ["Home", "About", "Services", "Portfolio", "Blog", "Contact", "Careers", "Support"];

function CustomOverflowMenu({ items }: { items: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "4px 8px",
          backgroundColor: "#e3f2fd",
          border: "1px solid #2196f3",
          borderRadius: "4px",
          color: "#1976d2",
          cursor: "pointer",
        }}
      >
        +{items.length} more
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "8px",
            minWidth: "120px",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "4px 8px",
                cursor: "pointer",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              #{item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <header>
        <h1>React Responsive Overflow List</h1>
        <p>A responsive component that automatically handles overflow items</p>
      </header>

      <main>
        <section className="demo">
          <h2>Basic Example</h2>
          <p>Simple list with default overflow menu</p>
          <div className="demo-container">
            <OverflowList
              items={fruits}
              renderItem={(item, index) => (
                <span key={index} className="fruit-item">
                  {item}
                </span>
              )}
              maxRows={1}
              style={{ gap: "8px" }}
            />
          </div>
        </section>

        <section className="demo">
          <h2>Toolbar Example</h2>
          <p>Interactive toolbar with buttons</p>
          <div className="demo-container toolbar">
            <OverflowList
              items={toolbarItems}
              renderItem={(button) => (
                <button key={button.id} className="toolbar-button" onClick={() => console.log(`Clicked: ${button.id}`)}>
                  <span>{button.icon}</span>
                  <span>{button.label}</span>
                </button>
              )}
              maxRows={1}
              style={{ gap: "4px" }}
            />
          </div>
        </section>

        <section className="demo">
          <h2>Custom Overflow Menu</h2>
          <p>Tags with custom overflow renderer</p>
          <div className="demo-container">
            <OverflowList
              items={tags}
              renderItem={(tag) => <span className="tag">#{tag}</span>}
              renderOverflow={(items) => <CustomOverflowMenu items={items} />}
              maxRows={2}
              style={{ gap: "6px" }}
            />
          </div>
        </section>

        <section className="demo">
          <h2>Navigation Menu</h2>
          <p>Responsive navigation with styled overflow</p>
          <div className="demo-container nav">
            <OverflowList
              items={menuItems}
              renderItem={(item) => (
                <a href={`#${item.toLowerCase()}`} className="nav-link">
                  {item}
                </a>
              )}
              renderOverflowProps={{
                triggerProps: {
                  className: "nav-overflow-button",
                },
              }}
              maxRows={1}
              style={{ gap: "2px" }}
            />
          </div>
        </section>

        <section className="demo">
          <h2>Children Pattern</h2>
          <p>Using children instead of items array</p>
          <div className="demo-container">
            <OverflowList maxRows={1} style={{ gap: "8px" }}>
              <button className="action-button">Action 1</button>
              <button className="action-button">Action 2</button>
              <button className="action-button">Action 3</button>
              <button className="action-button">Action 4</button>
              <button className="action-button">Action 5</button>
              <button className="action-button">Action 6</button>
            </OverflowList>
          </div>
        </section>

        <section className="demo">
          <h2>Multi-row Example</h2>
          <p>Allow up to 3 rows before overflow</p>
          <div className="demo-container">
            <OverflowList
              items={fruits.concat(tags).concat(menuItems)}
              renderItem={(item) => <span className="multi-item">{item}</span>}
              maxRows={3}
              style={{ gap: "4px" }}
            />
          </div>
        </section>
      </main>

      <footer>
        <p>Resize the window or demo containers to see the responsive behavior in action!</p>
      </footer>
    </div>
  );
}

export default App;
