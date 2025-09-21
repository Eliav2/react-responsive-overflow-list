import "@radix-ui/themes/styles.css";
import React from "react";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import { renderToString } from "react-dom/server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const passToClient = ["pageProps", "routeParams"];

export async function render(pageContext: any) {
  const isSpa = (import.meta.env.VITE_APP_MODE ?? "ssr") === "spa";

  if (isSpa) {
    // SPA mode: return the original index.html
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const indexHtml = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
    return escapeInject`${dangerouslySkipEscape(indexHtml)}`;
  }

  // SSR mode: render HTML on the server
  const { Page, pageProps } = pageContext;
  const pageHtml = renderToString(React.createElement(Page, pageProps ?? {}));

  // Read the index.html template and inject the rendered content
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const indexHtml = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
  const htmlWithContent = indexHtml.replace('<div id="root"></div>', `<div id="root">${pageHtml}</div>`);

  return escapeInject`${dangerouslySkipEscape(htmlWithContent)}`;
}
