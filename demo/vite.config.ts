import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

import { ssr } from "vite-plugin-ssr/plugin";

export default defineConfig(() => {
  const appMode = process.env.VITE_APP_MODE || ("spa" as "spa" | "ssr");
  console.log(`VITE_APP_MODE is "${appMode}"`);

  const sharedConfig: Partial<import("vite").UserConfig> = {
    base: process.env.NODE_ENV === "production" ? "/react-responsive-overflow-list/" : "/",
    resolve: {
      // trick to avoid needing to build-watch the library when developing the demo
      alias: {
        "react-responsive-overflow-list": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
      },
    },
  };

  if (appMode === "spa") {
    return {
      plugins: [react()],
      ...sharedConfig,
    };
  }

  // ssr mode
  return {
    plugins: [
      react(),
      // vitePrerenderPlugin({
      //   renderTarget: "#root",
      //   prerenderScript: path.resolve(__dirname, "src/prerender.tsx"),
      // }),
      ssr({
        prerender: true,
      }),
    ],

    ssr: {
      // Don't externalize React for SSR
      noExternal: ["react-responsive-overflow-list", "react-syntax-highlighter", "@types/react-syntax-highlighter"],
      // Handle CommonJS modules
      // external: ["react-copy-to-clipboard"],
    },
    ...sharedConfig,
  };
});
