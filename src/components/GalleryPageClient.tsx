"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { asset } from "@/lib/asset";
import type { Locale, Project } from "@/lib/projects";

function SearchIcon({ className = "" }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}

type Props = { locale: Locale; projects: Project[] };
export default function GalleryPageClient({ locale, projects }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => { const term = query.trim().toLocaleLowerCase(); return term ? projects.filter((project) => [project.title, project.description, ...project.tags].some((value) => value.toLocaleLowerCase().includes(term))) : projects; }, [projects, query]);
  const copy = locale === "cn" ? { count: "作品", heading: "项目与博客", placeholder: "搜索项目...", empty: "没有找到项目", open: "打开 →" } : { count: "Works", heading: "Projects & Blogs", placeholder: "Search projects...", empty: "No projects found", open: "Open →" };
  return <><TopNav active="/gallery" /><main className="site-container py-14 md:py-20"><header className="mb-12 md:mb-16"><span className="pill-tag mb-5">{copy.count} · {filtered.length}</span><div className="flex items-center justify-between gap-4"><h1 className="display-heading">{copy.heading}</h1><div className="group/search flex items-center justify-end shrink-0"><div className="overflow-hidden transition-[width] duration-300 ease-out w-0 group-hover/search:w-56 group-focus-within/search:w-56"><input type="text" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.placeholder} className="w-full bg-transparent border-b border-white/15 text-sm text-white placeholder-white/30 outline-none py-1.5 pr-1 focus:border-white/40 transition-colors" aria-label={copy.placeholder} /></div><button type="button" className="shrink-0 w-10 h-10 ml-2 rounded-full border border-white/14 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all" aria-label="Toggle search" tabIndex={-1}><SearchIcon /></button></div></div></header>{filtered.length ? <div className="flex flex-col gap-6 md:gap-8">{filtered.map((project) => <Link key={project.slug} href={`/${locale}/content/${project.slug}`} className="project-card group flex flex-col sm:flex-row" aria-label={`View ${project.title}`}><div className="project-card-media relative aspect-[4/3] sm:h-auto sm:w-2/5 sm:shrink-0 overflow-hidden"><Image src={asset(`/content/${project.thumbnail}`)} alt="" fill unoptimized sizes="(max-width: 640px) 100vw, 40vw" className="object-contain transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(168, 85, 247, 0.18) 50%, rgba(236, 72, 153, 0.2) 100%)" }} aria-hidden /></div><div className="flex-1 px-5 md:px-6 py-5 md:py-6"><h3 className="font-sans font-semibold tracking-tight text-lg md:text-xl">{project.title}</h3><p className="mt-2 text-sm leading-relaxed text-white/60">{project.description}</p><span className="mt-4 inline-block font-mono text-[10px] tracking-widest uppercase text-white/60 group-hover:text-white/90 transition-colors">{copy.open}</span></div></Link>)}</div> : <div className="py-20 text-center text-white/40"><p className="text-lg">{copy.empty} “{query}”</p></div>}</main></>;
}
