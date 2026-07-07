import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/lib/projects";

export default function ProjectsPreview() {
  const featured = getFeaturedProjects(2);

  return (
    <section
      id="projects"
      className="site-container min-h-screen flex flex-col justify-center py-20 md:py-28 snap-start snap-always"
      aria-label="Featured Projects"
    >
      <h2 className="section-heading mb-10 md:mb-14">Featured Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
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
    </section>
  );
}
