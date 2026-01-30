import { createFileRoute } from "@tanstack/react-router";
import {
  PropsTable,
  type PropDefinition,
} from "../../components/docs/PropsTable";

export const Route = createFileRoute("/docs/api")({
  component: ApiPage,
});

const allProps: PropDefinition[] = [
  {
    name: "items",
    type: "T[]",
    description:
      "Array of items to render. Use with renderItem. Omit when using children.",
  },
  {
    name: "renderItem",
    type: "(item: T, index: number) => ReactNode",
    description: "How to render each visible item.",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Alternative to items + renderItem pattern.",
  },
  {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "Polymorphic root element.",
  },
  {
    name: "maxRows",
    type: "number",
    default: "1",
    description: "Number of visible rows before overflow.",
  },
  {
    name: "maxVisibleItems",
    type: "number",
    default: "100",
    description: "Hard cap on visible items.",
  },
  {
    name: "renderOverflow",
    type: "(hidden: T[]) => ReactNode",
    description: "Custom overflow UI. Receives array of hidden items.",
  },
  {
    name: "renderOverflowItem",
    type: "(item: T, index: number) => ReactNode",
    description:
      "How to render items in expanded lists/menus. Defaults to renderItem.",
  },
  {
    name: "renderOverflowProps",
    type: "Partial<OverflowElementProps<T>>",
    description: "Props passed to the default overflow element.",
  },
  {
    name: "flushImmediately",
    type: "boolean",
    default: "true",
    description:
      "true uses flushSync for no flicker. false uses rAF for better performance during rapid resize.",
  },
  {
    name: "renderItemVisibility",
    type: "(node: ReactNode, meta: RenderItemVisibilityMeta) => ReactNode",
    description:
      "Control visibility of hidden items. Defaults to React.Activity (19.2+) or null.",
  },
];

function ApiPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">API Reference</h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Complete documentation of all props and types for the OverflowList
        component.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Props
        </h2>
        <PropsTable props={allProps} />
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Styling
        </h2>
        <p className="text-gray-700 leading-relaxed">
          The root element uses{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
            display: flex; flex-wrap: wrap; align-items: center;
          </code>{" "}
          by default. Override via{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
            style
          </code>{" "}
          or{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
            className
          </code>{" "}
          props.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Default Overflow Element
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Ships with a minimal chip that renders{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
            +{"{count}"} more
          </code>
          . Replace with{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
            renderOverflow
          </code>{" "}
          for custom UI like dropdown menus.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          TypeScript
        </h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden my-4">
          <pre className="m-0 p-4 overflow-x-auto">
            <code className="text-gray-200 text-sm leading-relaxed">{`import type {
  OverflowListProps,
  RenderItemVisibilityMeta,
  OverflowElementProps,
} from "react-responsive-overflow-list";`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          How It Works
        </h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-6">
          <li>Measures all items and computes how many fit within maxRows</li>
          <li>
            Re-tests with the overflow indicator; if it would create a new row,
            hides one more item
          </li>
          <li>
            Renders the stable "normal" state until container size changes
          </li>
        </ol>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Performance Notes
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              flushImmediately=true
            </code>{" "}
            — Immediate, flicker-free (uses flushSync)
          </li>
          <li>
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              flushImmediately=false
            </code>{" "}
            — Defer with rAF; smoother under rapid resize but may flicker
            briefly
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          React Version Notes
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>React 19.2+:</strong> Hidden items use{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              React.Activity
            </code>{" "}
            so overflowed children stay mounted while toggling visibility.
          </li>
          <li>
            <strong>React 16–18:</strong> Overflowed nodes unmount during
            measurement. Use{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              renderItemVisibility
            </code>{" "}
            if you need custom visibility control.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Requirements
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>React ≥ 16.8 (hooks)</li>
          <li>Modern browsers with ResizeObserver</li>
        </ul>
      </section>
    </div>
  );
}
