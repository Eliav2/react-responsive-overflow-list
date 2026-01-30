import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/shadcn")({
  component: ShadcnPage,
});

function ShadcnPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        shadcn/ui Integration
      </h1>
      <div className="text-center py-10">
        <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-semibold text-sm mb-6">
          Coming Soon
        </span>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
          We're working on official shadcn/ui registry support for OverflowList.
        </p>

        <div className="text-left max-w-xl mx-auto">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              What's Planned
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Registry Components</strong> — Install via{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                  npx shadcn@latest add
                </code>
              </li>
              <li>
                <strong>Pre-styled Variants</strong> — Overflow menus, toolbars,
                and navigation patterns
              </li>
              <li>
                <strong>Radix Integration</strong> — Built on Radix UI
                primitives for accessibility
              </li>
              <li>
                <strong>Dark Mode</strong> — Full support for light and dark
                themes
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Preview
            </h2>
            <p className="text-gray-700 mb-4">
              Once available, installation will be as simple as:
            </p>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <pre className="m-0 p-4 overflow-x-auto">
                <code className="text-gray-200 text-sm">{`npx shadcn@latest add https://eliav2.github.io/react-responsive-overflow-list/registry/overflow-list.json`}</code>
              </pre>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Stay Updated
            </h2>
            <p className="text-gray-700">
              Watch the{" "}
              <a
                href="https://github.com/eliav2/react-responsive-overflow-list"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub repository
              </a>{" "}
              for updates on the shadcn/ui integration.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
