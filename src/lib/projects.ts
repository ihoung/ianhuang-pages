import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { parseDocument } from "yaml";

export type Locale = "en" | "cn";
type LocalizedText = string | { en: string; cn: string };
type ProjectIndexEntry = { slug: string; title: LocalizedText; description: LocalizedText; thumbnail: string; file: string; featured?: boolean; tags?: string };
export type Project = { slug: string; title: string; description: string; thumbnail: string; file: string; featured: boolean; tags: string[] };
const contentRoot = resolve(process.cwd(), "content");

function fail(message: string): never { throw new Error(`Invalid content/index.yml: ${message}`); }
function contentPath(relativePath: string, label: string): string {
  if (!relativePath || typeof relativePath !== "string") fail(`${label} must be a non-empty string.`);
  const resolved = resolve(contentRoot, relativePath);
  if (resolved !== contentRoot && !resolved.startsWith(`${contentRoot}${sep}`)) fail(`${label} must stay inside the content directory.`);
  return resolved;
}
function localizedText(value: unknown, label: string): LocalizedText {
  if (typeof value === "string" && value.trim()) return value;
  if (value && typeof value === "object" && !Array.isArray(value) && typeof (value as { en?: unknown }).en === "string" && typeof (value as { cn?: unknown }).cn === "string") {
    const { en, cn } = value as { en: string; cn: string };
    if (en.trim() && cn.trim()) return { en, cn };
  }
  return fail(`${label} must be a non-empty string or an object with non-empty en and cn strings.`);
}
function resolveText(value: LocalizedText, locale: Locale): string { return typeof value === "string" ? value : value[locale]; }
function readIndex(): ProjectIndexEntry[] {
  const indexPath = contentPath("index.yml", "index.yml");
  if (!existsSync(indexPath)) throw new Error("Missing content/index.yml. Provide a local content directory or run npm run download-content in CI.");
  const document = parseDocument(readFileSync(indexPath, "utf8"));
  if (document.errors.length > 0) fail(document.errors.map((error) => error.message).join(" "));
  const root = document.toJSON();
  if (!root || typeof root !== "object" || Array.isArray(root)) fail("the root value must be an object with a projects array.");
  const projects = (root as { projects?: unknown }).projects;
  if (!Array.isArray(projects)) fail("projects must be an array.");
  const slugs = new Set<string>();
  return projects.map((entry, index) => {
    const label = `projects[${index}]`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) fail(`${label} must be an object.`);
    const item = entry as Record<string, unknown>;
    const slug = item.slug;
    if (typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(`${label}.slug must be a lowercase hyphenated identifier.`);
    if (slugs.has(slug)) fail(`${label}.slug duplicates ${slug}.`);
    slugs.add(slug);
    const thumbnail = item.thumbnail;
    if (typeof thumbnail !== "string" || !thumbnail.trim()) fail(`${label}.thumbnail must be a non-empty relative path.`);
    const thumbnailPath = contentPath(thumbnail, `${label}.thumbnail`);
    if (!existsSync(thumbnailPath) || !statSync(thumbnailPath).isFile()) fail(`${label}.thumbnail does not exist: ${thumbnail}.`);
    const file = item.file;
    if (typeof file !== "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(file)) fail(`${label}.file must be a filename base without an extension.`);
    if (item.featured !== undefined && typeof item.featured !== "boolean") fail(`${label}.featured must be a boolean when present.`);
    if (item.tags !== undefined && typeof item.tags !== "string") fail(`${label}.tags must be a comma-separated string when present.`);
    return { slug, title: localizedText(item.title, `${label}.title`), description: localizedText(item.description, `${label}.description`), thumbnail, file, featured: item.featured as boolean | undefined, tags: item.tags as string | undefined };
  });
}
function toProject(entry: ProjectIndexEntry, locale: Locale): Project { return { slug: entry.slug, title: resolveText(entry.title, locale), description: resolveText(entry.description, locale), thumbnail: entry.thumbnail, file: entry.file, featured: entry.featured ?? false, tags: entry.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [] }; }
export function getAllProjects(locale: Locale): Project[] { return readIndex().map((entry) => toProject(entry, locale)); }
export function getFeaturedProjects(locale: Locale, limit = 3): Project[] { return getAllProjects(locale).filter((project) => project.featured).slice(0, limit); }
export function getProjectBySlug(locale: Locale, slug: string): Project | undefined { return getAllProjects(locale).find((project) => project.slug === slug); }
export function getFirstProject(locale: Locale): Project { const project = getAllProjects(locale)[0]; if (!project) fail("projects must contain at least one project."); return project; }
export function getProjectMarkdown(project: Project, locale: Locale): string {
  const preferred = contentPath(`content/${project.file}_${locale}.md`, `content for ${project.slug}`);
  const fallbackLocale: Locale = locale === "en" ? "cn" : "en";
  const fallback = contentPath(`content/${project.file}_${fallbackLocale}.md`, `fallback content for ${project.slug}`);
  const source = existsSync(preferred) ? preferred : existsSync(fallback) ? fallback : null;
  if (!source) throw new Error(`Missing markdown for ${project.slug}. Expected ${project.file}_${locale}.md or ${project.file}_${fallbackLocale}.md in content/content/.`);
  return readFileSync(source, "utf8");
}
