import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";

const isNetlify = process.env.NETLIFY === "true";
const isGithubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig(() => {
  const appMode = process.env.VITE_APP_MODE || ("spa" as "spa" | "ssr");
  console.log(`VITE_APP_MODE is "${appMode}"`);

  const base = isNetlify ? "/" : isGithubPages ? "/react-responsive-overflow-list/" : "/";

  const plugins = appMode === "spa" ? [react()] : [react(), vike()];
  return {
    plugins,
    ssr: {
      // Don't externalize React for SSR
      noExternal: ["react-responsive-overflow-list", "react-syntax-highlighter", "@types/react-syntax-highlighter"],
      // Handle CommonJS modules
      // external: ["react-copy-to-clipboard"],
    },
    base,
  };
});
