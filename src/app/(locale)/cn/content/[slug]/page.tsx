import ProjectDetailPage from "@/components/ProjectDetailPage";
import { getAllProjects } from "@/lib/projects";
export function generateStaticParams() { return getAllProjects("cn").map((project) => ({ slug: project.slug })); }
export default function ContentDetailPage({ params }: { params: { slug: string } }) { return <ProjectDetailPage locale="cn" slug={params.slug} />; }
