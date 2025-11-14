import "./styles.css";

import { OverflowList } from "react-responsive-overflow-list";

const WaTag: any = "wa-tag";

const testTags = [
  { id: "1", name: "tag1" },
  { id: "2", name: "tag2" },
  { id: "3", name: "tag3" },
  { id: "4", name: "tag4" },
  { id: "5", name: "tag5" },
  { id: "6", name: "tag6" },
];

const DemoContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minHeight: "60px",
      padding: "16px",
      border: "2px dashed #ddd",
      borderRadius: "6px",
      backgroundColor: "#ebebeb",
      resize: "horizontal",
      overflow: "auto",
      minWidth: "200px",
      maxWidth: "100%",
    }}
  >
    {children}
  </div>
);

export default function App() {
  return (
    <div className="App">
      <div style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>Basic spans</div>
      <DemoContainer>
        <OverflowList
          items={testTags}
          maxRows={1}
          renderItem={(item) => <span key={item.id}>{item.name}</span>}
          style={{
            gap: "8px",
          }}
        />
      </DemoContainer>
      <div style={{ fontWeight: "bold", color: "#666", marginBottom: "0.5rem" }}>wa-tag</div>
      <DemoContainer>
        <OverflowList
          items={testTags}
          maxRows={1}
          renderItem={(item, meta) => (
            <WaTag key={item.id} variant="brand">
              {item.name}
            </WaTag>
          )}
          renderHiddenItem={(node, meta) => {
            return (
              <span key={meta.index} aria-hidden={!meta.visible} style={!meta.visible ? HIDDEN_ITEM_STYLES : undefined}>
                {node}
              </span>
            );
          }}
          style={{
            gap: "8px",
          }}
        />
      </DemoContainer>
    </div>
  );
}

const HIDDEN_ITEM_STYLES: React.CSSProperties = {
  position: "absolute",
  visibility: "hidden",
  pointerEvents: "none",
  top: 0,
  left: 0,
};
