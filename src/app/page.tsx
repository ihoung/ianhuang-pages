import RevealSection from "@/components/RevealSection";
import HeroSection from "@/components/HeroSection";
import ProjectsPreview from "@/components/ProjectsPreview";
import ContactSection from "@/components/ContactSection";
import SideNav from "@/components/SideNav";
import { LangToggle } from "@/components/TopNav";

export default function Home() {
  return (
    <>
      {/* Static background */}
      <div aria-hidden className="fixed inset-0 z-0 homepage-bg" />

      <SideNav />

      <div className="fixed top-6 right-6 z-50">
        <LangToggle />
      </div>

      <main className="relative z-10">
        <HeroSection />
        <RevealSection>
          <ProjectsPreview />
        </RevealSection>
        <RevealSection>
          <ContactSection />
        </RevealSection>
      </main>
    </>
  );
}
