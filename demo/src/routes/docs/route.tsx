import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DocsLayout } from "../../components/layout";

export const Route = createFileRoute("/docs")({
  component: DocsLayoutWrapper,
});

function DocsLayoutWrapper() {
  return (
    <DocsLayout>
      <Outlet />
    </DocsLayout>
  );
}
