import { readFileSync } from "node:fs";
import { join } from "node:path";
import TopNav from "@/components/TopNav";
import { renderMarkdown } from "@/lib/markdown";

type Content = {
  slug: string;
  title: string;
  subtitle: string;
  file: string;
};

const entries: Content[] = [
  {
    slug: "about",
    title: "About",
    subtitle: "Designer &amp; developer",
    file: "about.md",
  },
  {
    slug: "neon-dashboard",
    title: "Neon Dashboard",
    subtitle: "Project detail",
    file: "neon-dashboard.md",
  },
];

type Params = { slug?: string };

export default function ContentPage({
  params,
}: {
  params: Params;
}) {
  const slug = (params?.slug as string | undefined) ?? "about";
  const entry =
    entries.find((e) => e.slug === slug) ?? entries[0];

  const contentDir = join(process.cwd(), "src", "content");
  const raw = readFileSync(join(contentDir, entry.file), "utf8");
  const html = renderMarkdown(raw);

  return (
    <>
      <TopNav active="/content" />
      <main className="site-container py-14 md:py-20">
        <header className="mb-10 md:mb-14 max-w-3xl">
          <span className="pill-tag mb-5" dangerouslySetInnerHTML={{ __html: entry.subtitle }} />
          <h1 className="display-heading">{entry.title}</h1>
        </header>

        <nav className="mb-12 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-widest">
          {entries.map((e) => {
            const active = e.slug === entry.slug;
            const href = e.slug === "about" ? "/content" : `/content/${e.slug}`;
            return (
              <a
                key={e.slug}
                href={href}
                className={`px-3 py-2 rounded-full border transition-colors ${
                  active
                    ? "border-accent text-foreground"
                    : "border-white/10 text-white/50 hover:text-white hover:border-white/25"
                }`}
              >
                {e.title}
              </a>
            );
          })}
        </nav>

        <article
          className="markdown-body max-w-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      <footer className="site-container py-10 text-[11px] font-mono uppercase tracking-widest text-white/40 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Ian Huang</span>
        <span>Content · {entry.title}</span>
      </footer>
    </>
  );
}
