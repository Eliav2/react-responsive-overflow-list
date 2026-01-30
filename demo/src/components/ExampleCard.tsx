import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, ChevronRight, Link, Check } from "lucide-react";

interface ExampleCardProps {
  id: string;
  title: string;
  description?: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export function ExampleCard({
  id,
  title,
  description,
  defaultExpanded = true,
  children,
}: ExampleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't toggle collapse
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <section className="mb-6 border border-gray-200 rounded-lg bg-white overflow-hidden scroll-mt-24" id={id}>
      <div className="flex items-center justify-between px-6 py-5 bg-gray-50 border-b border-gray-200">
        <button
          className="inline-flex items-center gap-3 bg-transparent border-none cursor-pointer text-left p-0 text-gray-800 hover:text-blue-600"
          style={{ display: 'inline-flex', alignItems: 'center' }}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <span className="shrink-0">{isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</span>
          <h2 className="m-0 text-xl font-semibold">{title}</h2>
        </button>
        <button
          className="shrink-0"
          onClick={copyLink}
          aria-label="Copy link to this example"
          title="Copy link"
        >
          {linkCopied ? <Check size={16} color="#16a34a" /> : <Link size={16} color="#4b5563" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-6">
          {description && <p className="mt-0 mb-5 text-gray-600 text-sm">{description}</p>}
          {children}
        </div>
      )}
    </section>
  );
}
