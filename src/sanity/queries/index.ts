import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);
export const HOMEPAGE_QUERY = defineQuery(`*[_type == "homepage"][0]`);
export const CURRENT_ENROLMENT_QUERY = defineQuery(`*[_type == "enrolment" && status == "current"][0]`);
