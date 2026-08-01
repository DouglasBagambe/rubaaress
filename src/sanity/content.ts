import { calculateEnrolment, type EnrolmentInputRow } from "@/lib/enrolment";
import {
  coreValues,
  enrolmentReportingDate,
  enrolmentRows,
  findUs,
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
import { client } from "@/sanity/client";
import { CURRENT_ENROLMENT_QUERY, type EnrolmentQueryResult } from "@/sanity/queries/enrolment";
import { HOMEPAGE_QUERY, type HomepageQueryResult } from "@/sanity/queries/homepage";
import { SITE_SETTINGS_QUERY, type SanityImageResult, type SiteSettingsQueryResult } from "@/sanity/queries/siteSettings";
import type { ResolvedEnrolment, ResolvedHomepage, ResolvedImage, ResolvedSiteSettings } from "@/sanity/types";

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

async function safeFetch<T>(query: string): Promise<T | null> {
  try {
    return await client.fetch<T>(query, {}, { perspective: "published", next: { revalidate: 60 } });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Sanity fetch failed; using local fallback content.", error);
    }
    return null;
  }
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
