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
