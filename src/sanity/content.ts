import { calculateEnrolment, type EnrolmentInputRow } from "@/lib/enrolment";
import {
  academicPathways,
  coreValues,
  downloads as localDownloads,
  enrolmentReportingDate,
  enrolmentRows,
  enrolmentTotals,
  findUs,
  galleryAlbums,
  heroSlides,
  images,
  latestNews,
  masterPlanItems,
  quickAccessLinks,
  schoolIdentity,
  schoolLife,
  schoolStats,
  upcomingEvents,
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
import {
  ACADEMIC_PROGRAMMES_QUERY,
  ADMISSIONS_QUERY,
  ANNOUNCEMENTS_QUERY,
  DEPARTMENTS_QUERY,
  DOWNLOADS_QUERY,
  EVENTS_QUERY,
  FACILITIES_QUERY,
  MASTER_PLAN_QUERY,
  NEWS_ARTICLE_BY_SLUG_QUERY,
  NEWS_ARTICLES_QUERY,
  SCHOOL_LIFE_QUERY,
  STAFF_QUERY,
  type AcademicProgrammeQueryItem,
  type AdmissionsQueryResult,
  type AnnouncementQueryItem,
  type DepartmentQueryItem,
  type DownloadQueryItem,
  type EventQueryItem,
  type FacilityQueryItem,
  type MasterPlanQueryResult,
  type NewsArticleQueryItem,
  type SchoolLifeQueryItem,
  type StaffQueryItem,
} from "@/sanity/queries/collections";
import { HOMEPAGE_QUERY, type HomepageQueryResult } from "@/sanity/queries/homepage";
import { SITE_SETTINGS_QUERY, type SanityImageResult, type SiteSettingsQueryResult } from "@/sanity/queries/siteSettings";
import type { ResolvedEnrolment, ResolvedGalleryAlbum, ResolvedGalleryAlbumDetail, ResolvedGalleryIndex, ResolvedGalleryMedia, ResolvedHomepage, ResolvedImage, ResolvedSiteSettings } from "@/sanity/types";
import { officialAboutPreamble, verifiedEnrolment } from "@/content/verified-school-content";

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

export function resolveNewsArticles(data: ReadonlyArray<NewsArticleQueryItem> | null) {
  const excludedPhrases = ["prepared for confirmation", "admissions resources moved", "pending confirmation", "school profile information prepared", "website team"];
  const articles = data
    ?.map((item, index) => ({
      title: withFallback(item.title, latestNews[index]?.title ?? "School news"),
      slug: withFallback(item.slug, latestNews[index]?.slug ?? item._id),
      excerpt: withFallback(item.excerpt, latestNews[index]?.excerpt ?? "School news update."),
      category: withFallback(item.category, latestNews[index]?.category ?? "News"),
      author: withFallback(item.author, latestNews[index]?.author ?? "Rubaare SS"),
      publishedAt: cleanString(item.publishedAt),
      featured: item.featured === true,
      featuredImage: sanityImageToAsset(item.featuredImage, latestNews[index]?.featuredImage ?? images.heroCampus),
      content: withFallback(item.plainBody, latestNews[index]?.content ?? item.excerpt ?? ""),
    }))
    .filter((item) => {
      const text = `${item.title} ${item.excerpt} ${item.content} ${item.author}`.toLowerCase();
      return item.title && item.slug && !excludedPhrases.some((phrase) => text.includes(phrase));
    });

  return articles?.length ? articles : latestNews;
}

export function resolveEvents(data: ReadonlyArray<EventQueryItem> | null, now = new Date()) {
  const events = data
    ?.map((item, index) => ({
      title: withFallback(item.title, upcomingEvents[index]?.title ?? "School event"),
      slug: cleanString(item.slug),
      description: withFallback(item.summary ?? item.plainDescription, upcomingEvents[index]?.description ?? "School event."),
      startDate: cleanString(item.startDateTime),
      endDate: cleanString(item.endDateTime),
      venue: withFallback(item.venue, upcomingEvents[index]?.venue ?? "Rubaare Secondary School"),
      category: withFallback(item.category, upcomingEvents[index]?.category ?? "Event"),
      image: sanityImageToAsset(item.image, upcomingEvents[index]?.image ?? images.heroCampus),
      eventStatus: item.eventStatus ?? "scheduled",
    }))
    .filter((item) => item.eventStatus !== "cancelled");

  const upcoming = events?.filter((item) => !item.startDate || new Date(item.startDate) >= now) ?? upcomingEvents;
  const past = events?.filter((item) => item.startDate && new Date(item.startDate) < now) ?? [];
  return { upcoming, past };
}

export function resolveAnnouncements(data: ReadonlyArray<AnnouncementQueryItem> | null) {
  return data?.map((item) => ({
    title: withFallback(item.title, "School announcement"),
    message: withFallback(item.message, ""),
    type: withFallback(item.type, "general"),
    publicationDate: cleanString(item.publicationDate),
    expiryDate: cleanString(item.expiryDate),
    priority: item.priority ?? 9999,
    ctaLabel: cleanString(item.ctaLabel),
    ctaLink: cleanString(item.ctaLink),
  })).filter((item) => item.message) ?? [];
}

export function resolveDownloads(data: ReadonlyArray<DownloadQueryItem> | null) {
  const downloads = data?.map((item, index) => ({
    title: withFallback(item.title, localDownloads[index]?.title ?? "School document"),
    category: withFallback(item.category, localDownloads[index]?.category ?? "Documents"),
    fileType: withFallback(item.fileType?.toUpperCase(), localDownloads[index]?.fileType ?? "FILE"),
    fileSize: item.fileSize ? `${Math.ceil(item.fileSize / 1024)} KB` : localDownloads[index]?.fileSize ?? "File size unavailable",
    publicationDate: withFallback(item.publicationDate, localDownloads[index]?.publicationDate ?? "Publication date unavailable"),
    description: cleanString(item.description),
    fileUrl: cleanString(item.fileUrl),
    academicYear: cleanString(item.academicYear),
  }));

  const remote = downloads?.filter((item) => item.fileUrl) ?? [];
  return [...localDownloads, ...remote.filter((item) => !localDownloads.some((local) => local.title === item.title))];
}

export function resolveStaff(data: ReadonlyArray<StaffQueryItem> | null) {
  const staff = data?.map((item) => ({
    title: withFallback(item.fullName, "Staff member"),
    body: [item.role, item.biography].filter(Boolean).join(". "),
  })).filter((item) => item.body);

  return staff?.length ? staff : [{ title: schoolIdentity.headteacher, body: "Headteacher" }];
}

export function resolveAcademicContent(programmes: ReadonlyArray<AcademicProgrammeQueryItem> | null, departments: ReadonlyArray<DepartmentQueryItem> | null) {
  const programmeBlocks = programmes?.map((item) => ({
    id: item.level?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: withFallback(item.title, `${item.level ?? "Academic"} Programme`),
    body: withFallback(item.introduction ?? item.subjectText ?? item.curriculumText, "O-Level and A-Level programmes are offered."),
  })).filter((item) => item.title);
  const departmentBlocks = departments?.map((item) => ({
    id: item.slug,
    title: withFallback(item.name, "Department"),
    body: withFallback(item.introduction, item.subjects?.join(", ") ?? "Subject department."),
  })).filter((item) => item.title);

  return {
    programmes: programmeBlocks?.length ? programmeBlocks : academicPathways.map((pathway) => ({ id: pathway.title.startsWith("O-Level") ? "o-level" : "a-level", title: pathway.title, body: pathway.summary })),
    departments: departmentBlocks ?? [],
  };
}

export function resolveAdmissions(data: AdmissionsQueryResult) {
  void data;
  return {
    introduction: "Verified O-Level and A-Level admission guidance, requirements, fees and documents are available in this section.",
    blocks: [
      { id: "apply", title: "How to Apply", body: "Review the appropriate admission letter, prepare the required former-school documents and report between 08:00am and 5:00pm." },
      { id: "requirements", title: "Admission Requirements", body: "Separate O-Level and A-Level requirements cover reporting documents, uniform, personal items and boarding needs." },
      { id: "documents", title: "Fees & Documents", body: "Official 2026 admission packs, fee schedules, forms and requirements are available as PDF downloads." },
      { id: "faq", title: "Frequently Asked Questions", body: "Answers cover day and boarding programmes, meals, reporting, documents, utilities and downloads." },
    ],
  };
}

export function resolveSchoolLife(data: ReadonlyArray<SchoolLifeQueryItem> | null) {
  const activities = data?.map((item) => ({
    id: cleanString(item.slug),
    title: withFallback(item.title, "School activity"),
    body: withFallback(item.descriptionText, item.activityLeader ? `Led by ${item.activityLeader}.` : "School-life activity."),
  }));

  return activities?.length ? activities : schoolLife.map((item) => ({ id: item.href.split("#")[1], title: item.title, body: item.summary }));
}

export function resolveFacilities(data: ReadonlyArray<FacilityQueryItem> | null) {
  return data?.map((item) => ({
    id: cleanString(item.slug),
    title: withFallback(item.title, "School facility"),
    body: withFallback(item.descriptionText, "School facility."),
  })).filter((item) => item.title) ?? [];
}

export function resolveMasterPlan(data: MasterPlanQueryResult) {
  const overview = { ...masterPlanItems[0], ...sanityImageToAsset(data?.overviewImage, masterPlanItems[0]) };
  const supporting = data?.supportingImages
    ?.map((item, index) => {
      const fallback = masterPlanItems[index + 1] ?? masterPlanItems[0];
      return { ...fallback, ...sanityImageToAsset(item.image, fallback), caption: cleanString(item.caption) ?? fallback.caption };
    })
    .filter((item) => item.src);

  return {
    pageTitle: withFallback(data?.pageTitle, "Rubaare Secondary School Master Plan"),
    introduction: withFallback(data?.introduction, "The school master plan presents proposed facilities and future campus development."),
    developmentSections: data?.developmentSections ?? [],
    items: [overview, ...(supporting?.length ? supporting : masterPlanItems.slice(1))],
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
      heading: "A mixed day and boarding school serving boys and girls.",
      introduction: officialAboutPreamble[0],
      body: `${officialAboutPreamble[1]} ${officialAboutPreamble[2]}`,
    },
    headteacher: {
      eyebrow: "From the Headteacher's Desk",
      name: schoolIdentity.headteacher,
      message: "Rubaare Secondary School is led by Headteacher Ms. Mpeirwe Monic Atukunda, supported by the senior administration and academic leadership team.",
      ctaLabel: "Meet the Headteacher",
      ctaHref: "/about/headteacher",
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
      description: "Review O-Level and A-Level reporting guidance, requirements, fees and official admission documents.",
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

  const candidate = currentRecords[0];
  const hasSeparatedOfficialData = Boolean(
    candidate?.headline?.grandTotal &&
    candidate.detailedRows?.length &&
    candidate.boardingDayRows?.length,
  );
  const record = candidate?.reportingDate && candidate.reportingDate >= verifiedEnrolment.reportingDate && hasSeparatedOfficialData ? candidate : undefined;
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
  const academicYear = withFallback(record?.academicYear, verifiedEnrolment.academicYear);
  const reportingDate = record?.reportingDate ?? verifiedEnrolment.reportingDate;
  const reportingDateLabel = record?.reportingDate ? formatDateLabel(record.reportingDate) : enrolmentReportingDate;
  const boardingDayTotals = record?.boardingDayRows?.reduce(
    (totals, row) => ({
      femaleDay: totals.femaleDay + (row.dayGirls ?? 0),
      femaleBoarding: totals.femaleBoarding + (row.boarderGirls ?? 0),
      maleDay: totals.maleDay + (row.dayBoys ?? 0),
      maleBoarding: totals.maleBoarding + (row.boarderBoys ?? 0),
    }),
    { femaleDay: 0, femaleBoarding: 0, maleDay: 0, maleBoarding: 0 },
  );
  const totals = record && record.headline && boardingDayTotals
    ? {
        ...boardingDayTotals,
        totalFemale: record.headline.totalFemale ?? 0,
        totalMale: record.headline.totalMale ?? 0,
        totalDay: record.headline.totalDay ?? 0,
        totalBoarding: record.headline.totalBoarding ?? 0,
        grandTotal: record.headline.grandTotal ?? 0,
      }
    : enrolmentTotals;
  const stats: ReadonlyArray<Stat> = [
    { label: "Total Learners", value: totals.grandTotal.toLocaleString("en-US"), note: `${academicYear} School Enrolment`, verificationStatus: "verified" },
    { label: "Female Learners", value: totals.totalFemale.toLocaleString("en-US"), note: "Girls enrolled", verificationStatus: "verified" },
    { label: "Male Learners", value: totals.totalMale.toLocaleString("en-US"), note: "Boys enrolled", verificationStatus: "verified" },
    { label: "Boarding Learners", value: totals.totalBoarding.toLocaleString("en-US"), note: "Boarding students", verificationStatus: "verified" },
    { label: "Day Scholars", value: totals.totalDay.toLocaleString("en-US"), note: "Day students", verificationStatus: "verified" },
  ];

  return {
    academicYear,
    reportingDate,
    reportingDateLabel,
    status: record?.status ?? "current",
    rows: calculated.rows,
    detailedRows: record?.detailedRows?.map((row) => ({ className: row.className ?? "", stream: row.stream ?? "", male: row.male ?? 0, female: row.female ?? 0, total: row.total ?? 0 })) ?? verifiedEnrolment.detailedRows,
    boardingDayRows: record?.boardingDayRows?.map((row) => ({ className: row.className ?? "", boarderBoys: row.boarderBoys ?? 0, boarderGirls: row.boarderGirls ?? 0, boarderTotal: row.boarderTotal ?? 0, dayBoys: row.dayBoys ?? 0, dayGirls: row.dayGirls ?? 0, dayTotal: row.dayTotal ?? 0 })) ?? verifiedEnrolment.boardingDayRows,
    totals,
    stats: totals.grandTotal > 0 ? stats : schoolStats,
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

export async function getNewsArticles() {
  return resolveNewsArticles(await safeFetch<ReadonlyArray<NewsArticleQueryItem>>(NEWS_ARTICLES_QUERY));
}

export async function getNewsArticle(slug: string) {
  const article = resolveNewsArticles(await safeFetch<ReadonlyArray<NewsArticleQueryItem>>(NEWS_ARTICLES_QUERY)).find((item) => item.slug === slug);
  if (article) return article;
  const single = await safeFetch<NewsArticleQueryItem | null>(NEWS_ARTICLE_BY_SLUG_QUERY, { slug });
  return resolveNewsArticles(single ? [single] : null).find((item) => item.slug === slug);
}

export async function getEvents() {
  return resolveEvents(await safeFetch<ReadonlyArray<EventQueryItem>>(EVENTS_QUERY));
}

export async function getAnnouncements() {
  return resolveAnnouncements(await safeFetch<ReadonlyArray<AnnouncementQueryItem>>(ANNOUNCEMENTS_QUERY));
}

export async function getDownloads() {
  return resolveDownloads(await safeFetch<ReadonlyArray<DownloadQueryItem>>(DOWNLOADS_QUERY));
}

export async function getStaff() {
  return resolveStaff(await safeFetch<ReadonlyArray<StaffQueryItem>>(STAFF_QUERY));
}

export async function getAcademicContent() {
  const [programmes, departments] = await Promise.all([
    safeFetch<ReadonlyArray<AcademicProgrammeQueryItem>>(ACADEMIC_PROGRAMMES_QUERY),
    safeFetch<ReadonlyArray<DepartmentQueryItem>>(DEPARTMENTS_QUERY),
  ]);
  return resolveAcademicContent(programmes, departments);
}

export async function getAdmissions() {
  return resolveAdmissions(await safeFetch<AdmissionsQueryResult>(ADMISSIONS_QUERY));
}

export async function getSchoolLifeActivities() {
  return resolveSchoolLife(await safeFetch<ReadonlyArray<SchoolLifeQueryItem>>(SCHOOL_LIFE_QUERY));
}

export async function getFacilities() {
  return resolveFacilities(await safeFetch<ReadonlyArray<FacilityQueryItem>>(FACILITIES_QUERY));
}

export async function getMasterPlan() {
  return resolveMasterPlan(await safeFetch<MasterPlanQueryResult>(MASTER_PLAN_QUERY));
}
