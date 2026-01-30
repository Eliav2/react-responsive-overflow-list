import React from "react";
import { OverflowList } from "react-responsive-overflow-list";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ExampleCard } from "../components/ExampleCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

// ForwardRef component to ensure proper ref forwarding for OverflowList measurements
const ShadcnOverflowMenu = React.forwardRef<HTMLButtonElement, { items: string[] }>(
  ({ items }, ref) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={ref} variant="outline" size="sm">
          +{items.length} more
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-75 overflow-y-auto">
        {items.map((item, index) => (
          <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
);

export function ShadcnOverflowListExample() {
  return (
    <ExampleCard
      id="shadcn-overflow-list"
      title="shadcn/ui OverflowList"
      description="Responsive list with overflow items in a Radix dropdown menu. Resize the container to see items move to the dropdown."
      defaultExpanded
    >
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
  gap="sm"
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
          renderOverflow={(hiddenItems) => <ShadcnOverflowMenu items={hiddenItems} />}
          className="flex flex-wrap items-center gap-2"
        />
      </div>
    </ExampleCard>
  );
}
