import { loadAndValidateProjects, preparePublicThumbnails } from "./content-utils.mjs";
const projects = loadAndValidateProjects();
preparePublicThumbnails(projects);
console.log(`Prepared ${projects.length} project thumbnail(s) in public/content.`);
