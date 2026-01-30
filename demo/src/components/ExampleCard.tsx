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
    <section className="example-card" id={id}>
      <div className="example-card-header">
        <button
          className="example-card-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          <h2>{title}</h2>
        </button>
        <button
          className="example-card-link"
          onClick={copyLink}
          aria-label="Copy link to this example"
          title="Copy link"
        >
          {linkCopied ? <Check size={16} className="copy-success" /> : <Link size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="example-card-content">
          {description && <p className="example-card-description">{description}</p>}
          {children}
        </div>
      )}
    </section>
  );
}
