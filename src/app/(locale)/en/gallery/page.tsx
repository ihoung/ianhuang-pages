"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import { getAllProjects, type Project } from "@/lib/projects";

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ProjectListItem({ project }: { project: Project }) {
  return (
    <Link
      href={`/content`}
      className="project-card group flex flex-col sm:flex-row items-stretch"
      aria-label={`View ${project.title}`}
    >
      <div className="project-card-media aspect-[4/3] sm:h-full sm:w-auto relative shrink-0">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(168, 85, 247, 0.18) 50%, rgba(236, 72, 153, 0.2) 100%)",
          }}
          aria-hidden
        />
      </div>
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
        <h3 className="font-sans font-semibold tracking-tight text-xl md:text-2xl">
          {project.title}
        </h3>
        <p className="mt-3 text-white/60 text-sm md:text-base leading-relaxed">
          {project.description}
        </p>
      </div>
    </Link>
  );
}

export default function GalleryPage() {
  const allProjects = useMemo(() => getAllProjects(), []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProjects;
    return allProjects.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [allProjects, query]);

  return (
    <>
      <TopNav active="/gallery" />
      <main className="site-container py-14 md:py-20">
        <header className="mb-12 md:mb-16">
          <div className="flex items-center justify-between gap-4">
            <span className="pill-tag mb-5">
              Portfolio · {filtered.length} works
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="display-heading">Projects &amp; Blogs</h1>
            <div className="group/search flex items-center justify-end shrink-0">
              <div className="overflow-hidden transition-[width] duration-300 ease-out w-0 group-hover/search:w-56 group-focus-within/search:w-56">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full bg-transparent border-b border-white/15 text-sm text-white placeholder-white/30 outline-none py-1.5 pr-1 focus:border-white/40 transition-colors bg-black/0"
                  aria-label="Search projects"
                />
              </div>
              <button
                type="button"
                className="shrink-0 w-10 h-10 ml-2 rounded-full border border-white/14 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                aria-label="Toggle search"
                tabIndex={-1}
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </header>

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-6 md:gap-8">
            {filtered.map((project) => (
              <ProjectListItem key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-white/40">
            <p className="text-lg">No projects found for &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </main>

      <footer className="site-container py-10 text-[11px] font-mono uppercase tracking-widest text-white/40 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Ian Huang</span>
        <span>Projects &amp; Blogs</span>
      </footer>
    </>
  );
}
