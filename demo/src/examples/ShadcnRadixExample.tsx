import { OverflowList } from "../../../registry/radix-vega/overflow-list/overflow-list";
import { CollapsibleCodePreview } from "../components/CollapsibleCodePreview";

const items = [
  "Dashboard",
  "Projects",
  "Tasks",
  "Calendar",
  "Reports",
  "Settings",
  "Team",
  "Analytics",
  "Notifications",
  "Help",
];

const code = `import { OverflowList } from "@/components/ui/overflow-list"

const items = ["Dashboard", "Projects", "Tasks", "Calendar", "Reports", "Settings", "Team", "Analytics"]

<OverflowList
  items={items}
  renderItem={(item) => (
    <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
      {item}
    </button>
  )}
  renderOverflowItem={(item) => item}
  gap="sm"
/>`;

export function ShadcnRadixExample() {
  return (
    <section className="demo">
      <h2>shadcn/ui Radix Variant</h2>
      <p>
        This is the <code>radix-vega</code> style variant using{" "}
        <code>@radix-ui/react-dropdown-menu</code>. Install with:{" "}
        <code>npx shadcn add @eliav2/overflow-list</code>
      </p>

      <CollapsibleCodePreview code={code} language="tsx" title="ShadcnRadixExample.tsx" />

      <div className="demo-container" style={{ minWidth: 200 }}>
        <OverflowList
          items={items}
          renderItem={(item) => (
            <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              {item}
            </button>
          )}
          renderOverflowItem={(item) => item}
          gap="sm"
        />
      </div>

      <div className="demo-note">
        <strong>Note:</strong> This variant uses Radix UI primitives for the dropdown menu. The
        styling follows shadcn/ui conventions with Tailwind CSS.
      </div>
    </section>
  );
}
