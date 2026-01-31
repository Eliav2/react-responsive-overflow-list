import { createFileRoute } from "@tanstack/react-router";
import { ShadcnInstallTabs } from "../../components/docs/ShadcnInstallTabs";
import { ShadcnOverflowListExample } from "../../examples/ShadcnOverflowListExample";

export const Route = createFileRoute("/docs/shadcn")({
  component: ShadcnPage,
});

function ShadcnPage() {
  return (
    <div>
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        shadcn/ui Integration
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Install the OverflowList component via the shadcn CLI. See the{" "}
        <a href="/docs/api" className="text-blue-600 hover:underline">
          API Reference
        </a>{" "}
        for props documentation.
      </p>

      {/* Installation */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Installation
        </h2>
        <ShadcnInstallTabs />
      </section>

      {/* Live Preview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Live Preview
        </h2>
        <ShadcnOverflowListExample />
      </section>

      {/* Variants */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Variants
        </h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="text-left px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">

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
                  Built on
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  Radix UI
                </td>
                <td className="px-4 py-3 border-b border-gray-200 text-gray-600">
                  Base UI
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
                    button
                  </code>
                  ,{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    dropdown-menu
                  </code>
                  ,{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    @base-ui/react
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
