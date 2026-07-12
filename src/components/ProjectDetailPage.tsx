import Link from "next/link";
import TopNav from "@/components/TopNav";
import { renderMarkdown } from "@/lib/markdown";
import { getAllProjects, getProjectMarkdown, type Locale } from "@/lib/projects";

type Props = { locale: Locale; slug: string };
export default function ProjectDetailPage({ locale, slug }: Props) {
  const projects = getAllProjects(locale);
  const project = projects.find((item) => item.slug === slug) ?? projects[0];
  if (!project) throw new Error("No projects are available in content/index.yml.");
  const html = renderMarkdown(getProjectMarkdown(project, locale));
  return <><TopNav active="/content" /><main className="site-container py-14 md:py-20"><header className="mb-10 md:mb-14 max-w-3xl"><h1 className="display-heading">{project.title}</h1><p className="mt-4 text-white/60 leading-relaxed">{project.description}</p></header><nav className="mb-12 flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-widest">{projects.map((item) => <Link key={item.slug} href={`/${locale}/content/${item.slug}`} className={`px-3 py-2 rounded-full border transition-colors ${item.slug === project.slug ? "border-accent text-foreground" : "border-white/10 text-white/50 hover:text-white hover:border-white/25"}`}>{item.title}</Link>)}</nav><article className="markdown-body max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} /></main></>;
}
