import { defineQuery } from "next-sanity";

export type SanityImageResult = {
  url?: string;
  alt?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
};

export type SiteSettingsQueryResult = {
  schoolName?: string;
  shortSchoolName?: string;
  motto?: string;
  mission?: string;
  vision?: string;
  badge?: SanityImageResult;
  primaryTelephone?: string;
  secondaryTelephone?: string;
  email?: string;
  postalAddress?: string;
  physicalLocation?: string;
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  officeHours?: string;
  footerIntroduction?: string;
  copyrightText?: string;
} | null;

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  schoolName,
  shortSchoolName,
  motto,
  mission,
  vision,
  "badge": badge{
    "url": asset->url,
    "alt": alt,
    "dimensions": asset->metadata.dimensions
  },
  primaryTelephone,
  secondaryTelephone,
  email,
  postalAddress,
  physicalLocation,
  googleMapsUrl,
  googleMapsEmbedUrl,
  officeHours,
  footerIntroduction,
  copyrightText
}`);
