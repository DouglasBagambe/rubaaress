import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getCliClient } from "sanity/cli";

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
const selectedOnly = process.argv.includes("--selected-only");
const sourceRoots = selectedOnly ? [path.join(rootDir, "selected_content")] : [path.join(rootDir, "content"), path.join(rootDir, "selected_content")];
const manifestPath = path.resolve(__dirname, "..", "docs", selectedOnly ? "gallery-curated-import-manifest.json" : "gallery-import-manifest.json");
const reportPath = path.resolve(__dirname, "..", "docs", selectedOnly ? "GALLERY_CURATED_IMPORT_REPORT.md" : "GALLERY_IMPORT_REPORT.md");
const maxMediaFiles = 500;
const maxTotalBytes = 5 * 1024 * 1024 * 1024;
const maxVideoBytes = 100 * 1024 * 1024;
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const videoExtensions = new Set([".mov", ".mp4", ".webm"]);
const documentExtensions = new Set([".pdf", ".pptx", ".docx", ".xlsx"]);
const unsupportedExtensions = new Set([".tmp", ".aac"]);
const approvedAlbumOrder = [
  "Academics",
  "Campus",
  "Leadership",
  "Master Plan",
  "School Events",
  "School Water Project",
  "Sports Day",
  "Student Life",
];

type SanityAsset = {
  _id: string;
};

type MigrationSummary = {
  albumsCreated: string[];
  albumsSkipped: string[];
  mediaCreated: string[];
  mediaSkipped: string[];
  imagesUploaded: number;
  videosUploaded: number;
  failedUploads: string[];
  duplicateFilesSkipped: string[];
  coverSelections: Record<string, string>;
  publishedDocumentIds: string[];
};

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function readEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

function albumForFile(filePath: string): string {
  const normalized = filePath.toLowerCase();
  if (normalized.includes("/selected_content/brand/")) return "Brand Asset";
  if (normalized.includes("/selected_content/campus/")) return "Campus";
  if (normalized.includes("/selected_content/water-project/")) return "School Water Project";
  if (normalized.includes("/selected_content/master-plan/")) return "Master Plan";
  if (normalized.includes("/selected_content/sports/")) return "Sports Day";
  if (normalized.includes("/selected_content/events/")) return "School Events";
  if (normalized.includes("/selected_content/leadership/")) return "Leadership";
  if (normalized.includes("/selected_content/academics/")) return "Academics";
  if (normalized.includes("/selected_content/students/") || normalized.includes("/selected_content/gallery/")) return "Student Life";
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
  if (albumForFile(filePath) === "Brand Asset") return { decision: "exclude" as const, reason: "Brand assets are not gallery photographs." };
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
  const uploadCandidates = items.filter((item) => item.decision === "include");
  const uploadBytes = uploadCandidates.reduce((sum, item) => sum + item.fileSize, 0);
  const largeVideos = items.filter((item) => item.proposedMediaType === "video" && item.fileSize > maxVideoBytes);
  const included = items.filter((item) => item.decision === "include");
  const excluded = items.filter((item) => item.decision === "exclude");
  const deferred = items.filter((item) => item.decision === "defer");
  const thresholdStop = mediaItems.length > maxMediaFiles || totalBytes > maxTotalBytes || largeVideos.length > 0;
  const albumNames = [...new Set(items.map((item) => item.proposedAlbum))].sort();
  const albumRows = albumNames.map((album) => {
    const albumItems = items.filter((item) => item.proposedAlbum === album && item.decision === "include");
    const imageCount = albumItems.filter((item) => item.proposedMediaType === "image").length;
    const videoCount = albumItems.filter((item) => item.proposedMediaType === "video").length;
    const albumBytes = albumItems.reduce((sum, item) => sum + item.fileSize, 0);
    return `| ${album} | ${imageCount} | ${videoCount} | ${albumBytes} |`;
  });

  const lines = [
    "# Gallery Import Report",
    "",
    `Mode: ${mode}`,
    `Source scope: ${selectedOnly ? "selected_content only" : "content and selected_content"}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    `Total files scanned: ${items.length}`,
    `Total bytes scanned: ${totalBytes}`,
    `Total upload candidate size: ${uploadBytes}`,
    `Media files scanned: ${mediaItems.length}`,
    `Included candidates: ${included.length}`,
    `Deferred files: ${deferred.length}`,
    `Excluded files: ${excluded.length}`,
    `Large videos over 100 MB: ${largeVideos.length}`,
    `Safety threshold stop: ${thresholdStop ? "yes" : "no"}`,
    "",
    "## Proposed Albums",
    "",
    "| Album | Images | Videos | Upload candidate bytes |",
    "| --- | ---: | ---: | ---: |",
    ...albumRows,
    "",
    "## Excluded Files",
    "",
    ...excluded.map((item) => `- ${item.originalSourcePath}: ${item.exclusionReason ?? "Excluded."}`),
    ...(excluded.length ? [] : ["None."]),
    "",
    "## Content Requiring Confirmation",
    "",
    ...deferred.map((item) => `- ${item.originalSourcePath}: ${item.exclusionReason ?? "Needs confirmation."}`),
    ...(deferred.length ? [] : ["None."]),
    "",
    "## Large Videos Deferred",
    "",
    ...largeVideos.map((item) => `- ${item.originalSourcePath} (${item.fileSize} bytes)`),
    ...(largeVideos.length ? [] : ["None."]),
    "",
    "## Next Step",
    "",
    mode === "migrate"
      ? "The curated gallery migration has been executed. Review the manifest for Sanity asset and document IDs."
      : thresholdStop
        ? "Real upload is blocked until the gallery hosting/import scope is approved because the source exceeds the configured safety thresholds."
        : "The selected import is below the safety thresholds and may be migrated with authenticated Sanity access.",
  ];

  writeFileSync(reportPath, `${lines.join("\n")}\n`);
}

function albumDescription(album: string): string {
  if (album === "Master Plan") return "Approved master-plan images supplied for detailed viewing.";
  return "Approved school media from the curated content selection.";
}

function makeImageField(assetId: string, alt: string) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt,
  };
}

function makeFileField(assetId: string) {
  return {
    _type: "file",
    asset: { _type: "reference", _ref: assetId },
  };
}

async function uploadWithRetry(client: ReturnType<typeof getCliClient>, item: ManifestItem, assetType: "image" | "file") {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await client.assets.upload(assetType, createReadStream(item.originalSourcePath), {
        filename: path.basename(item.originalSourcePath),
        label: item.proposedTitle,
      }) as SanityAsset;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw lastError;
}

async function runRealMigration(items: ManifestItem[]) {
  if (!selectedOnly) throw new Error("Real curated migration requires --selected-only.");

  readEnvFile(path.resolve(__dirname, "..", ".env.local"));
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-01";

  if (projectId !== "9x78oq9t") throw new Error(`Unexpected Sanity project ID: ${projectId ?? "missing"}`);
  if (dataset !== "production") throw new Error(`Unexpected Sanity dataset: ${dataset}`);

  const included = items.filter((item) => item.decision === "include");
  const invalidSource = included.find((item) => !item.originalSourcePath.startsWith(path.join(rootDir, "selected_content")));
  if (invalidSource) throw new Error(`Manifest contains a non-selected_content file: ${invalidSource.originalSourcePath}`);

  const client = getCliClient({ apiVersion }).withConfig({ projectId, dataset, useCdn: false });
  const summary: MigrationSummary = {
    albumsCreated: [],
    albumsSkipped: [],
    mediaCreated: [],
    mediaSkipped: [],
    imagesUploaded: 0,
    videosUploaded: 0,
    failedUploads: [],
    duplicateFilesSkipped: [],
    coverSelections: {},
    publishedDocumentIds: [],
  };
  const seenChecksums = new Set<string>();
  const albums = approvedAlbumOrder.filter((album) => included.some((item) => item.proposedAlbum === album));

  for (const album of albums) {
    const albumId = `galleryAlbum-${slugify(album)}`;
    const existing = await client.getDocument(albumId);
    const document = {
      _id: albumId,
      _type: "galleryAlbum",
      title: album,
      slug: { _type: "slug", current: slugify(album) },
      shortDescription: albumDescription(album),
      category: album,
      featured: album === "Campus",
      published: true,
      visibility: "public",
      displayOrder: approvedAlbumOrder.indexOf(album),
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    if (existing) {
      await client.patch(albumId).set(document).commit();
      summary.albumsSkipped.push(albumId);
    } else {
      await client.create(document);
      summary.albumsCreated.push(albumId);
    }
    summary.publishedDocumentIds.push(albumId);
  }

  for (const item of included) {
    if (seenChecksums.has(item.checksum)) {
      item.migrationStatus = "excluded";
      item.exclusionReason = "Exact duplicate checksum already migrated.";
      summary.duplicateFilesSkipped.push(item.originalSourcePath);
      continue;
    }
    seenChecksums.add(item.checksum);

    const albumId = `galleryAlbum-${slugify(item.proposedAlbum)}`;
    const mediaId = `galleryMedia-${item.checksum.slice(0, 20)}`;
    const existingMedia = await client.getDocument(mediaId);
    if (existingMedia?.sanityAssetId || existingMedia?.image || existingMedia?.uploadedVideo) {
      item.sanityMediaDocumentId = mediaId;
      item.migrationStatus = "uploaded";
      summary.mediaSkipped.push(mediaId);
      continue;
    }

    try {
      const assetType = item.proposedMediaType === "image" ? "image" : "file";
      const asset = await uploadWithRetry(client, item, assetType);
      item.sanityAssetId = asset._id;
      item.sanityMediaDocumentId = mediaId;

      const baseDocument = {
        _id: mediaId,
        _type: "galleryMedia",
        internalTitle: item.proposedTitle,
        album: { _type: "reference", _ref: albumId },
        mediaType: item.proposedMediaType,
        caption: item.proposedCaption,
        displayOrder: included.filter((candidate) => candidate.proposedAlbum === item.proposedAlbum).findIndex((candidate) => candidate.checksum === item.checksum),
        featured: false,
        published: true,
        verificationStatus: "verified",
      };

      if (item.proposedMediaType === "image") {
        await client.createOrReplace({
          ...baseDocument,
          mediaType: "image",
          image: makeImageField(asset._id, item.proposedAltText ?? `${item.proposedAlbum} photograph at Rubaare Secondary School.`),
          imageAlt: item.proposedAltText ?? `${item.proposedAlbum} photograph at Rubaare Secondary School.`,
          orientation: item.imageDimensions
            ? item.imageDimensions.width > item.imageDimensions.height
              ? "landscape"
              : item.imageDimensions.width < item.imageDimensions.height
                ? "portrait"
                : "square"
            : undefined,
        });
        summary.imagesUploaded += 1;
      } else if (item.proposedMediaType === "video") {
        const poster = items.find((candidate) => candidate.proposedAlbum === item.proposedAlbum && candidate.proposedMediaType === "image" && candidate.sanityAssetId);
        await client.createOrReplace({
          ...baseDocument,
          mediaType: "video",
          videoSourceType: "uploaded file",
          uploadedVideo: makeFileField(asset._id),
          videoTitle: item.proposedTitle,
          videoPosterImage: poster?.sanityAssetId ? makeImageField(poster.sanityAssetId, poster.proposedAltText ?? "Sports Day photograph at Rubaare Secondary School.") : undefined,
        });
        summary.videosUploaded += 1;
      }

      item.migrationStatus = "uploaded";
      summary.mediaCreated.push(mediaId);
      summary.publishedDocumentIds.push(mediaId);
    } catch (error) {
      item.migrationStatus = "pending";
      summary.failedUploads.push(`${item.originalSourcePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  for (const album of albums) {
    const cover = included.find((item) => item.proposedAlbum === album && item.proposedMediaType === "image" && item.sanityMediaDocumentId);
    if (!cover?.sanityMediaDocumentId) continue;
    const albumId = `galleryAlbum-${slugify(album)}`;
    await client.patch(albumId).set({
      coverMedia: { _type: "reference", _ref: cover.sanityMediaDocumentId },
      mediaCount: included.filter((item) => item.proposedAlbum === album && item.migrationStatus === "uploaded").length,
      updatedDate: new Date().toISOString(),
    }).commit();
    summary.coverSelections[album] = cover.sanityMediaDocumentId;
  }

  writeFileSync(manifestPath, `${JSON.stringify(items, null, 2)}\n`);
  writeReport(items, "migrate");
  writeFileSync(path.resolve(__dirname, "..", "docs", "GALLERY_CURATED_MIGRATION_RESULT.json"), `${JSON.stringify(summary, null, 2)}\n`);

  if (summary.failedUploads.length) {
    throw new Error(`Migration completed with ${summary.failedUploads.length} failed uploads.`);
  }

  console.log(`Curated gallery migration complete: ${summary.imagesUploaded} images, ${summary.videosUploaded} videos.`);
  console.log(`Result: ${path.resolve(__dirname, "..", "docs", "GALLERY_CURATED_MIGRATION_RESULT.json")}`);
}

async function main() {
  const mode = process.argv.includes("--migrate") ? "migrate" : "dry-run";
  const items = mode === "migrate" && existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8")) as ManifestItem[]
    : await buildManifest();
  mkdirSync(path.dirname(manifestPath), { recursive: true });

  if (mode === "migrate") {
    await runRealMigration(items);
    return;
  }

  writeFileSync(manifestPath, `${JSON.stringify(items, null, 2)}\n`);
  writeReport(items, mode);

  console.log(`Gallery dry run complete: ${items.length} files scanned.`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Report: ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
