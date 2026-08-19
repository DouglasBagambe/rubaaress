import { defineQuery } from "next-sanity";
import type { SanityImageResult } from "@/sanity/queries/siteSettings";

const IMAGE_PROJECTION = `{
  "url": asset->url,
  "alt": coalesce(alt, asset->altText),
  "dimensions": asset->metadata.dimensions
}`;

export const NEWS_ARTICLES_QUERY = defineQuery(`*[_type == "newsArticle" && defined(slug.current) && defined(title)] | order(coalesce(publishedAt, _createdAt) desc) {
  _id, title, "slug": slug.current, excerpt, category, author, publishedAt, featured, seoTitle, seoDescription,
  "featuredImage": featuredImage ${IMAGE_PROJECTION}
}`);

export const NEWS_ARTICLE_BY_SLUG_QUERY = defineQuery(`*[_type == "newsArticle" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, excerpt, category, author, publishedAt, featured, seoTitle, seoDescription,
  "featuredImage": featuredImage ${IMAGE_PROJECTION},
  "plainBody": pt::text(body)
}`);

export const EVENTS_QUERY = defineQuery(`*[_type == "event" && defined(title)] | order(coalesce(startDate, startDateTime) asc) {
  _id, title, "slug": slug.current, summary, "plainDescription": pt::text(description), "startDateTime": coalesce(startDate, startDateTime), "endDateTime": coalesce(endDate, endDateTime), venue, category, eventStatus,
  "image": image ${IMAGE_PROJECTION}
}`);

export const ANNOUNCEMENTS_QUERY = defineQuery(`*[
  _type == "announcement" &&
  enabled == true &&
  (!defined(publicationDate) || publicationDate <= now()) &&
  (!defined(expiryDate) || expiryDate >= now())
] | order(coalesce(priority, 9999) asc, coalesce(publicationDate, _createdAt) desc) {
  _id, title, message, type, publicationDate, expiryDate, priority, ctaLabel, ctaLink
}`);

export const DOWNLOADS_QUERY = defineQuery(`*[_type == "download" && accessStatus == "public"] | order(coalesce(publicationDate, "0000-00-00") desc, title asc) {
  _id, title, description, category, publicationDate, academicYear, featured,
  "fileUrl": file.asset->url,
  "fileSize": file.asset->size,
  "fileType": file.asset->extension
}`);

export const STAFF_QUERY = defineQuery(`*[_type == "staffMember" && active == true] | order(coalesce(displayOrder, 9999) asc, fullName asc) {
  _id, fullName, role, category, biography, qualifications,
  "photograph": photograph ${IMAGE_PROJECTION}
}`);

export const ACADEMIC_PROGRAMMES_QUERY = defineQuery(`*[_type == "academicProgramme"] | order(level asc, title asc) {
  _id, title, level, introduction, "subjectText": pt::text(subjectInformation), "curriculumText": pt::text(curriculumDescription),
  "supportingImage": supportingImage ${IMAGE_PROJECTION}
}`);

export const DEPARTMENTS_QUERY = defineQuery(`*[_type == "department" && active == true] | order(coalesce(displayOrder, 9999) asc, name asc) {
  _id, name, "slug": slug.current, introduction, subjects,
  "headOfDepartment": headOfDepartment->fullName,
  "image": image ${IMAGE_PROJECTION}
}`);

export const ADMISSIONS_QUERY = defineQuery(`*[_type == "admissionsContent"][0] {
  introduction, applicationSteps, requirements, importantDates, feesIntroduction, faqs, contactCta
}`);

export const SCHOOL_LIFE_QUERY = defineQuery(`*[_type == "schoolLifeActivity" && enabled == true] | order(coalesce(displayOrder, 9999) asc, title asc) {
  _id, title, "slug": slug.current, category, "descriptionText": pt::text(description), activityLeader
}`);

export const FACILITIES_QUERY = defineQuery(`*[_type == "facility" && enabled == true] | order(coalesce(displayOrder, 9999) asc, title asc) {
  _id, title, "slug": slug.current, "descriptionText": pt::text(description)
}`);

export const MASTER_PLAN_QUERY = defineQuery(`*[_type == "masterPlan"][0] {
  pageTitle, introduction, developmentSections, homepagePreviewText,
  "overviewImage": overviewImage ${IMAGE_PROJECTION},
  "supportingImages": supportingImages[]{caption, displayOrder, "image": image ${IMAGE_PROJECTION}}
}`);

export type NewsArticleQueryItem = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  featured?: boolean;
  featuredImage?: SanityImageResult;
  plainBody?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type EventQueryItem = {
  _id: string;
  title?: string;
  slug?: string;
  summary?: string;
  plainDescription?: string;
  startDateTime?: string;
  endDateTime?: string;
  venue?: string;
  category?: string;
  eventStatus?: string;
  image?: SanityImageResult;
};

export type AnnouncementQueryItem = {
  _id: string;
  title?: string;
  message?: string;
  type?: string;
  publicationDate?: string;
  expiryDate?: string;
  priority?: number;
  ctaLabel?: string;
  ctaLink?: string;
};

export type DownloadQueryItem = {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  publicationDate?: string;
  academicYear?: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: string;
};

export type StaffQueryItem = { _id: string; fullName?: string; role?: string; category?: string; biography?: string; qualifications?: string[]; photograph?: SanityImageResult };
export type AcademicProgrammeQueryItem = { _id: string; title?: string; level?: string; introduction?: string; subjectText?: string; curriculumText?: string; supportingImage?: SanityImageResult };
export type DepartmentQueryItem = { _id: string; name?: string; slug?: string; introduction?: string; subjects?: string[]; headOfDepartment?: string; image?: SanityImageResult };
export type AdmissionsQueryResult = { introduction?: string; applicationSteps?: string[]; requirements?: string[]; importantDates?: string[]; feesIntroduction?: string; faqs?: { question?: string; answer?: string; category?: string; enabled?: boolean }[]; contactCta?: { label?: string; href?: string } } | null;
export type SchoolLifeQueryItem = { _id: string; title?: string; slug?: string; category?: string; descriptionText?: string; activityLeader?: string };
export type FacilityQueryItem = { _id: string; title?: string; slug?: string; descriptionText?: string };
export type MasterPlanQueryResult = { pageTitle?: string; introduction?: string; developmentSections?: { title?: string; body?: string }[]; homepagePreviewText?: string; overviewImage?: SanityImageResult; supportingImages?: { caption?: string; displayOrder?: number; image?: SanityImageResult }[] } | null;
