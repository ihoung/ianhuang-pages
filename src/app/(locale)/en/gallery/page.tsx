import GalleryPageClient from "@/components/GalleryPageClient";
import { getAllProjects } from "@/lib/projects";
export default function GalleryPage() { return <GalleryPageClient locale="en" projects={getAllProjects("en")} />; }
