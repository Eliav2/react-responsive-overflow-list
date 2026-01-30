import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const isNetlify = process.env.NETLIFY === "true";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const isSpa = (process.env.VITE_APP_MODE ?? "spa") === "spa";

console.log(`VITE_APP_MODE is "${isSpa ? "spa" : "ssr"}"`);

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
      // SPA mode configuration (per official start-basic-static example)
      ...(isSpa && {
        spa: {
          enabled: true,
          prerender: {
            crawlLinks: true,
          },
        },
        prerender: {
          failOnError: false,
        },
      }),
    }),
    // IMPORTANT: viteReact must come AFTER tanstackStart
    viteReact(),
    // nitro only needed for SSR mode
    ...(!isSpa ? [nitro()] : []),
  ],
  ssr: {
    noExternal: [
      "react-responsive-overflow-list",
      "react-syntax-highlighter",
      "@types/react-syntax-highlighter",
    ],
  },
});
