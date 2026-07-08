import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/lib/projects";

export default function ProjectsPreview() {
  const featured = getFeaturedProjects(3);
  const lgColClass =
    featured.length >= 3
      ? "lg:grid-cols-3"
      : featured.length === 2
        ? "lg:grid-cols-2"
        : "lg:grid-cols-1";

  return (
    <section
      id="projects"
      className="site-container min-h-screen flex flex-col justify-center py-20 md:py-28 snap-start snap-always"
      aria-label="Featured Projects"
    >
      <h2 className="section-heading mb-10 md:mb-14">Featured Projects</h2>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${lgColClass} gap-6 md:gap-8 max-w-3xl`}
      >
        {featured.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            subtitle={project.subtitle}
            href={`/gallery`}
            aspect="aspect-[16/10]"
          />
        ))}
      </div>

      <div className="mt-10 md:mt-12 flex justify-center">
        <Link
          href="/gallery"
          className="btn btn-outline"
          aria-label="View all projects"
        >
          View All
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
