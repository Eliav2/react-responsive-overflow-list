import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";
import "./index.css";
import App from "./App.tsx";
import { renderToString } from "react-dom/server";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

export async function prerender() {
  const html = renderToString(<App />);
  return { html }; // you can also return { head, links, data } if needed
}
