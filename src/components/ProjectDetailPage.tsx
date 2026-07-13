import Link from "next/link";
import TopNav from "@/components/TopNav";
import TableOfContents from "@/components/TableOfContents";
import { renderMarkdown } from "@/lib/markdown";
import { getAllProjects, getProjectMarkdown, type Locale } from "@/lib/projects";

type Props = { locale: Locale; slug: string };
export default function ProjectDetailPage({ locale, slug }: Props) {
  const projects = getAllProjects(locale);
  const currentIndex = projects.findIndex((item) => item.slug === slug);
  const project = currentIndex >= 0 ? projects[currentIndex] : projects[0];
  if (!project) throw new Error("No projects are available in content/index.yml.");
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  const { source, filePath } = getProjectMarkdown(project, locale);
  const { html, headings } = renderMarkdown(source, { markdownFilePath: filePath });
  return (
    <>
      <TopNav active="/content" />
      <main className="site-container py-14 md:py-20">
        <header className="mb-10 md:mb-14 max-w-3xl">
          <h1 className="display-heading">{project.title}</h1>
          <p className="mt-4 text-white/60 leading-relaxed">{project.description}</p>
        </header>
        <nav className="mb-12 flex items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-widest">
          {prevProject ? (
            <Link
              href={`/${locale}/content/${prevProject.slug}`}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors"
            >
              <span aria-hidden>←</span>
              <span className="truncate max-w-[40vw]">{prevProject.title}</span>
            </Link>
          ) : <span className="px-3 py-2 opacity-0" aria-hidden>←</span>}
          <span className="px-3 py-2 text-white/40">{currentIndex + 1} / {projects.length}</span>
          {nextProject ? (
            <Link
              href={`/${locale}/content/${nextProject.slug}`}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors"
            >
              <span className="truncate max-w-[40vw] text-right">{nextProject.title}</span>
              <span aria-hidden>→</span>
            </Link>
          ) : <span className="px-3 py-2 opacity-0" aria-hidden>→</span>}
        </nav>
        <div className="project-content-layout">
          <TableOfContents headings={headings} />
          <article className="markdown-body max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </main>
    </>
  );
}
