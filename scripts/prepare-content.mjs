import { loadAndValidateProjects, preparePublicThumbnails, preparePublicVideos } from "./content-utils.mjs";
const projects = loadAndValidateProjects();
preparePublicThumbnails(projects);
preparePublicVideos(projects);
console.log(`Prepared ${projects.length} project thumbnail(s) in public/content.`);
