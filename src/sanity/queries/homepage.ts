import { defineQuery } from "next-sanity";
import type { SanityImageResult } from "@/sanity/queries/siteSettings";

export type HomepageQueryResult = {
  heroSlides?: ReadonlyArray<{
    internalTitle?: string;
    eyebrow?: string;
    heading?: string;
    text?: string;
    image?: SanityImageResult;
    primaryCtaLabel?: string;
    primaryCtaUrl?: string;
    secondaryCtaLabel?: string;
    secondaryCtaUrl?: string;
    displayOrder?: number;
    enabled?: boolean;
    _key?: string;
  }>;
  welcomeHeading?: string;
  welcomeIntroduction?: string;
  welcomeImage?: SanityImageResult;
  headteacherName?: string;
  headteacherPhotograph?: SanityImageResult;
  headteacherMessage?: string;
  academicPathwaysIntroduction?: string;
  coreStrengths?: ReadonlyArray<{ label?: string; href?: string; description?: string }>;
  enrolmentSectionHeading?: string;
  latestNewsHeading?: string;
  eventsHeading?: string;
  schoolLifeFeature?: string;
  masterPlanPreview?: string;
  admissionsCta?: { label?: string; href?: string };
  locationSectionIntroduction?: string;
} | null;

export const HOMEPAGE_QUERY = defineQuery(`*[_type == "homepage" && _id == "homepage"][0]{
  heroSlides[]{
    _key,
    internalTitle,
    eyebrow,
    heading,
    text,
    "image": image{
      "url": asset->url,
      "alt": alt,
      "dimensions": asset->metadata.dimensions
    },
    primaryCtaLabel,
    primaryCtaUrl,
    secondaryCtaLabel,
    secondaryCtaUrl,
    displayOrder,
    enabled
  },
  welcomeHeading,
  welcomeIntroduction,
  "welcomeImage": welcomeImage{
    "url": asset->url,
    "alt": alt,
    "dimensions": asset->metadata.dimensions
  },
  headteacherName,
  "headteacherPhotograph": headteacherPhotograph{
    "url": asset->url,
    "alt": alt,
    "dimensions": asset->metadata.dimensions
  },
  headteacherMessage,
  academicPathwaysIntroduction,
  coreStrengths,
  enrolmentSectionHeading,
  latestNewsHeading,
  eventsHeading,
  schoolLifeFeature,
  masterPlanPreview,
  admissionsCta,
  locationSectionIntroduction
}`);
