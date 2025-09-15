// Use Preact for prerender ONLY (runtime stays React)
import render from "preact-render-to-string";
import App from "./App";

export async function prerender() {
  const html = render(<App />);
  return { html };
}
