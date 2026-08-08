import type { StorybookConfig } from "@storybook/react-vite";

// Storybook is published as a subdirectory of the demo site, so its assets are requested from
// `<demo base>/storybook/`. The demo is served from the root on Netlify and from the repository name on
// GitHub Pages, so the base is derived the same way demo/vite.config.ts derives its own.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const demoBase = isGithubPages ? "/react-responsive-overflow-list/" : "/";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {
      // Without this Storybook loads demo/vite.config.ts, whose tanstack-start and nitro plugins hijack the
      // build and emit the demo app instead of a story preview. See ./vite.config.ts.
      builder: { viteConfigPath: ".storybook/vite.config.ts" },
    },
  },
  viteFinal(viteConfig) {
    viteConfig.base = `${demoBase}storybook/`;
    return viteConfig;
  },
};

export default config;
