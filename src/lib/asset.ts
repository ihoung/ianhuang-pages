const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-absolute public asset path with the configured basePath.
 *  Works in dev (NEXT_PUBLIC_BASE_PATH unset → "") and in GH Pages
 *  static export (CI sets NEXT_PUBLIC_BASE_PATH="/<repo>"). */
export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}

/** Build a URL path that includes the basePath prefix for GitHub Pages.
 *  e.g. pathWithBase("/en") → "/ianhuang-pages/en" on GH Pages, "/en" in dev. */
export function pathWithBase(path: string): string {
  return asset(path);
}