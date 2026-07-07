import TopNav from "@/components/TopNav";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/projects";

export default function GalleryPage() {
  const projects = getAllProjects();

  return (
    <>
      <TopNav active="/gallery" />
      <main className="site-container py-14 md:py-20">
        <header className="mb-12 md:mb-16">
          <span className="pill-tag mb-5">Portfolio · {projects.length} works</span>
          <h1 className="display-heading">All Projects</h1>
          <p className="mt-5 max-w-xl text-white/60 text-base md:text-lg">
            A curated collection of recent design &amp; engineering work.
            Hover a card to peek into each project.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              subtitle={project.subtitle}
              href={`/content`}
              aspect="aspect-[4/3]"
            />
          ))}
        </div>
      </main>

      <footer className="site-container py-10 text-[11px] font-mono uppercase tracking-widest text-white/40 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Ian Huang</span>
        <span>All projects</span>
      </footer>
    </>
  );
}
