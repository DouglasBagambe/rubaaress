import type { ResolvedGalleryAlbum, ResolvedGalleryMedia } from "@/sanity/types";

export type GalleryTypeFilter = "all" | "photos" | "videos";

export type GalleryFilters = {
  category?: string;
  academicYear?: string;
  type?: GalleryTypeFilter;
  search?: string;
};

export function validateExternalVideoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    return host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com" || host === "vimeo.com" || host.endsWith(".vimeo.com");
  } catch {
    return false;
  }
}

export function mediaMatchesType(media: ResolvedGalleryMedia, type: GalleryTypeFilter): boolean {
  if (type === "all") return true;
  if (type === "photos") return media.mediaType === "image";
  return media.mediaType === "video";
}

export function sortGalleryMedia(media: ReadonlyArray<ResolvedGalleryMedia>): ReadonlyArray<ResolvedGalleryMedia> {
  return [...media].sort((first, second) => {
    const orderDelta = first.displayOrder - second.displayOrder;
    if (orderDelta !== 0) return orderDelta;
    const firstDate = first.captureDate ?? "";
    const secondDate = second.captureDate ?? "";
    if (firstDate !== secondDate) return firstDate.localeCompare(secondDate);
    return first.id.localeCompare(second.id);
  });
}

export function countMedia(media: ReadonlyArray<ResolvedGalleryMedia>) {
  const photoCount = media.filter((item) => item.mediaType === "image").length;
  const videoCount = media.filter((item) => item.mediaType === "video").length;
  return { photoCount, videoCount, mediaCount: photoCount + videoCount };
}

export function filterGalleryAlbums(albums: ReadonlyArray<ResolvedGalleryAlbum>, filters: GalleryFilters): ReadonlyArray<ResolvedGalleryAlbum> {
  const category = filters.category?.trim().toLowerCase();
  const academicYear = filters.academicYear?.trim().toLowerCase();
  const search = filters.search?.trim().toLowerCase();
  const type = filters.type ?? "all";

  return albums.filter((album) => {
    if (album.visibility !== "public" || !album.published) return false;
    if (category && album.category.toLowerCase() !== category) return false;
    if (academicYear && album.academicYear?.toLowerCase() !== academicYear) return false;
    if (search && !album.title.toLowerCase().includes(search)) return false;
    if (type === "photos" && album.photoCount === 0) return false;
    if (type === "videos" && album.videoCount === 0) return false;
    return true;
  });
}

export function paginateGalleryMedia(media: ReadonlyArray<ResolvedGalleryMedia>, cursor: string | undefined, limit: number) {
  const ordered = sortGalleryMedia(media);
  const startIndex = cursor ? ordered.findIndex((item) => item.id === cursor) + 1 : 0;
  const safeStartIndex = startIndex > 0 ? startIndex : 0;
  const items = ordered.slice(safeStartIndex, safeStartIndex + limit);
  const finalItem = items.at(-1);
  const hasMore = safeStartIndex + limit < ordered.length;
  return { items, nextCursor: hasMore ? finalItem?.id : undefined };
}
