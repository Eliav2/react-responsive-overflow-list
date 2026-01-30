import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const isGithubPages =
  typeof window !== "undefined"
    ? window.location.pathname.startsWith("/react-responsive-overflow-list")
    : process.env.GITHUB_PAGES === "true";

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    // Base path for GitHub Pages deployment
    basepath: isGithubPages ? "/react-responsive-overflow-list" : "/",
  });
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
