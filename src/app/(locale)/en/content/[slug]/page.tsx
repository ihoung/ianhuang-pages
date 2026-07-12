import ProjectDetailPage from "@/components/ProjectDetailPage";
import { getAllProjects } from "@/lib/projects";
export function generateStaticParams() { return getAllProjects("en").map((project) => ({ slug: project.slug })); }
export default function ContentDetailPage({ params }: { params: { slug: string } }) { return <ProjectDetailPage locale="en" slug={params.slug} />; }
