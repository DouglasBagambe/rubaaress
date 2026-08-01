import type { CalculatedEnrolmentRow, CalculatedEnrolmentTotals } from "@/lib/enrolment";
import type { HeroSlide, ImageAsset, QuickLink, Stat, ValueItem } from "@/lib/site-data";

export type ResolvedImage = ImageAsset;

export type ResolvedSiteSettings = {
  schoolName: string;
  shortSchoolName: string;
  motto: string;
  mission: string;
  vision: string;
  badge: ResolvedImage;
  primaryTelephone: string;
  primaryTelephoneHref: string;
  secondaryTelephone?: string;
  email?: string;
  postalAddress: string;
  physicalLocation: string;
  locationDisplay: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  officeHours?: string;
  footerIntroduction: string;
  copyrightText: string;
};

export type ResolvedHomepage = {
  heroSlides: ReadonlyArray<HeroSlide>;
  quickAccessLinks: ReadonlyArray<QuickLink>;
  welcome: {
    eyebrow: string;
    heading: string;
    introduction: string;
    body: string;
  };
  headteacher: {
    eyebrow: string;
    name: string;
    message: string;
    ctaLabel: string;
    ctaHref: string;
    image: ResolvedImage;
  };
  academicsIntroduction: string;
  coreStrengths: ReadonlyArray<ValueItem>;
  enrolmentSectionHeading: string;
  latestNewsHeading: string;
  eventsHeading: string;
  schoolLifeFeature: string;
  masterPlanPreview: {
    eyebrow: string;
    title: string;
    description: string;
    image: ResolvedImage;
    ctaLabel: string;
    ctaHref: string;
  };
  admissionsCta: {
    eyebrow: string;
    title: string;
    description: string;
    label: string;
    href: string;
  };
  locationIntroduction?: string;
};

export type ResolvedEnrolment = {
  academicYear: string;
  reportingDate: string;
  reportingDateLabel: string;
  status: "draft" | "current" | "archived";
  rows: ReadonlyArray<CalculatedEnrolmentRow>;
  totals: CalculatedEnrolmentTotals;
  stats: ReadonlyArray<Stat>;
  warnings: ReadonlyArray<string>;
};

export type ResolvedGalleryMedia = {
  id: string;
  title: string;
  albumSlug: string;
  mediaType: "image" | "video";
  image?: ResolvedImage;
  videoUrl?: string;
  uploadedVideoUrl?: string;
  posterImage?: ResolvedImage;
  videoTitle?: string;
  transcript?: string;
  caption?: string;
  captureDate?: string;
  displayOrder: number;
  featured: boolean;
  orientation?: "landscape" | "portrait" | "square" | "panorama";
};

export type ResolvedGalleryAlbum = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  introduction?: string;
  category: string;
  eventDate?: string;
  academicYear?: string;
  coverImage: ResolvedImage;
  bannerImage?: ResolvedImage;
  featured: boolean;
  published: boolean;
  visibility: "public" | "unlisted" | "archived";
  displayOrder: number;
  photoCount: number;
  videoCount: number;
  mediaCount: number;
  seoTitle?: string;
  seoDescription?: string;
};

export type ResolvedGalleryIndex = {
  albums: ReadonlyArray<ResolvedGalleryAlbum>;
  featuredAlbum?: ResolvedGalleryAlbum;
  categories: ReadonlyArray<string>;
  academicYears: ReadonlyArray<string>;
  hasPhotos: boolean;
  hasVideos: boolean;
  search: string;
  selectedCategory: string;
  selectedYear: string;
  selectedType: "all" | "photos" | "videos";
};

export type ResolvedGalleryAlbumDetail = {
  album: ResolvedGalleryAlbum;
  media: ReadonlyArray<ResolvedGalleryMedia>;
  relatedAlbums: ReadonlyArray<ResolvedGalleryAlbum>;
  nextCursor?: string;
};
