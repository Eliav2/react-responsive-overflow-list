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
    </div>
  );
}
