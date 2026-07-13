import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import type { Locale, Project } from "@/lib/projects";

type Props = { locale: Locale; projects: Project[] };
export default function ProjectsPreview({ locale, projects }: Props) {
  const heading = locale === "cn" ? "项目预览" : "Featured Projects";
  const viewAllText = locale === "cn" ? "查看全部" : "View All";
  return <section id="projects" className="site-container min-h-screen flex flex-col justify-center py-20 md:py-28 snap-start snap-always" aria-label="Featured Projects">
    <h2 className="section-heading mb-10 md:mb-14">{heading}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl">{projects.map((project) => <ProjectCard key={project.slug} title={project.title} description={project.description} thumbnail={project.thumbnail} href={`/${locale}/content/${project.slug}`} locale={locale} aspect="aspect-[16/10]" />)}</div>
    <div className="mt-10 md:mt-12 flex justify-center"><Link href={`/${locale}/gallery`} className="btn btn-outline" aria-label="View all projects">{viewAllText}<span aria-hidden>→</span></Link></div>
  </section>;
}
