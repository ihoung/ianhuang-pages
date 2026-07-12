import { createWriteStream } from "node:fs";
import { mkdir, rename, rm } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { pipeline } from "node:stream/promises";
import { google } from "googleapis";

const folderId = process.env.GOOGLE_DRIVE_CONTENT_FOLDER_ID;
const credentialsJson = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON;
if (!folderId || !credentialsJson) throw new Error("GOOGLE_DRIVE_CONTENT_FOLDER_ID and GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON are required.");
let credentials;
try { credentials = JSON.parse(credentialsJson); } catch { throw new Error("GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON must contain valid service-account JSON."); }
const auth = new google.auth.GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/drive.readonly"] });
const drive = google.drive({ version: "v3", auth });
const contentRoot = resolve(process.cwd(), "content");
const stagingRoot = resolve(process.cwd(), `.content-download-${Date.now()}`);
function safeName(name) {
  if (!name || name === "." || name === ".." || /[\\/]/.test(name)) throw new Error(`Unsafe Google Drive filename: ${name}`);
  return name;
}
async function downloadFolder(id, target) {
  await mkdir(target, { recursive: true });
  let pageToken;
  do {
    const response = await drive.files.list({ q: `'${id}' in parents and trashed = false`, spaces: "drive", fields: "nextPageToken,files(id,name,mimeType)", pageToken });
    for (const file of response.data.files ?? []) {
      if (!file.id || !file.name || !file.mimeType) throw new Error("Google Drive returned a file without id, name, or mimeType.");
      const destination = resolve(target, safeName(file.name));
      if (!destination.startsWith(`${target}${sep}`)) throw new Error(`Unsafe Google Drive destination: ${file.name}`);
      if (file.mimeType === "application/vnd.google-apps.folder") await downloadFolder(file.id, destination);
      else {
        if (file.mimeType.startsWith("application/vnd.google-apps.")) throw new Error(`Google Workspace file ${file.name} cannot be downloaded as a regular content asset.`);
        const media = await drive.files.get({ fileId: file.id, alt: "media" }, { responseType: "stream" });
        await pipeline(media.data, createWriteStream(destination));
      }
    }
    pageToken = response.data.nextPageToken ?? undefined;
  } while (pageToken);
}
try {
  await downloadFolder(folderId, stagingRoot);
  await rm(contentRoot, { recursive: true, force: true });
  await rename(stagingRoot, contentRoot);
  console.log("Downloaded Google Drive content to content/.");
} catch (error) {
  await rm(stagingRoot, { recursive: true, force: true });
  throw error;
}
