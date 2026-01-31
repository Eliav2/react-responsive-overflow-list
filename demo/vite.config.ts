import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.app.json"],
    }),
    tanstackStart({
      prerender: {
        enabled: isStatic || isGithubPages,
        crawlLinks: true,
        failOnError: false,
      },
    }),
    viteReact(),
    nitro(),
    tailwindcss(),
  ],
  ssr: {
    noExternal: [
      "react-responsive-overflow-list",
      "react-syntax-highlighter",
      "@types/react-syntax-highlighter",
    ],
  },
});
