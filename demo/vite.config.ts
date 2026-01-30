import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const isNetlify = process.env.NETLIFY === "true";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const isStatic = (process.env.VITE_APP_MODE ?? "ssr") === "static";

console.log(`VITE_APP_MODE is "${isStatic ? "static" : "ssr"}"`);

const base = isNetlify ? "/" : isGithubPages ? "/react-responsive-overflow-list/" : "/";

export default defineConfig({
  base,
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      // Static prerendering: full SSR at build time, generates complete HTML files
      // Used for GitHub Pages - pre-renders all pages as static HTML
      prerender: {
        enabled: isStatic || isGithubPages,
        crawlLinks: true,
        failOnError: false,
      },
    }),
    // IMPORTANT: viteReact must come AFTER tanstackStart
    viteReact(),
    // nitro needed for SSR server and static prerendering
    nitro(),
  ],
  ssr: {
    noExternal: [
      "react-responsive-overflow-list",
      "react-syntax-highlighter",
      "@types/react-syntax-highlighter",
    ],
  },
});
