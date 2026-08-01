import { defineArrayMember, defineField, defineType } from "sanity";

const knownRoutes = [
  "/",
  "/about",
  "/about/history",
  "/about/leadership",
  "/about/master-plan",
  "/about/mission-vision",
  "/academics",
  "/academics/a-level",
  "/academics/departments",
  "/academics/o-level",
  "/admissions",
  "/contact",
  "/downloads",
  "/events",
  "/gallery",
  "/news",
  "/school-life",
] as const;

const routeValidation = (value?: string) => {
  if (!value) return true;
  if (knownRoutes.includes(value as (typeof knownRoutes)[number])) return true;
  if (value.startsWith("https://") || value.startsWith("mailto:") || value.startsWith("tel:")) return true;
  return "Use an approved website route, HTTPS URL, mailto link, or telephone link.";
};

const nonNegativeInteger = (value?: number) => {
  if (value === undefined || value === null) return true;
  return Number.isInteger(value) && value >= 0 ? true : "Enter a non-negative whole number.";
};

const routeField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    options: { list: [...knownRoutes] },
    validation: (rule) => rule.custom(routeValidation),
  });

const altTextField = defineField({
  name: "alt",
  title: "Alternative text",
  type: "string",
  description: "Describe the image for visitors using assistive technology.",
  validation: (rule) => rule.required().min(12),
});

const imageField = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [altTextField],
    validation: (rule) => (required ? rule.required() : rule),
  });

const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }, { title: "Number", value: "number" }],
      marks: {
        decorators: [{ title: "Strong", value: "strong" }, { title: "Emphasis", value: "em" }],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [defineField({ name: "href", title: "URL", type: "url", validation: (rule) => rule.uri({ scheme: ["https", "mailto", "tel"] }) })],
          }),
        ],
      },
    }),
  ],
});

const socialLink = defineType({
  name: "socialLink",
  title: "Social media link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "url", title: "URL", type: "url", validation: (rule) => rule.required().uri({ scheme: ["https"] }) }),
  ],
});

const linkItem = defineType({
  name: "linkItem",
  title: "Website link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
    routeField("href", "Route or URL"),
  ],
});

const heroSlide = defineType({
  name: "heroSlide",
  title: "Hero slide",
  type: "object",
  fields: [
    defineField({ name: "internalTitle", title: "Internal title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "text", title: "Supporting text", type: "text", rows: 3 }),
    imageField("image", "Slide image", true),
    defineField({ name: "primaryCtaLabel", title: "Primary CTA label", type: "string" }),
    routeField("primaryCtaUrl", "Primary CTA URL"),
    defineField({ name: "secondaryCtaLabel", title: "Secondary CTA label", type: "string" }),
    routeField("secondaryCtaUrl", "Secondary CTA URL"),
    defineField({ name: "displayOrder", title: "Display order", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "internalTitle", subtitle: "heading", media: "image" },
  },
});

const enrolmentClassRow = defineType({
  name: "enrolmentClassRow",
  title: "Class row",
  type: "object",
  fields: [
    defineField({ name: "className", title: "Class name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "femaleDay", title: "Female day", type: "number", validation: (rule) => rule.required().custom(nonNegativeInteger) }),
    defineField({ name: "femaleBoarding", title: "Female boarding", type: "number", validation: (rule) => rule.required().custom(nonNegativeInteger) }),
    defineField({ name: "maleDay", title: "Male day", type: "number", validation: (rule) => rule.required().custom(nonNegativeInteger) }),
    defineField({ name: "maleBoarding", title: "Male boarding", type: "number", validation: (rule) => rule.required().custom(nonNegativeInteger) }),
  ],
  preview: {
    select: { title: "className", femaleDay: "femaleDay", femaleBoarding: "femaleBoarding", maleDay: "maleDay", maleBoarding: "maleBoarding" },
    prepare: ({ title, femaleDay = 0, femaleBoarding = 0, maleDay = 0, maleBoarding = 0 }) => ({
      title,
      subtitle: `Total: ${femaleDay + femaleBoarding + maleDay + maleBoarding}`,
    }),
  },
});

const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
  ],
});

const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery image",
  type: "object",
  fields: [
    imageField("image", "Image", true),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", validation: (rule) => rule.integer().min(0) }),
  ],
  preview: { select: { title: "caption", media: "image" } },
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "schoolName", title: "School name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "shortSchoolName", title: "Short school name", type: "string" }),
    defineField({ name: "motto", title: "Motto", type: "string" }),
    imageField("badge", "School badge"),
    defineField({ name: "primaryTelephone", title: "Primary telephone", type: "string", validation: (rule) => rule.regex(/^[+0-9 ()-]{7,20}$/).warning("Use a valid telephone format.") }),
    defineField({ name: "secondaryTelephone", title: "Secondary telephone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "email" }),
    defineField({ name: "postalAddress", title: "Postal address", type: "string" }),
    defineField({ name: "physicalLocation", title: "Physical location", type: "string" }),
    defineField({ name: "googleMapsUrl", title: "Google Maps URL", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
    defineField({ name: "googleMapsEmbedUrl", title: "Google Maps embed URL", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
    defineField({ name: "officeHours", title: "Office hours", type: "string" }),
    defineField({ name: "socialLinks", title: "Social media links", type: "array", of: [defineArrayMember({ type: "socialLink" })] }),
    defineField({ name: "footerIntroduction", title: "Footer introduction", type: "text", rows: 3 }),
    defineField({ name: "copyrightText", title: "Copyright text", type: "string" }),
  ],
});

const navigationSettings = defineType({
  name: "navigationSettings",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "utilityBarLinks", title: "Utility-bar links", type: "array", of: [defineArrayMember({ type: "linkItem" })] }),
    defineField({ name: "mainNavigationLabels", title: "Main navigation labels", type: "array", of: [defineArrayMember({ type: "linkItem" })] }),
    defineField({ name: "quickLinks", title: "Quick links", type: "array", of: [defineArrayMember({ type: "linkItem" })] }),
    defineField({ name: "galleryCtaLabel", title: "Gallery CTA label", type: "string" }),
    defineField({ name: "footerLinks", title: "Footer links", type: "array", of: [defineArrayMember({ type: "linkItem" })] }),
  ],
});

const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "heroSlides", title: "Hero slides", type: "array", of: [defineArrayMember({ type: "heroSlide" })] }),
    defineField({ name: "welcomeHeading", title: "Welcome heading", type: "string" }),
    defineField({ name: "welcomeIntroduction", title: "Welcome introduction", type: "text", rows: 4 }),
    imageField("welcomeImage", "Welcome image"),
    defineField({ name: "headteacherName", title: "Headteacher name", type: "string" }),
    imageField("headteacherPhotograph", "Headteacher photograph"),
    defineField({ name: "headteacherMessage", title: "Headteacher message", type: "text", rows: 5 }),
    defineField({ name: "academicPathwaysIntroduction", title: "Academic pathways introduction", type: "text", rows: 3 }),
    defineField({ name: "coreStrengths", title: "Core strengths", type: "array", of: [defineArrayMember({ type: "linkItem" })] }),
    defineField({ name: "enrolmentSectionHeading", title: "Enrolment section heading", type: "string" }),
    defineField({ name: "latestNewsHeading", title: "Latest news heading", type: "string" }),
    defineField({ name: "eventsHeading", title: "Events heading", type: "string" }),
    defineField({ name: "schoolLifeFeature", title: "School-life feature", type: "text", rows: 3 }),
    defineField({ name: "masterPlanPreview", title: "Master-plan preview", type: "text", rows: 3 }),
    defineField({ name: "admissionsCta", title: "Admissions CTA", type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), routeField("href", "Link")] }),
    defineField({ name: "locationSectionIntroduction", title: "Location-section introduction", type: "text", rows: 3 }),
  ],
});

const enrolment = defineType({
  name: "enrolment",
  title: "Enrolment record",
  type: "document",
  fields: [
    defineField({ name: "academicYear", title: "Academic year", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "reportingDate", title: "Reporting date", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "status", title: "Status", type: "string", options: { list: ["draft", "current", "archived"], layout: "radio" }, initialValue: "draft", validation: (rule) => rule.required() }),
    defineField({ name: "classRows", title: "Class rows", type: "array", of: [defineArrayMember({ type: "enrolmentClassRow" })], validation: (rule) => rule.required().min(1) }),
  ],
  preview: { select: { title: "academicYear", subtitle: "status" } },
});

const newsArticle = defineType({
  name: "newsArticle",
  title: "News article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", isUnique: (value, context) => context.defaultIsUnique(value, context) }, validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (rule) => rule.required().max(220) }),
    defineField({ name: "body", title: "Body", type: "richText" }),
    defineField({ name: "category", title: "Category", type: "string" }),
    imageField("featuredImage", "Featured image"),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "publishedAt", title: "Publication date", type: "datetime" }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "relatedGalleryAlbum", title: "Related gallery album", type: "reference", to: [{ type: "galleryAlbum" }] }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 }),
  ],
});

const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
    defineField({ name: "description", title: "Description", type: "richText" }),
    defineField({ name: "startDateTime", title: "Start date and time", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "endDateTime", title: "End date and time", type: "datetime" }),
    defineField({ name: "venue", title: "Venue", type: "string" }),
    imageField("image", "Image"),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "registrationLink", title: "Registration or external link", type: "url", validation: (rule) => rule.uri({ scheme: ["https"] }) }),
    defineField({ name: "eventStatus", title: "Event status", type: "string", options: { list: ["scheduled", "postponed", "cancelled", "completed"] }, initialValue: "scheduled" }),
  ],
});

const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "message", title: "Message", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "type", title: "Type", type: "string", options: { list: ["general", "urgent", "admissions", "academics", "events"] } }),
    defineField({ name: "publicationDate", title: "Publication date", type: "datetime" }),
    defineField({ name: "expiryDate", title: "Expiry date", type: "datetime" }),
    defineField({ name: "priority", title: "Priority", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
    routeField("ctaLink", "CTA link"),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
  ],
});

const galleryAlbum = defineType({
  name: "galleryAlbum",
  title: "Gallery album",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "eventDate", title: "Event date", type: "date" }),
    defineField({ name: "category", title: "Category", type: "string" }),
    imageField("coverImage", "Cover image", true),
    defineField({ name: "images", title: "Images", type: "array", of: [defineArrayMember({ type: "galleryImage" })] }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "published", title: "Published", type: "boolean", initialValue: false }),
  ],
});

const download = defineType({
  name: "download",
  title: "Download",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "file", title: "Uploaded file", type: "file", validation: (rule) => rule.required() }),
    defineField({ name: "publicationDate", title: "Publication date", type: "date" }),
    defineField({ name: "academicYear", title: "Academic year", type: "string" }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "accessStatus", title: "Access status", type: "string", options: { list: ["public", "internal"] }, initialValue: "public" }),
  ],
});

const staffMember = defineType({
  name: "staffMember",
  title: "Staff member",
  type: "document",
  fields: [
    defineField({ name: "fullName", title: "Full name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "role", title: "Role", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "string", options: { list: ["headteacher", "deputy headteacher", "administration", "teaching staff", "support staff", "board or governance"] } }),
    defineField({ name: "department", title: "Department", type: "reference", to: [{ type: "department" }] }),
    imageField("photograph", "Photograph"),
    defineField({ name: "biography", title: "Biography", type: "text", rows: 5 }),
    defineField({ name: "qualifications", title: "Qualifications", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "active", title: "Active", type: "boolean", initialValue: true }),
  ],
});

const department = defineType({
  name: "department",
  title: "Department",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (rule) => rule.required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 4 }),
    defineField({ name: "headOfDepartment", title: "Head of department", type: "reference", to: [{ type: "staffMember" }] }),
    defineField({ name: "subjects", title: "Subjects", type: "array", of: [defineArrayMember({ type: "string" })] }),
    imageField("image", "Image"),
    defineField({ name: "displayOrder", title: "Display order", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "active", title: "Active", type: "boolean", initialValue: true }),
  ],
});

const academicProgramme = defineType({
  name: "academicProgramme",
  title: "Academic programme",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "level", title: "Level", type: "string", options: { list: ["O-Level", "A-Level"] }, validation: (rule) => rule.required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 4 }),
    defineField({ name: "subjectInformation", title: "Subject information", type: "richText" }),
    defineField({ name: "curriculumDescription", title: "Curriculum description", type: "richText" }),
    imageField("supportingImage", "Supporting image"),
    defineField({ name: "downloadableDocuments", title: "Downloadable documents", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "download" }] })] }),
  ],
});

const admissionsContent = defineType({
  name: "admissionsContent",
  title: "Admissions content",
  type: "document",
  fields: [
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 4 }),
    defineField({ name: "applicationSteps", title: "Application steps", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "requirements", title: "Requirements", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "importantDates", title: "Important dates", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "feesIntroduction", title: "Fees introduction", type: "text", rows: 3 }),
    defineField({ name: "downloadableForms", title: "Downloadable forms", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "download" }] })] }),
    defineField({ name: "faqs", title: "FAQs", type: "array", of: [defineArrayMember({ type: "faq" })] }),
    defineField({ name: "contactCta", title: "Contact CTA", type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), routeField("href", "Link")] }),
  ],
});

const schoolLifeActivity = defineType({
  name: "schoolLifeActivity",
  title: "School-life activity",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "string", options: { list: ["sports", "clubs and societies", "student leadership", "spiritual life", "culture", "community activities"] } }),
    defineField({ name: "description", title: "Description", type: "richText" }),
    defineField({ name: "images", title: "Images", type: "array", of: [defineArrayMember({ type: "galleryImage" })] }),
    defineField({ name: "activityLeader", title: "Activity leader", type: "string" }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
  ],
});

const facility = defineType({
  name: "facility",
  title: "Facility",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "richText" }),
    defineField({ name: "images", title: "Images", type: "array", of: [defineArrayMember({ type: "galleryImage" })] }),
    defineField({ name: "displayOrder", title: "Display order", type: "number", validation: (rule) => rule.integer().min(0) }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
  ],
});

const masterPlan = defineType({
  name: "masterPlan",
  title: "Master Plan",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Page title", type: "string" }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 4 }),
    imageField("overviewImage", "Overview image"),
    defineField({ name: "supportingImages", title: "Supporting images", type: "array", of: [defineArrayMember({ type: "galleryImage" })] }),
    defineField({ name: "developmentSections", title: "Development sections", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", title: "Title", type: "string" }), defineField({ name: "body", title: "Body", type: "text", rows: 4 })] })] }),
    defineField({ name: "supportingDocuments", title: "Supporting documents", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "download" }] })] }),
    defineField({ name: "homepagePreviewText", title: "Homepage preview text", type: "text", rows: 3 }),
    imageField("homepagePreviewImage", "Homepage preview image"),
  ],
});

const genericPage = defineType({
  name: "genericPage",
  title: "Generic page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "pageIntroduction", title: "Page introduction", type: "text", rows: 4 }),
    imageField("pageBanner", "Page banner"),
    defineField({ name: "sections", title: "Rich-text sections", type: "richText" }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 }),
    defineField({ name: "publicationStatus", title: "Publication status", type: "string", options: { list: ["draft", "published", "archived"] }, initialValue: "draft" }),
  ],
});

export const schemaTypes = [
  richText,
  socialLink,
  linkItem,
  heroSlide,
  enrolmentClassRow,
  faq,
  galleryImage,
  siteSettings,
  navigationSettings,
  homepage,
  enrolment,
  newsArticle,
  event,
  announcement,
  galleryAlbum,
  download,
  staffMember,
  department,
  academicProgramme,
  admissionsContent,
  schoolLifeActivity,
  facility,
  masterPlan,
  genericPage,
];
