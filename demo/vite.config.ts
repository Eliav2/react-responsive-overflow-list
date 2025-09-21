import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

import { ssr } from "vite-plugin-ssr/plugin";

export default defineConfig({
  plugins: [
    react(),
    // vitePrerenderPlugin({
    //   renderTarget: "#root",
    //   prerenderScript: path.resolve(__dirname, "src/prerender.tsx"),
    // }),
    ssr(),
  ],
  define: { "import.meta.env.VITE_APP_MODE": JSON.stringify(process.env.VITE_APP_MODE || "spa") },

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
});
