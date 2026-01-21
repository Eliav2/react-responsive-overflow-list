import { OverflowList } from "../../../registry/base-vega/overflow-list/overflow-list";
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

export function ShadcnBaseUIExample() {
  return (
    <section className="demo">
      <h2>shadcn/ui Base UI Variant</h2>
      <p>
        This is the <code>base-vega</code> style variant using <code>@base-ui/react</code>. Install
        with: <code>npx shadcn add @eliav2/overflow-list</code> (with{" "}
        <code>"style": "base-vega"</code> in your components.json)
      </p>

      <CollapsibleCodePreview code={code} language="tsx" title="ShadcnBaseUIExample.tsx" />

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
        <strong>Note:</strong> This variant uses Base UI primitives for the dropdown menu. It
        provides the same API as the Radix variant but uses different underlying primitives.
      </div>
    </section>
  );
}
