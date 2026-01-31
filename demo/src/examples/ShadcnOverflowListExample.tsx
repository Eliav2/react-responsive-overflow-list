import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExampleCard } from "../components/ExampleCard";
import { OverflowList as RadixOverflowList } from "@/components/shadcn-radix-ui/overflow-list-radix";
import { OverflowList as BaseOverflowList } from "@/components/shadcn-base-ui/overflow-list-base";

const tags = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Radix UI",
  "Next.js",
  "Vite",
  "Node.js",
  "GraphQL",
  "REST API",
  "PostgreSQL",
  "Redis",
];

type Variant = "radix" | "base";

export function ShadcnOverflowListExample() {
  const [variant, setVariant] = useState<Variant>("radix");

  const OverflowList = variant === "radix" ? RadixOverflowList : BaseOverflowList;

  return (
    <ExampleCard
      id="shadcn-overflow-list"
      title="shadcn/ui OverflowList"
      description="Responsive list with overflow items in a dropdown menu. Resize the container to see items move to the dropdown."
      defaultExpanded
    >
      <div className="example-section">
        {/* Variant Toggle */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">Primitive:</span>
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden shadow-sm">
            <button
              onClick={() => setVariant("radix")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                variant === "radix"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Radix UI
            </button>
            <button
              onClick={() => setVariant("base")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                variant === "base"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Base UI
            </button>
          </div>
        </div>

        <div className="code-preview">
          <SyntaxHighlighter language="tsx" style={tomorrow}>
            {`import { OverflowList } from "@/components/ui/overflow-list"

const tags = ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", ...]

<OverflowList
  items={tags}
  renderItem={(tag) => (
    <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
      {tag}
    </span>
  )}
/>`}
          </SyntaxHighlighter>
        </div>

        <div className="demo-container">
          <OverflowList
            items={tags}
            renderItem={(tag) => (
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                {tag}
              </span>
            )}
          />
        </div>
      </div>
    </ExampleCard>
  );
}
