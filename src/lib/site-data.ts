import { enrolmentTotals } from "@/content/enrolment";
import { galleryAlbums, masterPlanItems, schoolMedia } from "@/content/media";
import { navigation } from "@/content/navigation";
import { officialSchoolProfile } from "@/content/site";
import { termThreeAnnouncement, termThreeEvents, termTwoClosingUpdate } from "@/content/school-updates";
import { publicDownloads } from "@/content/verified-school-content";

export type VerificationStatus = "verified" | "school-confirmation-required";

export type NavItem = {
  label: string;
  href: string;
  children?: ReadonlyArray<NavItem>;
};

export type ImageAsset = {
  src: string;
  alt: string;
  credit: string;
  verificationStatus: VerificationStatus;
  width?: number;
  height?: number;
};

export type QuickLink = {
  label: string;
  href: string;
  description: string;
};

export type Stat = {
  label: string;
  value: string;
  note: string;
  verificationStatus: VerificationStatus;
};

export type NewsItem = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featuredImage: ImageAsset;
  publishedAt?: string;
  author: string;
  featured: boolean;
  verificationStatus: VerificationStatus;
  circularHref?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type EventItem = {
  title: string;
  slug: string;
  description: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  category: string;
  image: ImageAsset;
  featured: boolean;
  verificationStatus: VerificationStatus;
};

export type Pathway = {
  title: string;
  href: string;
  summary: string;
  highlights: ReadonlyArray<string>;
};

export type ValueItem = {
  title: string;
  description: string;
};

export type SchoolLifeItem = {
  title: string;
  href: string;
  summary: string;
  image: ImageAsset;
};

export type DownloadItem = {
  title: string;
  category: string;
  fileType: string;
  fileSize: string;
  publicationDate: string;
  description?: string;
  fileUrl?: string;
};

export type PageIntro = {
  title: string;
  eyebrow: string;
  description: string;
  image: ImageAsset;
};

export type GalleryAlbum = (typeof galleryAlbums)[number];

export type MasterPlanItem = (typeof masterPlanItems)[number];

export type HeroSlide = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCta: QuickLink;
  secondaryCta?: QuickLink;
  image: ImageAsset;
};

export type FindUs = {
  heading: string;
  address: string;
  directionsHref: string;
  mapEmbedSrc: string;
  mapTitle: string;
};

export const schoolIdentity = {
  name: officialSchoolProfile.schoolName,
  shortName: officialSchoolProfile.shortName,
  motto: officialSchoolProfile.motto,
  vision: officialSchoolProfile.vision,
  mission: officialSchoolProfile.mission,
  location: officialSchoolProfile.contact.location,
  locationDisplay: officialSchoolProfile.contact.locationDisplay,
  phoneDisplay: officialSchoolProfile.contact.phoneDisplay,
  phoneHref: officialSchoolProfile.contact.phoneHref,
  postalAddress: officialSchoolProfile.contact.postalAddress,
  mapsUrl: officialSchoolProfile.contact.mapsUrl,
  email: officialSchoolProfile.contact.email,
  schoolType: "Mixed day and boarding secondary school",
  levels: "O-Level and A-Level",
  foundingBody: "Church of Uganda",
  headteacher: "Ms. Mpeirwe Monic Atukunda",
  logoPath: schoolMedia.badge.src,
  verificationStatus: "verified" as VerificationStatus,
} as const;

export const images = {
  heroCampus: {
    ...schoolMedia.studentAssembly,
  },
  heroStudents: {
    ...schoolMedia.schoolCompound,
  },
  classroom: {
    ...schoolMedia.classroomLearning,
  },
  lab: {
    ...schoolMedia.classroomAssembly,
  },
  headteacher: {
    ...schoolMedia.headteacher,
  },
  sports: {
    ...schoolMedia.sportsDayVolleyball,
  },
  clubs: {
    ...schoolMedia.christmasCarolsPerformance,
  },
  admissions: {
    ...schoolMedia.outdoorStudentGathering,
  },
} satisfies Record<string, ImageAsset>;

export const galleryImages: ReadonlyArray<ImageAsset> = [
  schoolMedia.schoolCompound,
  schoolMedia.classroomLearning,
  schoolMedia.sportsDayVolleyball,
  schoolMedia.waterProjectGroupPhoto,
  masterPlanItems[0],
];

export { galleryAlbums, masterPlanItems };

export const heroSlides: ReadonlyArray<HeroSlide> = [
  {
    eyebrow: "Welcome to Rubaare Secondary School",
    heading: "Learning, Character and Opportunity",
    body: "A mixed day and boarding secondary school serving learners in Rubaare, Ntungamo District.",
    primaryCta: { label: "Explore Our School", href: "/about", description: "Learn about the school" },
    secondaryCta: { label: "Admissions", href: "/admissions", description: "Admissions information" },
    image: images.heroStudents,
  },
  {
    eyebrow: "Academic Pathways",
    heading: "O-Level and A-Level Preparation",
    body: "A structured secondary-school environment for classroom learning, learner support and academic progression.",
    primaryCta: { label: "View Academics", href: "/academics", description: "Academic overview" },
    secondaryCta: { label: "Departments", href: "/academics/departments", description: "Departments" },
    image: images.classroom,
  },
  {
    eyebrow: "School Life",
    heading: "Learning and Community",
    body: "Day and boarding learners share academic, sporting, faith and community life.",
    primaryCta: { label: "School Life", href: "/school-life", description: "Student life" },
    secondaryCta: { label: "Gallery", href: "/gallery", description: "Gallery" },
    image: images.heroCampus,
  },
];

export { navigation };

export const utilityLinks: ReadonlyArray<QuickLink> = [
  { label: "Apply", href: "/admissions", description: "Admissions guidance" },
  { label: "Downloads", href: "/downloads", description: "Forms and circulars" },
  { label: "Results", href: "/academics/performance", description: "Academic performance" },
  { label: "Contact", href: "/contact", description: "Reach the school" },
];

export const quickAccessLinks: ReadonlyArray<QuickLink> = [
  { label: "Admissions", href: "/admissions", description: "How to apply and prepare documents." },
  { label: "Academics", href: "/academics", description: "O-Level, A-Level and departments." },
  { label: "Academic Results", href: "/academics/performance", description: "View verified UCE and UACE results." },
  { label: "Downloads", href: "/downloads", description: "Forms, fees, circulars and documents." },
];

export const academicPathways: ReadonlyArray<Pathway> = [
  {
    title: "O-Level Pathway",
    href: "/academics/o-level",
    summary: "O-Level education with day and boarding programmes and a broad foundation across Arts and Sciences.",
    highlights: ["Day and boarding", "Arts and Sciences", "Progression to advanced secondary education"],
  },
  {
    title: "A-Level Pathway",
    href: "/academics/a-level",
    summary: "A-Level study across a verified offering of Arts and Science subjects.",
    highlights: ["Three principal subjects", "General Paper is compulsory", "Computer Studies or Sub-Mathematics as a subsidiary"],
  },
];

export const coreValues: ReadonlyArray<ValueItem> = [
  { title: "Academic Focus", description: "A disciplined environment for study and steady learner growth." },
  { title: "Character", description: "School life shaped by responsibility, respect and service." },
  { title: "Leadership", description: "Opportunities for learners to practise accountability and teamwork." },
  { title: "Community", description: "A school connected to families, alumni and the wider Ntungamo community." },
];

export const schoolStats: ReadonlyArray<Stat> = [
  { label: "Total Learners", value: enrolmentTotals.grandTotal.toLocaleString("en-US"), note: "2026 School Enrolment", verificationStatus: "verified" },
  { label: "Boarding Learners", value: enrolmentTotals.totalBoarding.toLocaleString("en-US"), note: "Boarding students", verificationStatus: "verified" },
  { label: "Day Scholars", value: enrolmentTotals.totalDay.toLocaleString("en-US"), note: "Day students", verificationStatus: "verified" },
];

export const latestNews: ReadonlyArray<NewsItem> = [
  {
    ...termTwoClosingUpdate,
    featuredImage: {
      src: "/images/school/campus/rubaare-campus-aerial-poster.webp",
      alt: "Aerial view of Rubaare Secondary School in Ntungamo District, Uganda.",
      width: 1920,
      height: 1080,
      credit: "Official Rubaare Secondary School content",
      verificationStatus: "verified",
    },
    verificationStatus: "verified",
  },
];

export const currentAnnouncements = [termThreeAnnouncement] as const;

export const upcomingEvents: ReadonlyArray<EventItem> = termThreeEvents.map((event) => ({
  ...event,
  image: images.heroCampus,
  featured: event.slug === "beginning-of-term-iii-2026",
  verificationStatus: "verified",
}));

export const schoolLife: ReadonlyArray<SchoolLifeItem> = [
  { title: "Sports", href: "/school-life#sports", summary: "Official school photography records students participating in sports and team activities.", image: images.sports },
  { title: "Spiritual Life", href: "/school-life#spiritual-life", summary: "The school was founded by the Church of Uganda and welcomes students from all religious backgrounds.", image: images.clubs },
  { title: "Student Life", href: "/school-life#student-life", summary: "Day and boarding learners share academic, meal and community life at the school.", image: schoolMedia.studentAssembly },
];

export const downloads: ReadonlyArray<DownloadItem> = publicDownloads.map((item) => ({
  title: item.title,
  category: item.category,
  fileType: "PDF",
  fileSize: item.size,
  publicationDate: item.publicationDate ?? "2026",
  description: item.description,
  fileUrl: item.href,
}));

export const findUs: FindUs = {
  heading: "Find Rubaare Secondary School",
  address: schoolIdentity.location,
  directionsHref: officialSchoolProfile.contact.mapsUrl,
  mapEmbedSrc: officialSchoolProfile.contact.mapEmbedSrc,
  mapTitle: "Map showing Rubaare Secondary School in Ntungamo District, Uganda",
};

export const pageIntros: Record<string, PageIntro> = {
  about: {
    eyebrow: "About the School",
    title: "A mixed day and boarding secondary school in Rubaare.",
    description: "Rubaare Secondary School serves learners in Ntungamo District through O-Level and A-Level education.",
    image: images.heroCampus,
  },
  academics: {
    eyebrow: "Academics",
    title: "Secondary pathways for O-Level and A-Level learners.",
    description: "Academic sections introduce the lower and advanced secondary pathways, departments and learner support.",
    image: images.classroom,
  },
  admissions: {
    eyebrow: "Admissions",
    title: "A clear path for families preparing to join the school.",
    description: "Find verified O-Level and A-Level reporting guidance, requirements, fees and official admission documents.",
    image: images.admissions,
  },
  schoolLife: {
    eyebrow: "School Life",
    title: "Learning, sport, faith and community.",
    description: "Day and boarding learners share academic, sporting, faith and community life at the school.",
    image: images.clubs,
  },
  news: {
    eyebrow: "News",
    title: "School announcements and community stories.",
    description: "Official school news and verified updates are published here.",
    image: images.heroCampus,
  },
  events: {
    eyebrow: "Events",
    title: "School events and calendar notices.",
    description: "This page lists official school events with confirmed dates and venues.",
    image: images.sports,
  },
  gallery: {
    eyebrow: "Gallery",
    title: "A visual record of learning and school life.",
    description: "Official campus, classroom, sports, activity, water-project and master-plan images are organised into focused albums.",
    image: images.heroStudents,
  },
  downloads: {
    eyebrow: "Downloads",
    title: "Official documents and forms.",
    description: "Download official admission packs, fee schedules, forms, requirements, rules and academic results.",
    image: images.admissions,
  },
  contact: {
    eyebrow: "Contact",
    title: "Reach Rubaare Secondary School.",
    description: `${officialSchoolProfile.contact.location}. Telephone: ${officialSchoolProfile.contact.phoneDisplay}.`,
    image: images.heroCampus,
  },
  masterPlan: {
    eyebrow: "Master Plan",
    title: "Rubaare Secondary School Master Plan.",
    description: "The school master plan presents proposed future development for the learning environment, facilities and student experience.",
    image: masterPlanItems[0],
  },
};

export { enrolmentReportingDate, enrolmentRows, enrolmentTotals } from "@/content/enrolment";
export { officialSchoolProfile } from "@/content/site";
