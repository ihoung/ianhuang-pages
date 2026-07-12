/**
 * A tiny, dependency-free markdown renderer for static content pages.
 * Supports: headings (h1-h3), paragraphs, bold/italic, links,
 * blockquotes, inline code, unordered/ordered lists, hr, and
 * simple HTML entities. Not a full CommonMark implementation — just
 * enough for portfolio writing.
 *
 * Video syntax: !video[caption](url)
 *   - Local mp4 (path relative to the markdown file):
 *       !video[演示视频](../videos/demo.mp4)
 *   - YouTube (watch / youtu.be / embed / shorts URLs):
 *       !video[演示视频](https://www.youtube.com/watch?v=xxxxxxxxxxx)
 *   - Bilibili (bilibili.com/video/BVxxxx URLs):
 *       !video[演示视频](https://www.bilibili.com/video/BV1xx411c7mD)
 *
 * Local video files are resolved against the markdown file location
 * and must live inside the content/ directory; they are served from
 * /content/<relative-path> (with basePath applied automatically).
 */

import { resolve, relative, sep } from "node:path";
import { asset } from "@/lib/asset";

const contentRoot = resolve(process.cwd(), "content");

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type RenderMarkdownOptions = {
  /** Absolute path to the markdown source file, used to resolve relative video paths. */
  markdownFilePath?: string;
};

/** Extract the 11-char YouTube video id from any common YouTube URL shape. */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/** Extract the BV id from a Bilibili video URL. */
function extractBilibiliBvid(url: string): string | null {
  const match = url.match(/bilibili\.com\/video\/(BV[A-Za-z0-9]+)/);
  return match ? match[1] : null;
}

/** Build the HTML for a video embed (local mp4, YouTube, or Bilibili). */
function renderVideo(url: string, caption: string, options: RenderMarkdownOptions): string {
  const safeCaption = escapeHtml(caption);
  const captionHtml = caption ? `<figcaption>${safeCaption}</figcaption>` : "";

  // YouTube
  const ytId = extractYouTubeId(url);
  if (ytId) {
    const embedUrl = `https://www.youtube.com/embed/${ytId}`;
    return `<figure class="video-embed"><div class="video-frame"><iframe src="${embedUrl}" title="${safeCaption}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>${captionHtml}</figure>`;
  }

  // Bilibili
  const bvId = extractBilibiliBvid(url);
  if (bvId) {
    const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvId}&high_quality=1&autoplay=0`;
    return `<figure class="video-embed"><div class="video-frame"><iframe src="${embedUrl}" title="${safeCaption}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>${captionHtml}</figure>`;
  }

  // Local file — resolve relative to the markdown file, then map to /content/<rel>
  let publicUrl: string;
  if (options.markdownFilePath) {
    const resolved = resolve(options.markdownFilePath, "..", url);
    const rel = relative(contentRoot, resolved).split(sep).join("/");
    publicUrl = asset(`/content/${rel}`);
  } else {
    publicUrl = asset(url.startsWith("/") ? url : `/${url}`);
  }

  return `<figure class="video-embed"><div class="video-frame"><video controls preload="metadata" title="${safeCaption}"><source src="${publicUrl}" type="video/mp4" />${safeCaption || "Your browser does not support the video tag."}</video></div>${captionHtml}</figure>`;
}

function renderInline(text: string, options: RenderMarkdownOptions): string {
  // Pull out !video[caption](url) references before escaping so URLs stay intact.
  const videos: string[] = [];
  const working = text.replace(/!video\[([^\]]*)\]\(([^)]+)\)/g, (_m, caption: string, url: string) => {
    videos.push(renderVideo(url.trim(), caption.trim(), options));
    return `\u0000V${videos.length - 1}\u0000`;
  });

  let out = escapeHtml(working);

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

  // Restore video embeds
  out = out.replace(/\u0000V(\d+)\u0000/g, (_m, idx: string) => videos[Number(idx)]);

  return out;
}

export function renderMarkdown(source: string, options: RenderMarkdownOptions = {}): string {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const html: string[] = [];

  let i = 0;
  let inQuote = false;
  let inUl = false;
  let inOl = false;
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length) {
      html.push(`<p>${renderInline(paragraphLines.join(" "), options)}</p>`);
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
      html.push(`<h${level}>${renderInline(heading[2], options)}</h${level}>`);
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
        html.push(`<p>${renderInline(content, options)}</p>`);
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
      html.push(`<li>${renderInline(line.replace(/^\s*[-*]\s+/, ""), options)}</li>`);
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
      html.push(`<li>${renderInline(line.replace(/^\s*\d+\.\s+/, ""), options)}</li>`);
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
