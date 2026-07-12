import ProjectDetailPage from "@/components/ProjectDetailPage";
import { getFirstProject } from "@/lib/projects";
export default function ContentPage() { return <ProjectDetailPage locale="en" slug={getFirstProject("en").slug} />; }
