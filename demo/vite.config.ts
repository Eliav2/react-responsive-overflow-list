import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import vike from "vike/plugin";

export default defineConfig(() => {
  const appMode = process.env.VITE_APP_MODE || ("spa" as "spa" | "ssr");
  console.log(`VITE_APP_MODE is "${appMode}"`);

  return {
    plugins: [react(), vike()],
    ssr: {
      // Don't externalize React for SSR
      noExternal: ["react-responsive-overflow-list", "react-syntax-highlighter", "@types/react-syntax-highlighter"],
      // Handle CommonJS modules
      // external: ["react-copy-to-clipboard"],
    },
    base: process.env.NODE_ENV === "production" ? "/react-responsive-overflow-list/" : "/",
    resolve: {
      // trick to avoid needing to build-watch the library when developing the demo
      alias: {
        "react-responsive-overflow-list": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
      },
    },
  };
});
