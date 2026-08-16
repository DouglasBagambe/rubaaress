import { schoolMedia } from "@/content/media";

export type NavigationType = "direct" | "dropdown" | "mega";

export type NavigationLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavigationGroup = {
  heading: string;
  items: ReadonlyArray<NavigationLink>;
};

export type NavigationFeature = {
  heading: string;
  body: string;
  href: string;
  image: {
    src: string;
    alt: string;
  };
};

export type NavigationItem = {
  label: string;
  href: string;
  type: NavigationType;
  groups?: ReadonlyArray<NavigationGroup>;
  feature?: NavigationFeature;
};

export const navigation: ReadonlyArray<NavigationItem> = [
  { label: "Home", href: "/", type: "direct" },
  {
    label: "About",
    href: "/about",
    type: "mega",
    groups: [
      {
        heading: "Our School",
        items: [
          { label: "Overview", href: "/about" },
          { label: "School History", href: "/about/history" },
          { label: "Mission, Vision & Values", href: "/about/mission-vision" },
          { label: "Headteacher", href: "/about/headteacher" },
        ],
      },
      {
        heading: "Leadership & Campus",
        items: [
          { label: "Leadership", href: "/about/leadership" },
          { label: "Facilities", href: "/about/facilities" },
          { label: "Master Plan", href: "/about/master-plan" },
        ],
      },
    ],
    feature: {
      heading: "Discover Rubaare SS",
      body: "Explore the school's profile, leadership, campus and long-term development vision.",
      href: "/about",
      image: {
        src: schoolMedia.schoolCompound.src,
        alt: schoolMedia.schoolCompound.alt,
      },
    },
  },
  {
    label: "Academics",
    href: "/academics",
    type: "mega",
    groups: [
      {
        heading: "Academic Programmes",
        items: [
          { label: "Academics Overview", href: "/academics" },
          { label: "O-Level", href: "/academics/o-level" },
          { label: "A-Level", href: "/academics/a-level" },
          { label: "Departments", href: "/academics/departments" },
        ],
      },
      {
        heading: "Academic Information",
        items: [
          { label: "Academic Performance", href: "/academics/performance" },
        ],
      },
    ],
    feature: {
      heading: "Learning at Rubaare",
      body: "Find the O-Level and A-Level academic pathways and department information.",
      href: "/academics",
      image: {
        src: schoolMedia.classroomLearning.src,
        alt: schoolMedia.classroomLearning.alt,
      },
    },
  },
  {
    label: "Admissions",
    href: "/admissions",
    type: "dropdown",
    groups: [
      {
        heading: "Joining Rubaare SS",
        items: [
          { label: "Admissions Overview", href: "/admissions" },
          { label: "How to Apply", href: "/admissions/how-to-apply" },
          { label: "Admission Requirements", href: "/admissions/requirements" },
          { label: "Fees & Documents", href: "/admissions/fees-and-documents" },
          { label: "Frequently Asked Questions", href: "/admissions/faqs" },
        ],
      },
    ],
  },
  {
    label: "Student Life",
    href: "/school-life",
    type: "mega",
    groups: [
      {
        heading: "Student Experience",
        items: [
          { label: "Student Life Overview", href: "/school-life" },
          { label: "Sports", href: "/school-life#sports" },
          { label: "Student Life", href: "/school-life#student-life" },
          { label: "Spiritual Life", href: "/school-life#spiritual-life" },
        ],
      },
    ],
    feature: {
      heading: "Beyond the Classroom",
      body: "See how sports, clubs, leadership and student activities shape school life.",
      href: "/school-life",
      image: {
        src: schoolMedia.sportsDayVolleyball.src,
        alt: schoolMedia.sportsDayVolleyball.alt,
      },
    },
  },
];

export const newsNavigation: NavigationItem = {
  label: "News",
  href: "/news",
  type: "dropdown",
  groups: [
    {
      heading: "Stay Informed",
      items: [
        { label: "Latest News", href: "/news" },
        { label: "Upcoming Events", href: "/events" },
        { label: "Announcements", href: "/announcements" },
      ],
    },
  ],
};

export const utilityNavigation: ReadonlyArray<NavigationLink> = [
  { label: "News", href: "/news" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact", href: "/contact" },
];

export const mobileNavigation: ReadonlyArray<NavigationItem> = [
  ...navigation,
  newsNavigation,
  { label: "Gallery", href: "/gallery", type: "direct" },
  { label: "Downloads", href: "/downloads", type: "direct" },
  { label: "Contact", href: "/contact", type: "direct" },
];
