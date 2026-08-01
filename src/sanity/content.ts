import { calculateEnrolment, type EnrolmentInputRow } from "@/lib/enrolment";
import {
  coreValues,
  enrolmentReportingDate,
  enrolmentRows,
  findUs,
  galleryAlbums,
  heroSlides,
  images,
  masterPlanItems,
  quickAccessLinks,
  schoolIdentity,
  schoolStats,
  type HeroSlide,
  type ImageAsset,
  type QuickLink,
  type Stat,
} from "@/lib/site-data";
import { countMedia, filterGalleryAlbums, mediaMatchesType, paginateGalleryMedia, sortGalleryMedia, type GalleryTypeFilter } from "@/lib/gallery";
import { client } from "@/sanity/client";
import { CURRENT_ENROLMENT_QUERY, type EnrolmentQueryResult } from "@/sanity/queries/enrolment";
import {
  GALLERY_ALBUMS_QUERY,
  GALLERY_ALBUM_BY_SLUG_QUERY,
  GALLERY_MEDIA_QUERY,
  RELATED_GALLERY_ALBUMS_QUERY,
  type GalleryAlbumQueryItem,
  type GalleryMediaQueryItem,
} from "@/sanity/queries/gallery";
import { HOMEPAGE_QUERY, type HomepageQueryResult } from "@/sanity/queries/homepage";
import { SITE_SETTINGS_QUERY, type SanityImageResult, type SiteSettingsQueryResult } from "@/sanity/queries/siteSettings";
import type { ResolvedEnrolment, ResolvedGalleryAlbum, ResolvedGalleryAlbumDetail, ResolvedGalleryIndex, ResolvedGalleryMedia, ResolvedHomepage, ResolvedImage, ResolvedSiteSettings } from "@/sanity/types";

function cleanString(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function withFallback(value: string | null | undefined, fallback: string) {
  return cleanString(value) ?? fallback;
}

function telHref(display: string) {
  const digits = display.replace(/\D/g, "");
  if (digits.startsWith("0")) return `tel:+256${digits.slice(1)}`;
  if (digits.startsWith("256")) return `tel:+${digits}`;
  return `tel:${display.replace(/\s/g, "")}`;
}

function formatDateLabel(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function sanityImageToAsset(image: SanityImageResult | undefined, fallback: ImageAsset): ResolvedImage {
  const url = cleanString(image?.url);
  const alt = cleanString(image?.alt);
  const width = image?.dimensions?.width;
  const height = image?.dimensions?.height;

  if (!url || !alt || !width || !height) return fallback;

  return {
    ...fallback,
    src: url,
    alt,
    width,
    height,
    credit: "Sanity CMS",
    verificationStatus: "verified",
  };
}

async function safeFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  try {
    return await client.fetch<T>(query, params, { perspective: "published", next: { revalidate: 60 } });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Sanity fetch failed; using local fallback content.", error);
    }
    return null;
  }
}

function fallbackGalleryMediaForAlbum(album: (typeof galleryAlbums)[number]): ReadonlyArray<ResolvedGalleryMedia> {
  return album.images.map((image, index) => ({
    id: `${album.slug}-${index + 1}`,
    title: image.alt,
    albumSlug: album.slug,
    mediaType: "image",
    image,
    caption: undefined,
    displayOrder: index,
    featured: index === 0,
  }));
}

function fallbackGalleryAlbums(): ReadonlyArray<ResolvedGalleryAlbum> {
  return galleryAlbums.map((album, index) => {
    const counts = countMedia(fallbackGalleryMediaForAlbum(album));
    return {
      id: `fallback-${album.slug}`,
      title: album.title,
      slug: album.slug,
      shortDescription: album.description,
      category: album.title === "Sports Day" ? "Sports Day" : album.title,
      coverImage: album.coverImage,
      featured: index === 0,
      published: true,
      visibility: "public",
      displayOrder: index,
      ...counts,
    };
  });
}

function sanityAlbumToResolved(album: GalleryAlbumQueryItem, fallback?: ResolvedGalleryAlbum): ResolvedGalleryAlbum | null {
  const title = cleanString(album.title);
  const slug = cleanString(album.slug);
  const category = cleanString(album.category);
  const coverFallback = fallback?.coverImage ?? galleryAlbums[0]?.coverImage;
  if (!title || !slug || !category || !coverFallback) return null;

  const photoCount = album.photoCount ?? fallback?.photoCount ?? 0;
  const videoCount = album.videoCount ?? fallback?.videoCount ?? 0;

  return {
    id: album._id,
    title,
    slug,
    shortDescription: withFallback(album.shortDescription, fallback?.shortDescription ?? "Official Rubaare Secondary School gallery album."),
    introduction: cleanString(album.introduction),
    category,
    eventDate: cleanString(album.eventDate),
    academicYear: cleanString(album.academicYear),
    coverImage: sanityImageToAsset(album.coverImage, coverFallback),
    bannerImage: album.bannerImage ? sanityImageToAsset(album.bannerImage, coverFallback) : undefined,
    featured: album.featured === true,
    published: album.published === true,
    visibility: album.visibility ?? "public",
    displayOrder: album.displayOrder ?? fallback?.displayOrder ?? 9999,
    photoCount,
    videoCount,
    mediaCount: photoCount + videoCount,
    seoTitle: cleanString(album.seoTitle),
    seoDescription: cleanString(album.seoDescription),
  };
}

function sanityMediaToResolved(media: GalleryMediaQueryItem, fallbackImage: ResolvedImage): ResolvedGalleryMedia | null {
  const mediaType = media.mediaType === "video" ? "video" : "image";
  const title = withFallback(media.internalTitle, media.videoTitle ?? fallbackImage.alt);
  const image = media.image ? sanityImageToAsset({ ...media.image, alt: media.imageAlt ?? media.image.alt }, fallbackImage) : undefined;
  const posterImage = media.videoPosterImage ? sanityImageToAsset(media.videoPosterImage, fallbackImage) : image;

  if (mediaType === "image" && !image) return null;
  if (mediaType === "video" && !media.uploadedVideoUrl && !media.externalVideoUrl) return null;

  return {
    id: media._id,
    title,
    albumSlug: withFallback(media.albumSlug, ""),
    mediaType,
    image,
    uploadedVideoUrl: cleanString(media.uploadedVideoUrl),
    videoUrl: cleanString(media.externalVideoUrl),
    posterImage,
    videoTitle: cleanString(media.videoTitle),
    transcript: cleanString(media.transcript),
    caption: cleanString(media.caption),
    captureDate: cleanString(media.captureDate),
    displayOrder: media.displayOrder ?? 9999,
    featured: media.featured === true,
    orientation: media.orientation,
  };
}

export function resolveGalleryIndex(
  data: ReadonlyArray<GalleryAlbumQueryItem> | null,
  filters: { category?: string; year?: string; type?: string; search?: string } = {},
): ResolvedGalleryIndex {
  const fallback = fallbackGalleryAlbums();
  const sanityAlbums = data
    ?.map((album) => sanityAlbumToResolved(album, fallback.find((item) => item.slug === album.slug)))
    .filter((album): album is ResolvedGalleryAlbum => Boolean(album));
  const albums = sanityAlbums?.length ? sanityAlbums : fallback;
  const selectedType: GalleryTypeFilter = filters.type === "photos" || filters.type === "videos" ? filters.type : "all";
  const filteredAlbums = filterGalleryAlbums(albums, {
    category: filters.category,
    academicYear: filters.year,
    type: selectedType,
    search: filters.search,
  });
  const categories = [...new Set(albums.filter((album) => album.published && album.visibility === "public").map((album) => album.category))].sort();
  const academicYears = [...new Set(albums.map((album) => album.academicYear).filter((year): year is string => Boolean(year)))].sort().reverse();

  return {
    albums: filteredAlbums,
    featuredAlbum: filteredAlbums.find((album) => album.featured) ?? filteredAlbums[0],
    categories,
    academicYears,
    hasPhotos: albums.some((album) => album.photoCount > 0),
    hasVideos: albums.some((album) => album.videoCount > 0),
    search: filters.search ?? "",
    selectedCategory: filters.category ?? "",
    selectedYear: filters.year ?? "",
    selectedType,
  };
}

export function resolveGalleryAlbumDetail(
  albumData: GalleryAlbumQueryItem | null,
  mediaData: ReadonlyArray<GalleryMediaQueryItem> | null,
  relatedData: ReadonlyArray<GalleryAlbumQueryItem> | null,
  options: { slug: string; type?: string; cursor?: string; limit?: number },
): ResolvedGalleryAlbumDetail | null {
  const fallbackAlbums = fallbackGalleryAlbums();
  const fallbackAlbum = fallbackAlbums.find((album) => album.slug === options.slug);
  const album = albumData ? sanityAlbumToResolved(albumData, fallbackAlbum) : fallbackAlbum;
  if (!album || !album.published || album.visibility === "archived") return null;

  const type: GalleryTypeFilter = options.type === "photos" || options.type === "videos" ? options.type : "all";
  const fallbackMedia = galleryAlbums.find((item) => item.slug === options.slug);
  const resolvedMedia = mediaData?.length
    ? mediaData.map((item) => sanityMediaToResolved(item, album.coverImage)).filter((item): item is ResolvedGalleryMedia => Boolean(item))
    : fallbackMedia
      ? fallbackGalleryMediaForAlbum(fallbackMedia)
      : [];
  const filteredMedia = sortGalleryMedia(resolvedMedia).filter((item) => mediaMatchesType(item, type));
  const paginated = paginateGalleryMedia(filteredMedia, options.cursor, options.limit ?? 24);
  const relatedAlbums = relatedData
    ?.map((item) => sanityAlbumToResolved(item, fallbackAlbums.find((fallback) => fallback.slug === item.slug)))
    .filter((item): item is ResolvedGalleryAlbum => Boolean(item));

  return {
    album: { ...album, ...countMedia(resolvedMedia) },
    media: paginated.items,
    relatedAlbums: relatedAlbums?.length ? relatedAlbums : fallbackAlbums.filter((item) => item.slug !== album.slug && item.category === album.category).slice(0, 3),
    nextCursor: paginated.nextCursor,
  };
}

export function resolveSiteSettings(data: SiteSettingsQueryResult): ResolvedSiteSettings {
  const primaryTelephone = withFallback(data?.primaryTelephone, schoolIdentity.phoneDisplay);
  const physicalLocation = withFallback(data?.physicalLocation, schoolIdentity.location);

  return {
    schoolName: withFallback(data?.schoolName, schoolIdentity.name),
    shortSchoolName: withFallback(data?.shortSchoolName, schoolIdentity.shortName),
    motto: withFallback(data?.motto, schoolIdentity.motto),
    mission: withFallback(data?.mission, schoolIdentity.mission),
    vision: withFallback(data?.vision, schoolIdentity.vision),
    badge: sanityImageToAsset(data?.badge, {
      src: schoolIdentity.logoPath,
      alt: "Rubaare Secondary School badge",
      width: 640,
      height: 960,
      credit: "Official Rubaare Secondary School content",
      verificationStatus: "verified",
    }),
    primaryTelephone,
    primaryTelephoneHref: telHref(primaryTelephone),
    secondaryTelephone: cleanString(data?.secondaryTelephone),
    email: cleanString(data?.email) ?? schoolIdentity.email,
    postalAddress: withFallback(data?.postalAddress, schoolIdentity.postalAddress),
    physicalLocation,
    locationDisplay: physicalLocation.replace(", Uganda", ""),
    googleMapsUrl: withFallback(data?.googleMapsUrl, schoolIdentity.mapsUrl),
    googleMapsEmbedUrl: withFallback(data?.googleMapsEmbedUrl, findUs.mapEmbedSrc),
    officeHours: cleanString(data?.officeHours),
    footerIntroduction: withFallback(data?.footerIntroduction, `A mixed day and boarding secondary school serving learners in ${schoolIdentity.locationDisplay}.`),
    copyrightText: withFallback(data?.copyrightText, `Copyright ${new Date().getFullYear()} Rubaare Secondary School.`),
  };
}

function resolveHeroSlides(data: HomepageQueryResult): ReadonlyArray<HeroSlide> {
  const slides = data?.heroSlides
    ?.map((slide, index) => ({ slide, index }))
    .filter(({ slide }) => slide.enabled !== false)
    .sort((a, b) => (a.slide.displayOrder ?? a.index) - (b.slide.displayOrder ?? b.index))
    .map(({ slide, index }): HeroSlide | null => {
      const fallback = heroSlides[index] ?? heroSlides[0];
      if (!fallback || !cleanString(slide.heading) || !cleanString(slide.image?.alt) || !cleanString(slide.image?.url)) return null;
      const resolvedSlide: HeroSlide = {
        eyebrow: withFallback(slide.eyebrow, fallback.eyebrow),
        heading: withFallback(slide.heading, fallback.heading),
        body: withFallback(slide.text, fallback.body),
        image: sanityImageToAsset(slide.image, fallback.image),
        primaryCta: {
          label: withFallback(slide.primaryCtaLabel, fallback.primaryCta.label),
          href: withFallback(slide.primaryCtaUrl, fallback.primaryCta.href),
          description: fallback.primaryCta.description,
        },
        secondaryCta: slide.secondaryCtaLabel || fallback.secondaryCta
          ? {
              label: withFallback(slide.secondaryCtaLabel, fallback.secondaryCta?.label ?? "Learn more"),
              href: withFallback(slide.secondaryCtaUrl, fallback.secondaryCta?.href ?? "/about"),
              description: fallback.secondaryCta?.description ?? "Learn more",
            }
          : undefined,
      };
      return resolvedSlide;
    })
    .filter((slide): slide is HeroSlide => Boolean(slide));

  return slides?.length ? slides : heroSlides;
}

function resolveQuickLinks(data: HomepageQueryResult): ReadonlyArray<QuickLink> {
  const links = data?.coreStrengths
    ?.map((item, index) => ({
      label: withFallback(item.label, quickAccessLinks[index]?.label ?? "School section"),
      href: withFallback(item.href, quickAccessLinks[index]?.href ?? "/about"),
      description: withFallback(item.description, quickAccessLinks[index]?.description ?? "View school information."),
    }))
    .filter((item) => item.label && item.href);

  return links?.length ? links : quickAccessLinks;
}

export function resolveHomepage(data: HomepageQueryResult): ResolvedHomepage {
  return {
    heroSlides: resolveHeroSlides(data),
    quickAccessLinks: resolveQuickLinks(data),
    welcome: {
      eyebrow: "Welcome",
      heading: withFallback(data?.welcomeHeading, "A secondary-school community in Rubaare, Ntungamo District."),
      introduction: withFallback(data?.welcomeIntroduction, `${schoolIdentity.mission} ${schoolIdentity.vision}`),
      body: "The website is structured around the journeys families use most: admissions, academics, school life, news, events, documents, gallery and contact.",
    },
    headteacher: {
      eyebrow: "From the Headteacher's Desk",
      name: withFallback(data?.headteacherName, schoolIdentity.headteacher),
      message: withFallback(data?.headteacherMessage, "Welcome to Rubaare Secondary School. Our school community is committed to purposeful learning, discipline and the steady development of each learner."),
      ctaLabel: "View Leadership",
      ctaHref: "/about/leadership",
      image: sanityImageToAsset(data?.headteacherPhotograph, images.headteacher),
    },
    academicsIntroduction: withFallback(data?.academicPathwaysIntroduction, "Academic pathways guide learners through lower and advanced secondary study."),
    coreStrengths: coreValues,
    enrolmentSectionHeading: withFallback(data?.enrolmentSectionHeading, "Rubaare SS at a Glance"),
    latestNewsHeading: withFallback(data?.latestNewsHeading, "Latest News"),
    eventsHeading: withFallback(data?.eventsHeading, "Upcoming Events"),
    schoolLifeFeature: withFallback(data?.schoolLifeFeature, "School life introduces learners to leadership, teamwork, service and community participation."),
    masterPlanPreview: {
      eyebrow: "Our Vision for the Future",
      title: "A long-term plan for continued development.",
      description: withFallback(data?.masterPlanPreview, "Rubaare Secondary School's master plan presents a long-term vision for the continued development of its learning environment, facilities and student experience."),
      image: masterPlanItems[0],
      ctaLabel: "Explore the Master Plan",
      ctaHref: "/about/master-plan",
    },
    admissionsCta: {
      eyebrow: "Admissions",
      title: "Prepare to join Rubaare Secondary School.",
      description: "Admissions information, forms and dates are organised in one section for parents and guardians.",
      label: withFallback(data?.admissionsCta?.label, "Admissions information"),
      href: withFallback(data?.admissionsCta?.href, "/admissions"),
    },
    locationIntroduction: cleanString(data?.locationSectionIntroduction),
  };
}

export function resolveEnrolment(data: EnrolmentQueryResult): ResolvedEnrolment {
  const currentRecords = data ?? [];
  if (currentRecords.length > 1 && process.env.NODE_ENV === "development") {
    console.warn("Multiple current enrolment records found; using the most recent reporting date.");
  }

  const record = currentRecords[0];
  const rows: ReadonlyArray<EnrolmentInputRow> = record?.classRows?.length
    ? record.classRows.map((row) => ({
        className: row.className ?? "",
        femaleDay: row.femaleDay,
        femaleBoarding: row.femaleBoarding,
        maleDay: row.maleDay,
        maleBoarding: row.maleBoarding,
      }))
    : enrolmentRows;

  const calculated = calculateEnrolment(rows);
  const academicYear = withFallback(record?.academicYear, "2026");
  const reportingDate = record?.reportingDate ?? "2026-03-16";
  const reportingDateLabel = record?.reportingDate ? formatDateLabel(record.reportingDate) : enrolmentReportingDate;
  const stats: ReadonlyArray<Stat> = [
    { label: "Total Learners", value: calculated.totals.grandTotal.toLocaleString("en-US"), note: `${academicYear} School Enrolment`, verificationStatus: "verified" },
    { label: "Female Learners", value: calculated.totals.totalFemale.toLocaleString("en-US"), note: "Girls enrolled", verificationStatus: "verified" },
    { label: "Male Learners", value: calculated.totals.totalMale.toLocaleString("en-US"), note: "Boys enrolled", verificationStatus: "verified" },
    { label: "Boarding Learners", value: calculated.totals.totalBoarding.toLocaleString("en-US"), note: "Boarding students", verificationStatus: "verified" },
  ];

  return {
    academicYear,
    reportingDate,
    reportingDateLabel,
    status: record?.status ?? "current",
    rows: calculated.rows,
    totals: calculated.totals,
    stats: calculated.totals.grandTotal > 0 ? stats : schoolStats,
    warnings: calculated.warnings,
  };
}

export async function getSiteSettings() {
  return resolveSiteSettings(await safeFetch<SiteSettingsQueryResult>(SITE_SETTINGS_QUERY));
}

export async function getHomepage() {
  return resolveHomepage(await safeFetch<HomepageQueryResult>(HOMEPAGE_QUERY));
}

export async function getCurrentEnrolment() {
  return resolveEnrolment(await safeFetch<EnrolmentQueryResult>(CURRENT_ENROLMENT_QUERY));
}

export async function getGalleryIndex(filters: { category?: string; year?: string; type?: string; search?: string } = {}) {
  return resolveGalleryIndex(await safeFetch<ReadonlyArray<GalleryAlbumQueryItem>>(GALLERY_ALBUMS_QUERY), filters);
}

export async function getGalleryAlbumDetail(options: { slug: string; type?: string; cursor?: string; limit?: number }) {
  const album = await safeFetch<GalleryAlbumQueryItem | null>(GALLERY_ALBUM_BY_SLUG_QUERY, { slug: options.slug });
  if (!album) {
    return resolveGalleryAlbumDetail(null, null, null, options);
  }

  const mediaType = options.type === "photos" ? "image" : options.type === "videos" ? "video" : "all";
  const limit = options.limit ?? 24;
  const start = 0;
  const end = limit + 1;
  const [media, related] = await Promise.all([
    safeFetch<ReadonlyArray<GalleryMediaQueryItem>>(GALLERY_MEDIA_QUERY, { albumId: album._id, type: mediaType, start, end }),
    safeFetch<ReadonlyArray<GalleryAlbumQueryItem>>(RELATED_GALLERY_ALBUMS_QUERY, { albumId: album._id, category: album.category ?? "" }),
  ]);

  return resolveGalleryAlbumDetail(album, media, related, options);
}
