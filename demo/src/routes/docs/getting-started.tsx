import { createFileRoute } from "@tanstack/react-router";
import { InstallTabs } from "../../components/docs/InstallTabs";
import {
  PropsTable,
  type PropDefinition,
} from "../../components/docs/PropsTable";

export const Route = createFileRoute("/docs/getting-started")({
  component: GettingStartedPage,
});

const keyProps: PropDefinition[] = [
  {
    name: "items",
    type: "T[]",
    description: "Array of items to render. Use with renderItem.",
  },
  {
    name: "renderItem",
    type: "(item: T, index: number) => ReactNode",
    description: "Function to render each visible item.",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Alternative to items + renderItem pattern.",
  },
  {
    name: "maxRows",
    type: "number",
    default: "1",
    description: "Number of visible rows before overflow.",
  },
  {
    name: "renderOverflow",
    type: "(hidden: T[]) => ReactNode",
    description: "Custom overflow UI (button, menu, etc.).",
  },
  {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "Polymorphic root element.",
  },
];

function GettingStartedPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started</h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        A responsive React component that shows only items that fit and groups
        the rest into a customizable overflow element. Recalculates
        automatically on resize.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Installation
        </h2>
        <InstallTabs />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Basic Usage
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The most common pattern uses an <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">items</code> array with a{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">renderItem</code> function:
        </p>
        <div className="bg-gray-900 rounded-lg overflow-hidden my-4">
          <pre className="m-0 p-4 overflow-x-auto">
            <code className="text-gray-200 text-sm leading-relaxed">{`import { OverflowList } from "react-responsive-overflow-list";

const items = ["One", "Two", "Three", "Four", "Five"];

export default function Example() {
  return (
    <OverflowList
      items={items}
      renderItem={(item) => <span style={{ padding: 4 }}>{item}</span>}
      style={{ gap: 8 }}
      maxRows={1}
    />
  );
}`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Children Pattern
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Alternatively, pass children directly instead of using{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">items + renderItem</code>:
        </p>
        <div className="bg-gray-900 rounded-lg overflow-hidden my-4">
          <pre className="m-0 p-4 overflow-x-auto">
            <code className="text-gray-200 text-sm leading-relaxed">{`<OverflowList style={{ gap: 8 }}>
  <button>A</button>
  <button>B</button>
  <button>C</button>
  <button>D</button>
</OverflowList>`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Custom Overflow Element
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Provide your own overflow UI (button, dropdown menu, etc.) via the{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">renderOverflow</code> prop:
        </p>
        <div className="bg-gray-900 rounded-lg overflow-hidden my-4">
          <pre className="m-0 p-4 overflow-x-auto">
            <code className="text-gray-200 text-sm leading-relaxed">{`<OverflowList
  items={items}
  renderItem={(item) => <span>{item}</span>}
  renderOverflow={(hidden) => <button>+{hidden.length} more</button>}
/>`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Key Props
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Here are the most commonly used props. See the{" "}
          <a href="/docs/api" className="text-blue-600 hover:underline">
            API Reference
          </a>{" "}
          for the complete list.
        </p>
        <PropsTable props={keyProps} />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Next Steps
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <a
              href="/docs/examples"
              className="text-blue-600 hover:underline font-medium"
            >
              Browse Examples
            </a>{" "}
            — See all usage patterns with live demos
          </li>
          <li>
            <a
              href="/docs/api"
              className="text-blue-600 hover:underline font-medium"
            >
              API Reference
            </a>{" "}
            — Complete props and types documentation
          </li>
        </ul>
      </section>
    </div>
  );
}
