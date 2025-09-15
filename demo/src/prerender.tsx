// prerender.tsx
import { renderToString } from "react-dom/server";
import App from "./App"; // <- path to your demo's root component

export async function prerender() {
  const html = renderToString(<App />);

  // Ensure all content is rendered for anchor links to work
  return {
    html,
    // Add any additional head content if needed
    head: `
      <meta name="description" content="React Responsive Overflow List - A responsive component that automatically handles overflow items">
    `,
  };
}
