import { useLocation } from "@tanstack/react-router";
import {
  navigation,
  type NavItem,
  type NavSection,
} from "../../config/navigation";

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentHash = location.hash;

  const isActive = (item: NavItem) => {
    if (item.isAnchor) {
      const [path, hash] = item.href.split("#");
      return currentPath === path && currentHash === `#${hash}`;
    }
    return currentPath === item.href;
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }

    if (item.isAnchor) {
      const [path, hash] = item.href.split("#");
      if (currentPath === path) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${hash}`);
        }
      }
    }

    onNavigate?.();
  };

  return (
    <nav className="px-4">
      {navigation.map((section: NavSection) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 px-3">
            {section.title}
          </h3>
          <ul className="list-none m-0 p-0">
            {section.items.map((item: NavItem) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleClick(e, item)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md no-underline text-sm transition-colors ${
                    isActive(item)
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : item.disabled
                        ? "text-gray-400 pointer-events-none"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                  aria-disabled={item.disabled}
                >
                  {item.title}
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">
                      {item.badge}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
