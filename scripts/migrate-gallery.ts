import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

type ManifestItem = {
  originalSourcePath: string;
  fileType: string;
  fileSize: number;
  imageDimensions?: { width: number; height: number };
  videoDuration?: null;
  checksum: string;
  proposedAlbum: string;
  proposedMediaType: "image" | "video" | "document" | "unsupported";
  proposedTitle: string;
  proposedAltText?: string;
  proposedCaption?: string;
  decision: "include" | "exclude" | "defer";
  exclusionReason?: string;
  migrationStatus: "dry-run" | "deferred" | "excluded" | "pending" | "uploaded";
  sanityAssetId?: string;
  sanityMediaDocumentId?: string;
};

const rootDir = path.resolve(__dirname, "..", "..");
const sourceRoots = [path.join(rootDir, "content"), path.join(rootDir, "selected_content")];
const manifestPath = path.resolve(__dirname, "..", "docs", "gallery-import-manifest.json");
const reportPath = path.resolve(__dirname, "..", "docs", "GALLERY_IMPORT_REPORT.md");
const maxMediaFiles = 500;
const maxTotalBytes = 5 * 1024 * 1024 * 1024;
const maxVideoBytes = 100 * 1024 * 1024;
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const videoExtensions = new Set([".mov", ".mp4", ".webm"]);
const documentExtensions = new Set([".pdf", ".pptx", ".docx", ".xlsx"]);
const unsupportedExtensions = new Set([".tmp", ".aac"]);

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function albumForFile(filePath: string): string {
  const normalized = filePath.toLowerCase();
  if (normalized.includes("sports")) return "Sports Day";
  if (normalized.includes("water")) return "School Water Project";
  if (normalized.includes("master-plan") || normalized.includes("master plan")) return "Master Plan";
  if (normalized.includes("academics") || normalized.includes("classroom")) return "Academics";
  if (normalized.includes("campus") || normalized.includes("structure") || normalized.includes("stracture") || normalized.includes("project")) return "Campus";
  if (normalized.includes("christmas") || normalized.includes("xmass") || normalized.includes("events") || normalized.includes("party")) return "School Events";
  if (normalized.includes("leadership") || normalized.includes("headteacher")) return "Leadership";
  if (normalized.includes("students") || normalized.includes("gallery")) return "Student Life";
  return "Unresolved Content";
}

function mediaTypeForExtension(extension: string): ManifestItem["proposedMediaType"] {
  if (imageExtensions.has(extension)) return "image";
  if (videoExtensions.has(extension)) return "video";
  if (documentExtensions.has(extension)) return "document";
  return "unsupported";
}

async function listFiles(directory: string): Promise<string[]> {
  if (!existsSync(directory)) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : Promise.resolve([entryPath]);
    }),
  );
  return nested.flat();
}

function checksumFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    createReadStream(filePath)
      .on("data", (chunk) => hash.update(chunk))
      .on("error", reject)
      .on("end", () => resolve(hash.digest("hex")));
  });
}

async function imageDimensions(filePath: string) {
  try {
    const metadata = await sharp(filePath).metadata();
    if (metadata.width && metadata.height) return { width: metadata.width, height: metadata.height };
    return undefined;
  } catch {
    return undefined;
  }
}

function decide(filePath: string, checksum: string, seen: Set<string>, mediaType: ManifestItem["proposedMediaType"], size: number, dimensions?: { width: number; height: number }) {
  const lower = filePath.toLowerCase();
  if (seen.has(checksum)) return { decision: "exclude" as const, reason: "Exact duplicate checksum." };
  if (unsupportedExtensions.has(path.extname(lower))) return { decision: "exclude" as const, reason: "Unsupported temporary or audio file." };
  if (lower.includes("screenshot")) return { decision: "exclude" as const, reason: "Screenshot is not gallery photography." };
  if (mediaType === "document") return { decision: "exclude" as const, reason: "Document belongs in Downloads or archive review, not gallery media." };
  if (mediaType === "unsupported") return { decision: "exclude" as const, reason: "Unsupported gallery file type." };
  if (mediaType === "video" && size > maxVideoBytes) return { decision: "defer" as const, reason: "Video exceeds 100 MB and needs hosting approval." };
  if (dimensions && (dimensions.width < 480 || dimensions.height < 320)) return { decision: "exclude" as const, reason: "Image is too small for public gallery use." };
  if (albumForFile(filePath) === "Unresolved Content") return { decision: "defer" as const, reason: "Album meaning needs school confirmation." };
  return { decision: "include" as const, reason: undefined };
}

async function buildManifest() {
  const files = (await Promise.all(sourceRoots.map(listFiles))).flat().sort();
  const seen = new Set<string>();
  const items: ManifestItem[] = [];

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    const mediaType = mediaTypeForExtension(extension);
    const fileSize = statSync(filePath).size;
    const checksum = await checksumFile(filePath);
    const dimensions = mediaType === "image" ? await imageDimensions(filePath) : undefined;
    const decision = decide(filePath, checksum, seen, mediaType, fileSize, dimensions);
    if (decision.decision === "include") seen.add(checksum);

    const basename = path.basename(filePath, extension);
    const proposedAlbum = albumForFile(filePath);
    const proposedTitle = titleCase(basename);

    items.push({
      originalSourcePath: filePath,
      fileType: extension.replace(".", "").toUpperCase() || "UNKNOWN",
      fileSize,
      imageDimensions: dimensions,
      videoDuration: mediaType === "video" ? null : undefined,
      checksum,
      proposedAlbum,
      proposedMediaType: mediaType,
      proposedTitle,
      proposedAltText: mediaType === "image" && proposedAlbum !== "Unresolved Content" ? `${proposedAlbum} photograph at Rubaare Secondary School.` : undefined,
      proposedCaption: undefined,
      decision: decision.decision,
      exclusionReason: decision.reason,
      migrationStatus: decision.decision === "include" ? "dry-run" : decision.decision === "defer" ? "deferred" : "excluded",
    });
  }

  return items;
}

function writeReport(items: ManifestItem[], mode: string) {
  const totalBytes = items.reduce((sum, item) => sum + item.fileSize, 0);
  const mediaItems = items.filter((item) => item.proposedMediaType === "image" || item.proposedMediaType === "video");
  const largeVideos = items.filter((item) => item.proposedMediaType === "video" && item.fileSize > maxVideoBytes);
  const included = items.filter((item) => item.decision === "include");
  const excluded = items.filter((item) => item.decision === "exclude");
  const deferred = items.filter((item) => item.decision === "defer");
  const thresholdStop = mediaItems.length > maxMediaFiles || totalBytes > maxTotalBytes || largeVideos.length > 0;

  const lines = [
    "# Gallery Import Report",
    "",
    `Mode: ${mode}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    `Total files scanned: ${items.length}`,
    `Total bytes scanned: ${totalBytes}`,
    `Media files scanned: ${mediaItems.length}`,
    `Included candidates: ${included.length}`,
    `Deferred files: ${deferred.length}`,
    `Excluded files: ${excluded.length}`,
    `Large videos over 100 MB: ${largeVideos.length}`,
    `Safety threshold stop: ${thresholdStop ? "yes" : "no"}`,
    "",
    "## Large Videos Deferred",
    "",
    ...largeVideos.map((item) => `- ${item.originalSourcePath} (${item.fileSize} bytes)`),
    ...(largeVideos.length ? [] : ["None."]),
    "",
    "## Next Step",
    "",
    thresholdStop
      ? "Real upload is blocked until the gallery hosting/import scope is approved because the source exceeds the configured safety thresholds."
      : "The selected import is below the safety thresholds and may be migrated with authenticated Sanity access.",
  ];

  writeFileSync(reportPath, `${lines.join("\n")}\n`);
}

async function main() {
  const mode = process.argv.includes("--migrate") ? "migrate" : "dry-run";
  const items = await buildManifest();
  mkdirSync(path.dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify(items, null, 2)}\n`);
  writeReport(items, mode);

  if (mode === "migrate") {
    throw new Error("Real gallery upload is intentionally blocked until the dry-run report is approved.");
  }

  console.log(`Gallery dry run complete: ${items.length} files scanned.`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Report: ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
