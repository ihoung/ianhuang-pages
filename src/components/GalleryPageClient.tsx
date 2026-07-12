"use client";

import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import ProjectCard from "@/components/ProjectCard";
import type { Locale, Project } from "@/lib/projects";

type Props = { locale: Locale; projects: Project[] };
export default function GalleryPageClient({ locale, projects }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => { const term = query.trim().toLocaleLowerCase(); return term ? projects.filter((project) => [project.title, project.description, ...project.tags].some((value) => value.toLocaleLowerCase().includes(term))) : projects; }, [projects, query]);
  const copy = locale === "cn" ? { count: "作品", heading: "项目与博客", placeholder: "搜索项目...", empty: "没有找到项目" } : { count: "Works", heading: "Projects & Blogs", placeholder: "Search projects...", empty: "No projects found" };
  return <><TopNav active="/gallery" /><main className="site-container py-14 md:py-20"><header className="mb-12 md:mb-16"><span className="pill-tag mb-5">{copy.count} · {filtered.length}</span><div className="flex items-center justify-between gap-4"><h1 className="display-heading">{copy.heading}</h1><label className="w-48 sm:w-56"><span className="sr-only">{copy.placeholder}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.placeholder} className="w-full bg-transparent border-b border-white/15 text-sm text-white placeholder-white/30 outline-none py-2 focus:border-white/40 transition-colors" /></label></div></header>{filtered.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">{filtered.map((project) => <ProjectCard key={project.slug} title={project.title} description={project.description} thumbnail={project.thumbnail} href={`/${locale}/content/${project.slug}`} locale={locale} />)}</div> : <div className="py-20 text-center text-white/40"><p className="text-lg">{copy.empty} “{query}”</p></div>}</main></>;
}
