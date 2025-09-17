import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      renderTarget: "#root",
      prerenderScript: path.resolve(__dirname, "src/prerender.tsx"),
    }),
  ],
  server: {
    host: true,
    allowedHosts: [".csb.app"], // CodeSandbox preview URLs
    // If demo imports from ../src, also:
    // fs: { allow: ['..'] }
  },
  base: process.env.NODE_ENV === "production" ? "/react-responsive-overflow-list/" : "/",
  resolve: {
    // trick to avoid needing to build-watch the library when developing the demo
    alias: {
      "react-responsive-overflow-list": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
});
