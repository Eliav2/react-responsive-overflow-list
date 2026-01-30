import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";

const PACKAGE_NAME = "react-responsive-overflow-list";

const managers = [
  { id: "npm", label: "npm", command: `npm install ${PACKAGE_NAME}` },
  { id: "pnpm", label: "pnpm", command: `pnpm add ${PACKAGE_NAME}` },
  { id: "yarn", label: "yarn", command: `yarn add ${PACKAGE_NAME}` },
] as const;

type ManagerId = (typeof managers)[number]["id"];

const STORAGE_KEY = "preferred-package-manager";

export function InstallTabs() {
  const [selected, setSelected] = useState<ManagerId>("npm");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ManagerId | null;
    if (stored && managers.some((m) => m.id === stored)) {
      setSelected(stored);
    }
  }, []);

  const handleSelect = (id: ManagerId) => {
    setSelected(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const handleCopy = async () => {
    const manager = managers.find((m) => m.id === selected);
    if (manager) {
      await navigator.clipboard.writeText(manager.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentCommand = managers.find((m) => m.id === selected)?.command;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden my-4">
      <div className="flex bg-gray-50 border-b border-gray-200">
        {managers.map((manager) => (
          <button
            key={manager.id}
            className={`px-5 py-2.5 bg-transparent border-none border-b-2 cursor-pointer text-sm font-medium transition-colors ${
              selected === manager.id
                ? "text-blue-600 border-b-blue-600 bg-white"
                : "text-gray-500 border-b-transparent hover:text-gray-900"
            }`}
            onClick={() => handleSelect(manager.id)}
          >
            {manager.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-4 bg-gray-900">
        <code className="text-gray-200 text-sm font-mono">{currentCommand}</code>
        <button
          className="flex items-center justify-center w-8 h-8 border-none rounded cursor-pointer text-gray-400 hover:bg-white/20 hover:text-white transition-colors"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}
