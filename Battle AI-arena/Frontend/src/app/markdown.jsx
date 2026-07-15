import React from 'react';

/**
 * A lightweight markdown renderer that parses header tags, bullet points,
 * inline styles (bold, code), and multi-line syntax blocks.
 */
export function Markdown({ text }) {
  if (!text) return null;

  const tokens = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  let lastIndex = 0;

  // Extract fenced code blocks
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const textBefore = text.slice(lastIndex, match.index);
    if (textBefore) {
      tokens.push({ type: 'text', content: textBefore });
    }
    tokens.push({
      type: 'code-block',
      language: match[1] || 'plaintext',
      content: match[2].trim(),
    });
    lastIndex = codeBlockRegex.lastIndex;
  }

  const textAfter = text.slice(lastIndex);
  if (textAfter) {
    tokens.push({ type: 'text', content: textAfter });
  }

  // Helper to parse bold (**bold**) and inline code (`code`)
  const parseInline = (inlineText) => {
    if (!inlineText) return '';
    const inlineRegex = /(\*\*.*?\*\*|`.*?`)/g;
    const splitParts = inlineText.split(inlineRegex);

    return splitParts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-semibold text-primary">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-xs font-semibold text-primary border border-outline-variant"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4 text-on-surface font-sans text-body-md leading-relaxed">
      {tokens.map((token, index) => {
        if (token.type === 'code-block') {
          return (
            <div
              key={index}
              className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden my-4 animate-fade-in"
            >
              {token.language && (
                <div className="bg-surface-container-high px-4 py-2 text-xs text-on-surface-variant font-mono border-b border-outline-variant flex justify-between items-center select-none">
                  <span className="uppercase font-bold tracking-wider">{token.language}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(token.content)}
                    className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer font-sans"
                    title="Copy Code"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>Copy</span>
                  </button>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-[13px] font-mono text-on-surface leading-relaxed">
                <code>{token.content}</code>
              </pre>
            </div>
          );
        }

        // Split text blocks by paragraph spacing
        const paragraphs = token.content.split(/\n\n+/);
        return paragraphs.map((para, pIdx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;

          // Header 1
          if (trimmed.startsWith('# ')) {
            return (
              <h1
                key={`p-${pIdx}`}
                className="text-2xl font-bold text-primary mt-6 mb-3 border-b border-outline-variant pb-2 leading-tight"
              >
                {parseInline(trimmed.slice(2))}
              </h1>
            );
          }
          // Header 2
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={`p-${pIdx}`}
                className="text-xl font-bold text-primary mt-5 mb-2 leading-tight"
              >
                {parseInline(trimmed.slice(3))}
              </h2>
            );
          }
          // Header 3
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={`p-${pIdx}`}
                className="text-lg font-semibold text-primary mt-4 mb-2 leading-tight"
              >
                {parseInline(trimmed.slice(4))}
              </h3>
            );
          }
          // Header 4
          if (trimmed.startsWith('#### ')) {
            return (
              <h4
                key={`p-${pIdx}`}
                className="text-base font-semibold text-primary mt-3 mb-1 leading-tight"
              >
                {parseInline(trimmed.slice(5))}
              </h4>
            );
          }

          // Check if block consists of bullet points
          const lines = trimmed.split('\n');
          const isBulletList = lines.every((line) => {
            const tl = line.trim();
            return tl.startsWith('- ') || tl.startsWith('* ') || tl === '';
          });

          if (isBulletList) {
            return (
              <ul key={`p-${pIdx}`} className="list-disc pl-5 space-y-1.5 my-3">
                {lines.map((line, lIdx) => {
                  const tl = line.trim();
                  if (!tl) return null;
                  const content = tl.startsWith('- ') ? tl.slice(2) : tl.slice(2);
                  return (
                    <li key={lIdx} className="text-on-surface">
                      {parseInline(content)}
                    </li>
                  );
                })}
              </ul>
            );
          }

          return (
            <p key={`p-${pIdx}`} className="mb-3 text-[15px] text-on-surface/90">
              {parseInline(trimmed.split('\n').join(' '))}
            </p>
          );
        });
      })}
    </div>
  );
}
