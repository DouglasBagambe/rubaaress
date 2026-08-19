export type SearchResult = {
  title: string;
  type: string;
  excerpt: string;
  href: string;
  keywords?: string;
};

export const corePageSearchResults: ReadonlyArray<SearchResult> = [
  { title: "Home", type: "Page", excerpt: "Rubaare Secondary School homepage.", href: "/" },
  { title: "About", type: "Page", excerpt: "School profile and enrolment information.", href: "/about" },
  { title: "History", type: "Page", excerpt: "The verified history of Rubaare Secondary School.", href: "/about/history" },
  { title: "Mission & Vision", type: "Page", excerpt: "The school mission, vision and motto.", href: "/about/mission-vision" },
  { title: "Headteacher", type: "Page", excerpt: "Meet Headteacher Ms. Mpeirwe Monic Atukunda.", href: "/about/headteacher" },
  { title: "Leadership", type: "Page", excerpt: "School administration and academic leadership.", href: "/about/leadership" },
  { title: "Facilities", type: "Page", excerpt: "Campus utilities, facilities and development projects.", href: "/about/facilities" },
  { title: "Master Plan", type: "Page", excerpt: "Proposed long-term campus development.", href: "/about/master-plan" },
  { title: "Academics", type: "Page", excerpt: "O-Level, A-Level, departments and academic performance.", href: "/academics" },
  { title: "O-Level", type: "Page", excerpt: "Ordinary Level education at Rubaare Secondary School.", href: "/academics/o-level" },
  { title: "A-Level", type: "Page", excerpt: "Advanced Level subjects and study information.", href: "/academics/a-level" },
  { title: "Departments", type: "Page", excerpt: "Academic departments and subject leadership.", href: "/academics/departments" },
  { title: "Academic Performance", type: "Page", excerpt: "Official UCE and UACE results.", href: "/academics/performance" },
  { title: "Admissions", type: "Page", excerpt: "Admissions guidance and school enquiries.", href: "/admissions" },
  { title: "How to Apply", type: "Page", excerpt: "Steps and documents for admission.", href: "/admissions/how-to-apply" },
  { title: "Requirements", type: "Page", excerpt: "Admission, uniform and boarding requirements.", href: "/admissions/requirements" },
  { title: "Fees & Documents", type: "Page", excerpt: "Current school fees and official documents.", href: "/admissions/fees-and-documents", keywords: "term iii term 3 school fees circular" },
  { title: "Frequently Asked Questions", type: "Page", excerpt: "Common admissions questions and answers.", href: "/admissions/faqs", keywords: "FAQs" },
  { title: "School Life", type: "Page", excerpt: "Sport, faith, boarding and learner community life.", href: "/school-life" },
  { title: "News", type: "Page", excerpt: "Official school news and updates.", href: "/news" },
  { title: "Events", type: "Page", excerpt: "Confirmed school programme dates.", href: "/events", keywords: "career day visiting day term iii term 3" },
  { title: "Announcements", type: "Page", excerpt: "Official school notices and important updates.", href: "/announcements" },
  { title: "Gallery", type: "Page", excerpt: "Official school photographs and gallery albums.", href: "/gallery" },
  { title: "Downloads", type: "Page", excerpt: "Admission packs, fees, circulars and documents.", href: "/downloads" },
  { title: "Contact", type: "Page", excerpt: "Telephone, email, location and contact form.", href: "/contact" },
];

export function normaliseQuery(value: string | undefined): string {
  return value?.trim().replace(/\s+/g, " ").slice(0, 80) ?? "";
}

export function filterSearchResults(results: ReadonlyArray<SearchResult>, query: string): ReadonlyArray<SearchResult> {
  const terms = normaliseQuery(query).toLowerCase().split(" ").filter(Boolean);
  if (terms.length === 0) return [];

  return results.filter((result) => {
    const haystack = `${result.title} ${result.type} ${result.excerpt} ${result.keywords ?? ""}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
