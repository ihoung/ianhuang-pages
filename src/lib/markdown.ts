/**
 * A tiny, dependency-free markdown renderer for static content pages.
 * Supports: headings (h1-h3), paragraphs, bold/italic, links,
 * blockquotes, inline code, unordered/ordered lists, hr, and
 * simple HTML entities. Not a full CommonMark implementation — just
 * enough for portfolio writing.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(text: string): string {
  let out = escapeHtml(text);

  // Inline code: `code`
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold: **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");

  // Links: [text](href)
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  return out;
}

export function renderMarkdown(source: string): string {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const html: string[] = [];

  let i = 0;
  let inQuote = false;
  let inUl = false;
  let inOl = false;
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length) {
      html.push(`<p>${renderInline(paragraphLines.join(" "))}</p>`);
      paragraphLines = [];
    }
  };

  const closeLists = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  const closeQuote = () => {
    if (inQuote) {
      html.push("</blockquote>");
      inQuote = false;
    }
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    // Horizontal rule
    if (/^---+\s*$/.test(line.trim())) {
      flushParagraph();
      closeLists();
      closeQuote();
      html.push("<hr />");
      i++;
      continue;
    }

    // Headings
    const heading = /^(#{1,3})\s+(.+)$/.exec(line.trim());
    if (heading) {
      flushParagraph();
      closeLists();
      closeQuote();
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(line)) {
      flushParagraph();
      closeLists();
      if (!inQuote) {
        html.push("<blockquote>");
        inQuote = true;
      }
      const content = line.replace(/^>\s?/, "").trim();
      if (content) {
        html.push(`<p>${renderInline(content)}</p>`);
      }
      i++;
      continue;
    } else {
      closeQuote();
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph();
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        html.push("<ul>");
        inUl = true;
      }
      html.push(`<li>${renderInline(line.replace(/^\s*[-*]\s+/, ""))}</li>`);
      i++;
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      flushParagraph();
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        html.push("<ol>");
        inOl = true;
      }
      html.push(`<li>${renderInline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`);
      i++;
      continue;
    } else {
      closeLists();
    }

    // Empty line — flush paragraph
    if (line.trim() === "") {
      flushParagraph();
      i++;
      continue;
    }

    // Accumulate paragraph text
    paragraphLines.push(line.trim());
    i++;
  }

  flushParagraph();
  closeLists();
  closeQuote();

  return html.join("\n");
}
