import { SidebarNav } from "./SidebarNav";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 top-15 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          w-64 shrink-0 border-r border-gray-200 bg-gray-50
          h-[calc(100vh-60px)] sticky top-15 overflow-y-auto py-6
          md:block
          ${open ? "fixed left-0 top-15 bottom-0 z-50 shadow-lg block" : "hidden md:block"}
        `}
      >
        <SidebarNav onNavigate={onClose} />
      </aside>
    </>
  );
}
