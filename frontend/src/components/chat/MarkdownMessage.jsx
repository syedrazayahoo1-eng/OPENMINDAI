import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Dependency-free markdown renderer for assistant chat messages.
 *
 * The project has no markdown/syntax-highlighting library installed, so
 * rather than adding a new dependency this implements the subset of
 * markdown that actually shows up in AI chat responses: fenced code blocks
 * (with a language label + copy button), inline code, bold/italic, links,
 * headings, and ordered/unordered lists. Output is built as React elements
 * (never dangerouslySetInnerHTML), so streamed model output can never be
 * injected as raw HTML.
 */

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable (unsupported browser or insecure
      // context) — fail silently rather than showing a broken button.
    }
  };

  return (
    <div className="dt-chat-codeblock">
      <div className="dt-chat-codeblock-head">
        <span>{language || "text"}</span>
        <button className="dt-chat-copy-btn" onClick={handleCopy} type="button">
          {copied ? <Check size={13} strokeWidth={2.2} /> : <Copy size={13} strokeWidth={2.2} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Matches, in priority order: inline code, bold, links, italics.
const INLINE_PATTERN = /(`[^`]+`)|(\*\*[^*]+\*\*|__[^_]+__)|(\[[^\]]+\]\([^)]+\))|(\*[^*]+\*|_[^_]+_)/g;

function parseInline(text, keyPrefix) {
  const nodes = [];
  let lastIndex = 0;
  let match;
  let tokenIndex = 0;

  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-inline-${tokenIndex}`;
    tokenIndex += 1;

    if (token.startsWith("`")) {
      nodes.push(
        <code className="dt-chat-inline-code" key={key}>
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("[")) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      nodes.push(
        <a className="dt-chat-link" href={linkMatch[2]} key={key} rel="noreferrer" target="_blank">
          {linkMatch[1]}
        </a>
      );
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }

    lastIndex = INLINE_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderTextSegment(rawText, segmentIndex) {
  const lines = rawText.split("\n");
  const blocks = [];

  let listBuffer = [];
  let listType = null;

  const flushList = () => {
    if (!listBuffer.length) return;

    const ListTag = listType === "ol" ? "ol" : "ul";
    const blockKey = `${segmentIndex}-list-${blocks.length}`;

    blocks.push(
      <ListTag className="dt-chat-list" key={blockKey}>
        {listBuffer.map((item, itemIndex) => (
          <li key={`${blockKey}-item-${itemIndex}`}>{parseInline(item, `${blockKey}-${itemIndex}`)}</li>
        ))}
      </ListTag>
    );

    listBuffer = [];
    listType = null;
  };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();
    const blockKey = `${segmentIndex}-${lineIndex}`;

    if (!trimmed) {
      flushList();
      return;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      flushList();
      const level = Math.min(headingMatch[1].length + 2, 6);
      const HeadingTag = `h${level}`;
      blocks.push(
        <HeadingTag className="dt-chat-heading" key={blockKey}>
          {parseInline(headingMatch[2], blockKey)}
        </HeadingTag>
      );
      return;
    }

    const orderedMatch = /^\d+\.\s+(.*)$/.exec(trimmed);
    if (orderedMatch) {
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(orderedMatch[1]);
      return;
    }

    const unorderedMatch = /^[-*]\s+(.*)$/.exec(trimmed);
    if (unorderedMatch) {
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(unorderedMatch[1]);
      return;
    }

    flushList();
    blocks.push(
      <p className="dt-chat-paragraph" key={blockKey}>
        {parseInline(trimmed, blockKey)}
      </p>
    );
  });

  flushList();

  return blocks;
}

export default function MarkdownMessage({ content }) {
  if (!content) {
    return null;
  }

  const segments = [];
  const codeFencePattern = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeFencePattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }

    segments.push({
      type: "code",
      language: match[1],
      value: match[2].replace(/\n$/, ""),
    });

    lastIndex = codeFencePattern.lastIndex;
  }

  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  return (
    <div className="dt-chat-markdown">
      {segments.map((segment, segmentIndex) =>
        segment.type === "code" ? (
          <CodeBlock code={segment.value} key={`code-${segmentIndex}`} language={segment.language} />
        ) : (
          <div key={`text-${segmentIndex}`}>{renderTextSegment(segment.value, segmentIndex)}</div>
        )
      )}
    </div>
  );
}