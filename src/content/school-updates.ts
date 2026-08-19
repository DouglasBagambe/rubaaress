export const termTwoClosingUpdate = {
  title: "Rubaare SS Issues Term II Closing Circular and Term III 2026 Programme",
  slug: "term-ii-2026-closing-circular-term-iii-programme",
  excerpt:
    "Rubaare Secondary School closed Term II on 18 August 2026 and has published the confirmed Term III programme, current fees and development updates.",
  category: "School Update",
  publishedAt: "2026-08-18T12:00:00+03:00",
  author: "Rubaare Secondary School",
  featured: true,
  content: [
    "Term II 2026 ended on Tuesday 18 August 2026 at 2:00 PM. Learners returned home with their report cards, fee bills and parents' letters, which parents and guardians are encouraged to review carefully.",
    "Term III begins on Monday 14 September 2026. Confirmed programme dates include Beginning-of-Term examinations on 16 September, S.1 and S.2 Career's Day on 26 September, UCE Briefing on 8 October, Independence Day on 9 October, Visiting Day on 10 October, End-of-Term examinations from 19 to 27 November, and the end of term on 4 December 2026.",
    "The school held a thanksgiving for its strong UCE and UACE performance on 11 August 2026. The Bishop of South Ankole Diocese, Rt. Rev. Bishop Nathan Ahimbisibwe, officiated at the ceremony.",
    "In co-curricular activities, the boys' football team finished third at the District Ball Games II and qualified for the Ankole Zonal Games in Ibanda District. The girls also participated up to District level.",
    "The school water project and Junior Staff Quarters I are complete. Construction of a three-storeyed girls' dormitory was launched on 11 August 2026 to improve accommodation for girls.",
    "The complete official communication includes the Term III fee table, reporting requirements, academic information, welfare and discipline guidance, and the full school programme.",
  ].join("\n\n"),
  circularHref: "/downloads/communication-from-school-18-august-2026.pdf",
} as const;

export const termThreeAnnouncement = {
  title: "Term III 2026 Reporting",
  message:
    "Term III begins Monday 14 September 2026. Students should report between 8:00 AM and 5:00 PM. Please review the 18 August 2026 school circular for the complete programme, requirements and fees.",
  type: "general",
  publicationDate: "2026-08-18T12:00:00+03:00",
  expiryDate: "2026-09-15T23:59:59+03:00",
  priority: 1,
  ctaLabel: "Read the school update",
  ctaLink: `/news/${termTwoClosingUpdate.slug}`,
} as const;

export const termThreeEvents = [
  {
    title: "Term III Staff Meeting",
    slug: "term-iii-staff-meeting-2026",
    description: "The official Term III staff meeting.",
    startDate: "2026-09-13",
    category: "School Programme",
  },
  {
    title: "Beginning of Term III",
    slug: "beginning-of-term-iii-2026",
    description: "Students should report between 8:00 AM and 5:00 PM. Students arriving later should report with a parent.",
    startDate: "2026-09-14",
    category: "Academic Calendar",
  },
  {
    title: "Beginning-of-Term-III Examinations",
    slug: "beginning-of-term-iii-examinations-2026",
    description: "Beginning-of-Term-III examinations commence.",
    startDate: "2026-09-16",
    category: "Academics",
  },
  {
    title: "S.1 and S.2 Career's Day",
    slug: "s1-s2-careers-day-2026",
    description: "Parents and guardians are requested to attend so the school and families can plan and advise learners together.",
    startDate: "2026-09-26",
    category: "School Programme",
  },
  {
    title: "UCE Briefing",
    slug: "uce-briefing-2026",
    description: "Official UCE briefing for candidates.",
    startDate: "2026-10-08",
    category: "Academics",
  },
  {
    title: "Independence Day",
    slug: "independence-day-2026",
    description: "Uganda Independence Day in the Term III programme.",
    startDate: "2026-10-09",
    category: "Public Holiday",
  },
  {
    title: "Visiting Day",
    slug: "visiting-day-term-iii-2026",
    description: "Parents and guardians should bring the student's visiting card with the required parent and student passport photographs attached.",
    startDate: "2026-10-10",
    category: "School Programme",
  },
  {
    title: "End-of-Term-III Examinations",
    slug: "end-of-term-iii-examinations-2026",
    description: "The official End-of-Term-III examination period.",
    startDate: "2026-11-19",
    endDate: "2026-11-27",
    category: "Academics",
  },
  {
    title: "End of Term III",
    slug: "end-of-term-iii-2026",
    description: "Term III 2026 ends.",
    startDate: "2026-12-04",
    category: "Academic Calendar",
  },
] as const;

export const termThreeFees = [
  { className: "S.1", day: 291000, boarding: 434000 },
  { className: "S.2", day: 291000, boarding: 434000 },
  { className: "S.3", day: 291000, boarding: 434000 },
  { className: "S.4", day: 298000, boarding: 441000 },
  { className: "S.5", day: 325000, boarding: 468000 },
  { className: "S.6", day: 325000, boarding: 468000 },
] as const;

export const termThreeAdditionalFees = [
  ["S.4, S.5 and S.6 remedial lessons", 25000],
  ["S.3 remedial lessons", 20000],
  ["Computer maintenance — every student", 10000],
  ["South Ankole Diocese promotional examinations — S.3 and S.5", 35000],
] as const;
