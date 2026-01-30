import { createFileRoute } from "@tanstack/react-router";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ShadcnInstallTabs } from "../../components/docs/ShadcnInstallTabs";
import { ShadcnOverflowListExample } from "../../examples/ShadcnOverflowListExample";
import { PropsTable } from "../../components/docs/PropsTable";

export const Route = createFileRoute("/docs/shadcn")({
  component: ShadcnPage,
});

const shadcnProps = [
  {
    name: "items",
    type: "T[]",
    description: "Array of items to render in the list",
    required: true,
  },
  {
    name: "renderItem",
    type: "(item: T, index: number) => ReactNode",
    description: "Render function for visible items",
    required: true,
  },
  {
    name: "renderOverflowItem",
    type: "(item: T, index: number) => ReactNode",
    default: "renderItem",
    description:
      "Optional render function for items in the overflow dropdown. Falls back to renderItem if not provided.",
  },
  {
    name: "maxRows",
    type: "number",
    default: "1",
    description: "Maximum number of rows before items overflow to the dropdown",
  },
  {
    name: "maxVisibleItems",
    type: "number",
    default: "100",
    description: "Maximum visible items regardless of available space",
  },
  {
    name: "overflowLabel",
    type: "(count: number) => string",
    default: '`+${count} more`',
    description: "Function to customize the overflow trigger button text",
  },
  {
    name: "gap",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Gap between items using Tailwind spacing classes",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply to the container",
  },
];

const usageCode = `import { OverflowList } from "@/components/ui/overflow-list"

const tags = ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Radix UI"]

export function TagList() {
  return (
    <OverflowList
      items={tags}
      renderItem={(tag) => (
        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
          {tag}
        </span>
      )}
      gap="sm"
    />
  )
}`;

const customOverflowCode = `import { OverflowList } from "@/components/ui/overflow-list"

const users = [
  { id: 1, name: "Alice", avatar: "/alice.png" },
  { id: 2, name: "Bob", avatar: "/bob.png" },
  // ...
]

<OverflowList
  items={users}
  renderItem={(user) => (
    <Avatar>
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.name[0]}</AvatarFallback>
    </Avatar>
  )}
  renderOverflowItem={(user) => (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <span>{user.name}</span>
    </div>
  )}
  overflowLabel={(count) => \`+\${count} users\`}
  gap="sm"
/>`;

function ShadcnPage() {
  return (
    <div>
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        shadcn/ui Integration
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        A pre-built OverflowList component for shadcn/ui projects. Install via
        the shadcn CLI and use immediately with your existing shadcn setup.
      </p>

      {/* Installation */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Installation
        </h2>
        <p className="text-gray-700 mb-4">
          Choose your preferred UI library variant and run the install command:
        </p>
        <ShadcnInstallTabs />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Prerequisites:</strong> Make sure you have shadcn/ui set up
            in your project. For the Radix variant, you'll need the{" "}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded">button</code>{" "}
            and{" "}
            <code className="bg-blue-100 px-1.5 py-0.5 rounded">
              dropdown-menu
            </code>{" "}
            components installed.
          </p>
        </div>
      </section>

      {/* Live Preview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Live Preview
        </h2>
        <ShadcnOverflowListExample />
      </section>

      {/* Basic Usage */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Basic Usage
        </h2>
        <p className="text-gray-700 mb-4">
          Import the component and pass your items with a render function:
        </p>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <SyntaxHighlighter language="tsx" style={tomorrow}>
            {usageCode}
          </SyntaxHighlighter>
        </div>
      </section>

      {/* Custom Overflow Rendering */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Custom Overflow Rendering
        </h2>
        <p className="text-gray-700 mb-4">
          Use <code className="bg-gray-100 px-1.5 py-0.5 rounded">renderOverflowItem</code> to
          customize how items appear in the dropdown menu:
        </p>
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <SyntaxHighlighter language="tsx" style={tomorrow}>
            {customOverflowCode}
          </SyntaxHighlighter>
        </div>
      </section>

      {/* Props */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Props
        </h2>
        <p className="text-gray-700 mb-4">
          The shadcn OverflowList component accepts the following props:
        </p>
        <PropsTable props={shadcnProps} />
        <p className="text-gray-600 text-sm mt-2">
          <span className="text-red-600">*</span> Required props
        </p>
      </section>

      {/* Variants */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Variants
        </h2>
        <p className="text-gray-700 mb-4">
          Two variants are available depending on your UI library preference:
        </p>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
                  Feature
                </th>
                <th className="text-left px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
                  Radix UI
                </th>
                <th className="text-left px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
                  Base UI
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-900">
                  Dropdown Component
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  shadcn DropdownMenu
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  @base-ui/react Menu
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-900">
                  Dependencies
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    button
                  </code>
                  ,{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    dropdown-menu
                  </code>
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    @base-ui/react
                  </code>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-900">
                  Styling
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  Tailwind + shadcn CSS variables
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  Tailwind inline styles
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 border-b border-gray-200 font-medium text-gray-900">
                  Best For
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  Existing shadcn/ui projects
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  Base UI projects or lightweight setups
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Customization */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Customization
        </h2>
        <p className="text-gray-700 mb-4">
          After installation, the component is copied to your{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded">
            components/ui
          </code>{" "}
          directory. You can customize it directly:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            Modify the dropdown trigger button styling in the{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">Button</code>{" "}
            component
          </li>
          <li>
            Adjust the dropdown menu appearance via{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">
              DropdownMenuContent
            </code>
          </li>
          <li>
            Change gap values in the{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">gapClasses</code>{" "}
            object
          </li>
          <li>
            Update default props like{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">maxRows</code> or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded">
              overflowLabel
            </code>
          </li>
        </ul>
      </section>

      {/* Links */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Resources
        </h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://github.com/eliav2/react-responsive-overflow-list"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub Repository
            </a>{" "}
            — Source code and issues
          </li>
          <li>
            <a
              href="/docs/api"
              className="text-blue-600 hover:underline"
            >
              API Reference
            </a>{" "}
            — Full documentation for the core OverflowList component
          </li>
          <li>
            <a
              href="https://ui.shadcn.com/docs/cli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              shadcn/ui CLI Documentation
            </a>{" "}
            — Learn more about the shadcn CLI
          </li>
        </ul>
      </section>
    </div>
  );
}
