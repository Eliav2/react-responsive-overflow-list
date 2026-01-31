import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";

const BASE_URL = "https://eliav2.github.io/react-responsive-overflow-list/r/styles";

const variants = [
  {
    id: "radix",
    label: "Radix UI",
    command: `npx shadcn@latest add ${BASE_URL}/radix-vega/overflow-list.json`,
    description: "Uses shadcn radix primitives",
  },
  {
    id: "base-ui",
    label: "Base UI",
    command: `npx shadcn@latest add ${BASE_URL}/base-vega/overflow-list.json`,
    description: "Uses shadcn base-ui primitives",
  },
] as const;

type VariantId = (typeof variants)[number]["id"];

const STORAGE_KEY = "preferred-shadcn-variant";

export function ShadcnInstallTabs() {
  const [selected, setSelected] = useState<VariantId>("radix");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as VariantId | null;
    if (stored && variants.some((v) => v.id === stored)) {
      setSelected(stored);
    }
  }, []);

  const handleSelect = (id: VariantId) => {
    setSelected(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const handleCopy = async () => {
    const variant = variants.find((v) => v.id === selected);
    if (variant) {
      await navigator.clipboard.writeText(variant.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentVariant = variants.find((v) => v.id === selected);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden my-4">
      <div className="flex bg-gray-50 border-b border-gray-200">
        {variants.map((variant) => (
          <button
            key={variant.id}
            className={`px-5 py-2.5 bg-transparent border-none border-b-2 cursor-pointer text-sm font-medium transition-colors ${
              selected === variant.id
                ? "text-blue-600 border-b-blue-600 bg-white"
                : "text-gray-500 border-b-transparent hover:text-gray-900"
            }`}
            onClick={() => handleSelect(variant.id)}
          >
            {variant.label}
          </button>
        ))}
      </div>
      <div className="px-4 py-4 bg-gray-900">
        <div className="flex items-center justify-between">
          <code className="text-gray-200 text-sm font-mono break-all">
            {currentVariant?.command}
          </code>
          <button
            className="flex items-center justify-center w-8 h-8 ml-4 shrink-0 border-none rounded cursor-pointer text-gray-400 hover:bg-white/20 hover:text-white transition-colors"
            onClick={handleCopy}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        {currentVariant?.description && (
          <p className="mt-2 text-gray-400 text-xs">{currentVariant.description}</p>
        )}
      </div>
    </div>
  );
}
