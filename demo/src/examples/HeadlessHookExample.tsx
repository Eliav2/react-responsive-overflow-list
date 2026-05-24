import { useOverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Filter, X } from "lucide-react";
import { ExampleCard } from "../components/ExampleCard";

const tags = [
  "react",
  "typescript",
  "hooks",
  "responsive",
  "overflow",
  "headless",
  "ui",
  "library",
  "open-source",
  "design-system",
];

export function HeadlessHookExample() {
  return (
    <ExampleCard
      id="headless-hook-example"
      title="Headless Hook (useOverflowList)"
      description="Build your own layout using the same measurement engine that powers <OverflowList />. Here a 'Filters' label and a 'Clear' button stay pinned to the edges while only the middle chip row overflows — a pattern the JSX wrapper can't express, since pinned siblings would be measured as overflow candidates."
    >
      <div className="code-preview">
        <SyntaxHighlighter language="tsx" style={tomorrow}>
          {`import { useOverflowList } from "react-responsive-overflow-list";
import { Filter, X } from "lucide-react";

function FilterChipBar({ tags, onClear }: { tags: string[]; onClear: () => void }) {
  // The hook only measures whatever you attach \`containerRef\` to.
  // Put it on an inner flex:1 div, and any siblings (left/right) stay
  // pinned no matter how narrow the outer bar becomes.
  const {
    containerRef,
    overflowIndicatorRef,
    visibleCount,
    hiddenCount,
    phase,
    showOverflow,
  } = useOverflowList<HTMLDivElement, HTMLSpanElement>({
    itemCount: tags.length,
    maxRows: 1,
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <Filter size={14} /> Filters:
      </span>

      <div ref={containerRef} style={{ display: "flex", flexWrap: "wrap", gap: 8, flex: 1, minWidth: 0 }}>
        {tags.map((tag, index) => {
          const visible = phase === "measuring" || index < visibleCount;
          if (!visible) return null;
          return <span key={index}>#{tag}</span>;
        })}
        {showOverflow && <span ref={overflowIndicatorRef}>+{hiddenCount} more</span>}
      </div>

      <button onClick={onClear} style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <X size={14} /> Clear
      </button>
    </div>
  );
}`}
        </SyntaxHighlighter>
      </div>
      <div className="demo-container">
        <FilterChipBar tags={tags} />
      </div>
    </ExampleCard>
  );
}

function FilterChipBar({ tags }: { tags: string[] }) {
  const { containerRef, overflowIndicatorRef, visibleCount, hiddenCount, phase, showOverflow } =
    useOverflowList<HTMLDivElement, HTMLSpanElement>({ itemCount: tags.length, maxRows: 1 });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          fontWeight: 600,
          color: "#374151",
        }}
      >
        <Filter size={14} /> Filters:
      </span>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          flex: 1,
          minWidth: 0,
          alignItems: "center",
          contain: "layout style",
        }}
      >
        {tags.map((tag, index) => {
          const visible = phase === "measuring" || index < visibleCount;
          if (!visible) return null;
          return (
            <span key={index} className="fruit-item">
              #{tag}
            </span>
          );
        })}
        {showOverflow && (
          <span
            ref={overflowIndicatorRef}
            className="fruit-item"
            style={{ background: "#eef2ff", color: "#3730a3", fontWeight: 600 }}
          >
            +{hiddenCount} more
          </span>
        )}
      </div>

      <button
        type="button"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
          padding: "6px 10px",
          borderRadius: 6,
          background: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fecaca",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <X size={14} /> Clear
      </button>
    </div>
  );
}
