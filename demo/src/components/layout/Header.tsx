import { Github, Menu, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-15">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 bg-transparent border border-gray-200 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link
            to="/docs/getting-started"
            className="text-gray-900 font-semibold text-base no-underline hover:text-blue-600 transition-colors"
          >
            react-responsive-overflow-list
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/eliav2/react-responsive-overflow-list"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="View on GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}
