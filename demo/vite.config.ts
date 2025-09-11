import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
	plugins: [react()],
	resolve: {
		// this trick allows us to directly use the package from the root, without needing to compile typescript 
		alias: {
			"react-responsive-overflow-list": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
		},
	},
});
