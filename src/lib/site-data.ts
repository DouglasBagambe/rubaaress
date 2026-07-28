import { galleryAlbums, masterPlanItems, schoolMedia } from "@/content/media";

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
};

export type EventItem = {
  title: string;
  slug: string;
  description: string;
  startDate?: string;
  endDate?: string;
  venue: string;
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
  name: "Rubaare Secondary School",
  shortName: "Rubaare SS",
  location: "Rubaare, Ntungamo District, Uganda",
  schoolType: "Mixed day and boarding secondary school",
  levels: "O-Level and A-Level",
  status: "Government-aided",
  foundingBody: "Church of Uganda",
  headteacher: "Ms Monica Mpeirwe Atukunda",
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
    heading: "Discipline, Service and Community",
    body: "School life brings together academics, leadership, clubs, sports and shared responsibility.",
    primaryCta: { label: "School Life", href: "/school-life", description: "Student life" },
    secondaryCta: { label: "Gallery", href: "/gallery", description: "Gallery" },
    image: images.heroCampus,
  },
];

export const navigation: ReadonlyArray<NavItem> = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about" },
      { label: "School History", href: "/about/history" },
      { label: "Mission, Vision & Values", href: "/about/mission-vision" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Master Plan", href: "/about/master-plan" },
      { label: "Facilities", href: "/about" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Overview", href: "/academics" },
      { label: "O-Level", href: "/academics/o-level" },
      { label: "A-Level", href: "/academics/a-level" },
      { label: "Departments", href: "/academics/departments" },
      { label: "Academic Performance", href: "/academics" },
    ],
  },
  {
    label: "Student Life",
    href: "/school-life",
    children: [
      { label: "School Life", href: "/school-life" },
      { label: "Admissions", href: "/admissions" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    label: "Updates",
    href: "/news",
    children: [
      { label: "Latest News", href: "/news" },
      { label: "Upcoming Events", href: "/events" },
      { label: "School Calendar", href: "/events" },
      { label: "Downloads", href: "/downloads" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const utilityLinks: ReadonlyArray<QuickLink> = [
  { label: "Apply", href: "/admissions", description: "Admissions guidance" },
  { label: "Downloads", href: "/downloads", description: "Forms and circulars" },
  { label: "School Calendar", href: "/events", description: "Term events" },
  { label: "Contact", href: "/contact", description: "Reach the school" },
];

export const quickAccessLinks: ReadonlyArray<QuickLink> = [
  { label: "Admissions", href: "/admissions", description: "How to apply and prepare documents." },
  { label: "Academics", href: "/academics", description: "O-Level, A-Level and departments." },
  { label: "School Calendar", href: "/events", description: "Upcoming school activities." },
  { label: "Downloads", href: "/downloads", description: "Forms, notices and documents." },
];

export const academicPathways: ReadonlyArray<Pathway> = [
  {
    title: "O-Level Pathway",
    href: "/academics/o-level",
    summary: "Lower secondary learning with broad academic foundations and classroom support.",
    highlights: ["Broad subject foundation", "Learner guidance", "Progression toward A-Level"],
  },
  {
    title: "A-Level Pathway",
    href: "/academics/a-level",
    summary: "Advanced secondary study preparing learners for higher education and future careers.",
    highlights: ["Advanced combinations", "Career guidance", "University preparation"],
  },
];

export const coreValues: ReadonlyArray<ValueItem> = [
  { title: "Academic Focus", description: "A disciplined environment for study and steady learner growth." },
  { title: "Character", description: "School life shaped by responsibility, respect and service." },
  { title: "Leadership", description: "Opportunities for learners to practise accountability and teamwork." },
  { title: "Community", description: "A school connected to families, alumni and the wider Ntungamo community." },
];

export const schoolStats: ReadonlyArray<Stat> = [
  { label: "School type", value: "Mixed", note: "Day and boarding", verificationStatus: "school-confirmation-required" },
  { label: "Levels", value: "O & A", note: "Secondary education", verificationStatus: "school-confirmation-required" },
  { label: "Status", value: "Govt", note: "Government-aided", verificationStatus: "school-confirmation-required" },
  { label: "Location", value: "Ntungamo", note: "Rubaare", verificationStatus: "verified" },
];

export const latestNews: ReadonlyArray<NewsItem> = [
  {
    title: "Water project documented in official school photography",
    slug: "water-project-official-photography",
    excerpt: "Official school photographs show water-project activity and students collecting water on campus.",
    content: "The supplied school content includes water-project photographs suitable for a development update, pending school confirmation of dates and project details.",
    category: "School Development",
    featuredImage: schoolMedia.waterProjectGroupPhoto,
    author: "Rubaare SS website team",
    featured: true,
    verificationStatus: "school-confirmation-required",
  },
  {
    title: "School profile information prepared for confirmation",
    slug: "school-profile-confirmation",
    excerpt: "Core public information has been structured for review before the production launch.",
    content: "The website content model separates verified public details from facts that need school confirmation.",
    category: "Administration",
    featuredImage: schoolMedia.classroomLearning,
    author: "Rubaare SS website team",
    featured: false,
    verificationStatus: "school-confirmation-required",
  },
  {
    title: "Admissions resources moved to a dedicated section",
    slug: "admissions-resources",
    excerpt: "Admissions guidance, downloads and contact paths now sit in their own website journey.",
    content: "Parents and guardians can use the admissions page as official documents become available.",
    category: "Admissions",
    featuredImage: schoolMedia.outdoorStudentGathering,
    author: "Rubaare SS website team",
    featured: false,
    verificationStatus: "school-confirmation-required",
  },
];

export const upcomingEvents: ReadonlyArray<EventItem> = [];

export const schoolLife: ReadonlyArray<SchoolLifeItem> = [
  { title: "Sports", href: "/school-life", summary: "Teamwork, health and friendly competition form part of school life.", image: images.sports },
  { title: "Clubs & Societies", href: "/school-life", summary: "Learners can develop confidence, service and practical interests.", image: images.clubs },
  { title: "Student Leadership", href: "/school-life", summary: "Student responsibility supports discipline and community life.", image: schoolMedia.studentAssembly },
];

export const downloads: ReadonlyArray<DownloadItem> = [
  { title: "Admission form", category: "Admissions", fileType: "PDF", fileSize: "To be uploaded", publicationDate: "Under review" },
  { title: "Fees structure", category: "Admissions", fileType: "PDF", fileSize: "To be uploaded", publicationDate: "Under review" },
  { title: "Term circular", category: "Circulars", fileType: "PDF", fileSize: "To be uploaded", publicationDate: "Under review" },
];

export const findUs: FindUs = {
  heading: "Find Rubaare Secondary School",
  address: schoolIdentity.location,
  directionsHref: "https://www.google.com/maps/search/?api=1&query=Rubaare%20Secondary%20School%20Ntungamo%20District%20Uganda",
  mapEmbedSrc: "https://www.google.com/maps?q=Rubaare%20Secondary%20School%20Ntungamo%20District%20Uganda&output=embed",
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
    description: "Admissions resources will hold application guidance, forms, requirements and important dates once approved.",
    image: images.admissions,
  },
  schoolLife: {
    eyebrow: "School Life",
    title: "Formation through study, leadership, service and community.",
    description: "School life brings together sports, clubs, student leadership and shared responsibility.",
    image: images.clubs,
  },
  news: {
    eyebrow: "News",
    title: "School announcements and community stories.",
    description: "News items are structured for verified updates, categories and future CMS publishing.",
    image: images.heroCampus,
  },
  events: {
    eyebrow: "Events",
    title: "Upcoming school activities and calendar notices.",
    description: "Events will appear here when the school publishes dates, venues and categories.",
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
    description: "Downloads are grouped for admissions, circulars, calendars and public notices.",
    image: images.admissions,
  },
  contact: {
    eyebrow: "Contact",
    title: "Reach Rubaare Secondary School.",
    description: "Contact details will be expanded when official phone, email and office hours are confirmed.",
    image: images.heroCampus,
  },
  masterPlan: {
    eyebrow: "Master Plan",
    title: "Rubaare Secondary School Master Plan.",
    description: "The school master plan presents proposed future development for the learning environment, facilities and student experience.",
    image: masterPlanItems[0],
  },
};
