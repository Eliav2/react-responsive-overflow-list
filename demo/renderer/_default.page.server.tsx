import "@radix-ui/themes/styles.css";
import React from "react";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import { renderToString } from "react-dom/server";

export const passToClient = ["pageProps", "routeParams"];

export async function render(pageContext: any) {
  const isSpa = (import.meta.env.VITE_APP_MODE ?? "ssr") === "spa";

  if (isSpa) {
    // SPA mode: no SSR, just an empty shell + client boot
    return escapeInject`<!DOCTYPE html>
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>App (SPA)</title>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>`;
  }

  // SSR mode: render HTML on the server
  const { Page, pageProps } = pageContext;
  const pageHtml = renderToString(React.createElement(Page, pageProps ?? {}));

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>App (SSR)</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
