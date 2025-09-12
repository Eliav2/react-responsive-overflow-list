import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/react-responsive-overflow-list/" : "/",
  resolve: {
    // Use built library in production, source in development
    alias: {
      "react-responsive-overflow-list": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
});
