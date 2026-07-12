import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { parseDocument } from "yaml";

export const contentRoot = resolve(process.cwd(), "content");
export const publicContentRoot = resolve(process.cwd(), "public", "content");

function fail(message) { throw new Error(`Invalid content/index.yml: ${message}`); }
export function safeContentPath(relativePath, label) {
  if (typeof relativePath !== "string" || !relativePath.trim()) fail(`${label} must be a non-empty relative path.`);
  const target = resolve(contentRoot, relativePath);
  if (!target.startsWith(`${contentRoot}${sep}`)) fail(`${label} must stay inside the content directory.`);
  return target;
}
function validText(value) {
  return typeof value === "string" && value.trim() || value && typeof value === "object" && !Array.isArray(value) && typeof value.en === "string" && value.en.trim() && typeof value.cn === "string" && value.cn.trim();
}
export function loadAndValidateProjects() {
  const indexPath = resolve(contentRoot, "index.yml");
  if (!existsSync(indexPath)) throw new Error("Missing content/index.yml. Provide a local content directory or run npm run download-content in CI.");
  const document = parseDocument(readFileSync(indexPath, "utf8"));
  if (document.errors.length) fail(document.errors.map((error) => error.message).join(" "));
  const root = document.toJSON();
  if (!root || typeof root !== "object" || Array.isArray(root) || !Array.isArray(root.projects)) fail("the root must contain a projects array.");
  const slugs = new Set();
  return root.projects.map((project, index) => {
    const label = `projects[${index}]`;
    if (!project || typeof project !== "object" || Array.isArray(project)) fail(`${label} must be an object.`);
    if (typeof project.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) fail(`${label}.slug must be a lowercase hyphenated identifier.`);
    if (slugs.has(project.slug)) fail(`${label}.slug duplicates ${project.slug}.`);
    slugs.add(project.slug);
    if (!validText(project.title)) fail(`${label}.title must be a string or an object with en and cn strings.`);
    if (!validText(project.description)) fail(`${label}.description must be a string or an object with en and cn strings.`);
    const thumbnailPath = safeContentPath(project.thumbnail, `${label}.thumbnail`);
    if (!existsSync(thumbnailPath) || !statSync(thumbnailPath).isFile()) fail(`${label}.thumbnail does not exist: ${project.thumbnail}.`);
    if (typeof project.file !== "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(project.file)) fail(`${label}.file must be a filename base without an extension.`);
    if (project.featured !== undefined && typeof project.featured !== "boolean") fail(`${label}.featured must be a boolean when present.`);
    if (project.tags !== undefined && typeof project.tags !== "string") fail(`${label}.tags must be a comma-separated string when present.`);
    const en = safeContentPath(`content/${project.file}_en.md`, `${label} English markdown`);
    const cn = safeContentPath(`content/${project.file}_cn.md`, `${label} Chinese markdown`);
    if (!existsSync(en) && !existsSync(cn)) fail(`${label} needs at least one of content/${project.file}_en.md or content/${project.file}_cn.md.`);
    return project;
  });
}

export function preparePublicThumbnails(projects) {
  rmSync(publicContentRoot, { recursive: true, force: true });
  for (const project of projects) {
    const source = safeContentPath(project.thumbnail, `thumbnail for ${project.slug}`);
    const destination = resolve(publicContentRoot, project.thumbnail);
    if (!destination.startsWith(`${publicContentRoot}${sep}`)) fail(`thumbnail for ${project.slug} escapes public/content.`);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination);
  }
}

const VIDEO_REFERENCE = /!video\[([^\]]*)\]\(([^)]+)\)/g;
function isExternalVideoUrl(url) {
  return /youtube\.com|youtu\.be|bilibili\.com/.test(url);
}

/** Scan project markdown files for !video[...](local-path) references and copy
 *  the referenced local video files into public/content/ so they can be served
 *  as static assets. YouTube/Bilibili URLs are skipped (they are embedded via iframe). */
export function preparePublicVideos(projects) {
  for (const project of projects) {
    for (const locale of ["en", "cn"]) {
      const mdPath = safeContentPath(`content/${project.file}_${locale}.md`, `${project.slug} ${locale} markdown`);
      if (!existsSync(mdPath)) continue;
      const source = readFileSync(mdPath, "utf8");
      VIDEO_REFERENCE.lastIndex = 0;
      let match;
      while ((match = VIDEO_REFERENCE.exec(source)) !== null) {
        const url = match[2].trim();
        if (isExternalVideoUrl(url)) continue;
        const mdDir = dirname(mdPath);
        const videoSource = resolve(mdDir, url);
        if (!videoSource.startsWith(`${contentRoot}${sep}`)) {
          fail(`video path escapes content directory: ${url} in ${project.file}_${locale}.md`);
        }
        if (!existsSync(videoSource) || !statSync(videoSource).isFile()) {
          fail(`video file not found: ${url} referenced in ${project.file}_${locale}.md`);
        }
        const rel = relative(contentRoot, videoSource);
        const dest = resolve(publicContentRoot, rel);
        if (!dest.startsWith(`${publicContentRoot}${sep}`)) {
          fail(`video destination escapes public/content: ${url}`);
        }
        mkdirSync(dirname(dest), { recursive: true });
        cpSync(videoSource, dest);
      }
    }
  }
}
