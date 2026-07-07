export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  year: number;
  featured?: boolean;
  description: string;
  content: string;
};

const projects: Project[] = [
  {
    slug: "neon-dashboard",
    title: "Neon Dashboard",
    subtitle: "Data visualization platform",
    tags: ["Web App", "Data Viz"],
    year: 2025,
    featured: true,
    description:
      "A real-time analytics dashboard for creative studios, built with Next.js and D3.",
    content: "neon-dashboard.md",
  },
  {
    slug: "aurora-app",
    title: "Aurora App",
    subtitle: "Creative portfolio",
    tags: ["Product", "Mobile"],
    year: 2024,
    featured: true,
    description:
      "An interactive portfolio app with immersive transitions and gesture-based navigation.",
    content: "aurora-app.md",
  },
  {
    slug: "cyberpunk-portfolio",
    title: "Cyberpunk Portfolio",
    subtitle: "Neo-motion aesthetics",
    tags: ["Web", "Motion"],
    year: 2024,
    description:
      "A kinetic portfolio site exploring neon typography and glitch-driven interactions.",
    content: "cyberpunk-portfolio.md",
  },
  {
    slug: "monolith-brand",
    title: "Monolith Brand",
    subtitle: "Identity system",
    tags: ["Branding", "Identity"],
    year: 2024,
    description:
      "A minimal identity system for an architecture studio — type-driven and typographically pure.",
    content: "monolith-brand.md",
  },
  {
    slug: "finvault-app",
    title: "FinVault App",
    subtitle: "Mobile experience",
    tags: ["Product", "Mobile"],
    year: 2023,
    description:
      "A personal finance mobile app focused on clarity, calm, and decision clarity.",
    content: "finvault-app.md",
  },
  {
    slug: "data-nexus",
    title: "Data Nexus",
    subtitle: "Analytics platform",
    tags: ["Web App", "Data Viz"],
    year: 2023,
    description:
      "A collaborative analytics workspace for cross-functional product teams.",
    content: "data-nexus.md",
  },
];

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function getFeaturedProjects(limit = 2): Project[] {
  return getAllProjects()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
