import { defineQuery } from "next-sanity";
import type { SanityImageResult } from "@/sanity/queries/siteSettings";

const IMAGE_PROJECTION = `{
  "url": asset->url,
  "alt": coalesce(alt, asset->altText),
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
}`;

export const GALLERY_ALBUMS_QUERY = defineQuery(`*[
  _type == "galleryAlbum" &&
  published == true &&
  visibility == "public"
] | order(coalesce(displayOrder, 9999) asc, coalesce(eventDate, "0000-00-00") desc, title asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  introduction,
  category,
  eventDate,
  academicYear,
  featured,
  published,
  visibility,
  displayOrder,
  seoTitle,
  seoDescription,
  "coverImage": coalesce(coverMedia->image, bannerImage) ${IMAGE_PROJECTION},
  "bannerImage": bannerImage ${IMAGE_PROJECTION},
  "photoCount": count(*[_type == "galleryMedia" && references(^._id) && published == true && mediaType == "image" && verificationStatus != "do not publish"]),
  "videoCount": count(*[_type == "galleryMedia" && references(^._id) && published == true && mediaType == "video" && verificationStatus != "do not publish"])
}`);

export const GALLERY_ALBUM_BY_SLUG_QUERY = defineQuery(`*[
  _type == "galleryAlbum" &&
  slug.current == $slug &&
  published == true &&
  visibility in ["public", "unlisted"]
][0] {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  introduction,
  category,
  eventDate,
  academicYear,
  featured,
  published,
  visibility,
  displayOrder,
  seoTitle,
  seoDescription,
  "coverImage": coalesce(coverMedia->image, bannerImage) ${IMAGE_PROJECTION},
  "bannerImage": bannerImage ${IMAGE_PROJECTION},
  "photoCount": count(*[_type == "galleryMedia" && references(^._id) && published == true && mediaType == "image" && verificationStatus != "do not publish"]),
  "videoCount": count(*[_type == "galleryMedia" && references(^._id) && published == true && mediaType == "video" && verificationStatus != "do not publish"])
}`);

export const GALLERY_MEDIA_QUERY = defineQuery(`*[
  _type == "galleryMedia" &&
  album._ref == $albumId &&
  published == true &&
  verificationStatus != "do not publish" &&
  ($type == "all" || mediaType == $type)
] | order(coalesce(displayOrder, 9999) asc, coalesce(captureDate, "9999-99-99") asc, _id asc) [$start...$end] {
  _id,
  internalTitle,
  "albumSlug": album->slug.current,
  mediaType,
  "image": image ${IMAGE_PROJECTION},
  imageAlt,
  videoSourceType,
  "uploadedVideoUrl": uploadedVideo.asset->url,
  externalVideoUrl,
  "videoPosterImage": videoPosterImage ${IMAGE_PROJECTION},
  videoTitle,
  transcript,
  caption,
  captureDate,
  displayOrder,
  featured,
  orientation
}`);

export const RELATED_GALLERY_ALBUMS_QUERY = defineQuery(`*[
  _type == "galleryAlbum" &&
  _id != $albumId &&
  published == true &&
  visibility == "public" &&
  category == $category
] | order(coalesce(displayOrder, 9999) asc, coalesce(eventDate, "0000-00-00") desc, title asc) [0...3] {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  introduction,
  category,
  eventDate,
  academicYear,
  featured,
  published,
  visibility,
  displayOrder,
  seoTitle,
  seoDescription,
  "coverImage": coalesce(coverMedia->image, bannerImage) ${IMAGE_PROJECTION},
  "bannerImage": bannerImage ${IMAGE_PROJECTION},
  "photoCount": count(*[_type == "galleryMedia" && references(^._id) && published == true && mediaType == "image" && verificationStatus != "do not publish"]),
  "videoCount": count(*[_type == "galleryMedia" && references(^._id) && published == true && mediaType == "video" && verificationStatus != "do not publish"])
}`);

export type GalleryAlbumQueryItem = {
  _id: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  introduction?: string;
  category?: string;
  eventDate?: string;
  academicYear?: string;
  coverImage?: SanityImageResult;
  bannerImage?: SanityImageResult;
  featured?: boolean;
  published?: boolean;
  visibility?: "public" | "unlisted" | "archived";
  displayOrder?: number;
  photoCount?: number;
  videoCount?: number;
  seoTitle?: string;
  seoDescription?: string;
};

export type GalleryMediaQueryItem = {
  _id: string;
  internalTitle?: string;
  albumSlug?: string;
  mediaType?: "image" | "video";
  image?: SanityImageResult;
  imageAlt?: string;
  uploadedVideoUrl?: string;
  externalVideoUrl?: string;
  videoPosterImage?: SanityImageResult;
  videoTitle?: string;
  transcript?: string;
  caption?: string;
  captureDate?: string;
  displayOrder?: number;
  featured?: boolean;
  orientation?: "landscape" | "portrait" | "square" | "panorama";
};
