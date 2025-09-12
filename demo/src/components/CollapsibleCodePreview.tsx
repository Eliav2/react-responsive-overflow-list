import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, ChevronDown, ChevronRight, Check } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IconButton } from "@radix-ui/themes";

interface CollapsibleCodePreviewProps {
  code: string;
  language?: string;
  title?: string;
  defaultCollapsed?: boolean;
  usageCode?: string;
}

export function CollapsibleCodePreview({
  code,
  language = "tsx",
  title = "Code Example",
  defaultCollapsed = false,
  usageCode,
}: CollapsibleCodePreviewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Combine usage code and implementation code if usageCode is provided
  const combinedCode = usageCode ? `${usageCode}\n\n// Implementation:\n${code}` : code;

  return (
    <div className="collapsible-code-preview">
      <div className="code-preview-header">
        <button
          className="collapse-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand code" : "Collapse code"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          <span className="code-title">{title}</span>
        </button>

        <CopyToClipboard text={combinedCode} onCopy={handleCopy}>
          <IconButton className="copy-button" aria-label="Copy code">
            {copied ? <Check size={16} className="copy-success" /> : <Copy size={16} />}
          </IconButton>
        </CopyToClipboard>
      </div>

      {!isCollapsed && (
        <div className="code-preview-content">
          <SyntaxHighlighter
            language={language}
            style={tomorrow}
            customStyle={{
              margin: 0,
              borderRadius: "0 0 6px 6px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {combinedCode}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
