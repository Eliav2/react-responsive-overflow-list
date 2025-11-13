import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { OverflowList } from "react-responsive-overflow-list";

// Minimal typed alias for the Web Awesome custom element so TSX accepts it
// as a valid React component.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WaTag: any = "wa-tag";

const testTags = [
  { id: "1", name: "tag1" },
  { id: "2", name: "tag2" },
  { id: "3", name: "tag3" },
  { id: "4", name: "tag4" },
  { id: "5", name: "tag5" },
  { id: "6", name: "tag6" },
];

const DemoContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      minHeight: "60px",
      padding: "16px",
      border: "2px dashed #ddd",
      borderRadius: "6px",
      backgroundColor: "#ebebeb",
      resize: "horizontal",
      overflow: "auto",
      minWidth: "200px",
      maxWidth: "100%",
    }}
  >
    {children}
  </div>
);

const Issue4ExampleContent = () => (
  <div
    style={{
      display: "flex",
      gap: "1rem",
      padding: "1rem",
      flexDirection: "column",
      width: "600px",
    }}
  >
    {/* Control: simple span-based tags (works fine) */}
    <DemoContainer>
      <OverflowList
        items={testTags}
        maxRows={1}
        renderItem={(item) => (
          <span key={item.id} style={{ padding: "4px 8px", background: "#fff", borderRadius: "4px" }}>
            {item.name}
          </span>
        )}
        style={{
          gap: "8px",
        }}
      />
    </DemoContainer>

    {/* Repro: Web Awesome wa-tag custom element (causes constant re-rendering) */}
    <DemoContainer>
      <OverflowList
        items={testTags}
        maxRows={1}
        renderItem={(item) => (
          // Web Awesome custom element – see issue #4 for context:
          // https://github.com/Eliav2/react-responsive-overflow-list/issues/4
          // The measurement logic does not fully stabilize with this element.
          <WaTag key={item.id} variant="brand">
            {item.name}
          </WaTag>
        )}
        style={{
          gap: "8px",
        }}
      />
    </DemoContainer>
  </div>
);

const loadWebAwesomeForIssue4 = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if ("customElements" in window && customElements.get("wa-tag")) return;

  const ensureLink = (id: string, href: string) => {
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  };

  const ensureScriptModule = (id: string, src: string) => {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.type = "module";
    script.src = src;
    document.head.appendChild(script);
  };

  // Mirror the Codesandbox HTML setup, but scoped to this story only.
  ensureLink(
    "webawesome-theme-default",
    "https://early.webawesome.com/webawesome@3.0.0-beta.6/dist/styles/themes/default.css"
  );
  ensureLink(
    "webawesome-core-styles",
    "https://early.webawesome.com/webawesome@3.0.0-beta.6/dist/styles/webawesome.css"
  );
  ensureScriptModule(
    "webawesome-loader",
    "https://early.webawesome.com/webawesome@3.0.0-beta.6/dist/webawesome.loader.js"
  );
};

const Issue4StoryWrapper = () => {
  useEffect(() => {
    loadWebAwesomeForIssue4();
  }, []);

  return <Issue4ExampleContent />;
};

const meta = {
  title: "Issues/Issue #4 - Constant rerendering with wa-tag",
  component: Issue4StoryWrapper,
  parameters: {
    docs: {
      description: {
        story:
          "Reproduction of [GitHub issue #4](https://github.com/Eliav2/react-responsive-overflow-list/issues/4) " +
          "where using the Web Awesome `wa-tag` custom element inside `OverflowList` causes constant re-rendering " +
          "due to measurement and resize feedback.",
      },
    },
  },
} satisfies Meta<typeof Issue4StoryWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ConstantRerenderingWithWaTag: Story = {
  name: "Issue #4 – Constant rerendering with wa-tag",
  args: {},
};
