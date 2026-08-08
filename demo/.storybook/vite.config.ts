// Vite config used only by Storybook.
//
// Storybook otherwise picks up demo/vite.config.ts, whose tanstack-start and nitro plugins take over the
// build: `storybook build` then emits the demo app into .output/public and produces no story preview at all
// (no iframe.html), while still exiting successfully. So Storybook gets its own config with just what the
// stories need.

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const demoDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export default defineConfig({
  // Storybook is built into demo/public/storybook, so leaving publicDir on would have it copy the public
  // directory into a subdirectory of itself.
  publicDir: false,
  plugins: [viteReact(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(demoDir, "./src"),
    },
    // Same reason as demo/vite.config.ts: two react-dom copies make the library's flushSync a silent no-op.
    dedupe: ["react", "react-dom"],
  },
});
