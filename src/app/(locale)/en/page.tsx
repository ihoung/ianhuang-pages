import RevealSection from "@/components/RevealSection";
import HeroSection from "@/components/HeroSection";
import ProjectsPreview from "@/components/ProjectsPreview";
import ContactSection from "@/components/ContactSection";
import SideNav from "@/components/SideNav";
import { LangToggle } from "@/components/TopNav";
import { getFeaturedProjects } from "@/lib/projects";

export default function HomePage() {
  return <><SideNav /><div className="fixed top-6 right-6 z-50"><LangToggle /></div><main className="relative z-10"><HeroSection /><RevealSection><ProjectsPreview locale="en" projects={getFeaturedProjects("en")} /></RevealSection><RevealSection><ContactSection /></RevealSection></main></>;
}
