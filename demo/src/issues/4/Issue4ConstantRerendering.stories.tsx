import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import App from "./src/App";

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

  return <App />;
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
