export const officialAboutPreamble = [
  "Rubaare Secondary School is located in Akatojo Ward, Rushenyi County, Rubaare Town Council, Ntungamo District, approximately 1½ kilometres off the Kabale-Mbarara Road.",
  "The school originally began as a girls' school but later became a mixed school in response to growing enrolment and public demand, opening its doors to both boys and girls.",
  "Rubaare Secondary School was founded by the Church of Uganda, while welcoming students from all religious backgrounds. The school offers both O-Level and A-Level education, with day and boarding programmes available. Students are offered a broad academic programme covering both Arts and Sciences.",
] as const;

export const verifiedEnrolment = {
  academicYear: "2026",
  reportingDate: "2026-07-27",
  reportingDateLabel: "27 July 2026",
  headline: { grandTotal: 1418, totalFemale: 803, totalMale: 615, totalBoarding: 1066, totalDay: 352 },
  detailedRows: [
    ["S.1", "East", 34, 58, 92], ["S.1", "West", 34, 56, 90], ["S.1", "North", 41, 49, 90], ["S.1", "Subtotal", 109, 163, 272],
    ["S.2", "East", 37, 46, 83], ["S.2", "West", 33, 56, 89], ["S.2", "North", 38, 51, 89], ["S.2", "Subtotal", 108, 153, 261],
    ["S.3", "East", 35, 48, 83], ["S.3", "West", 34, 41, 75], ["S.3", "North", 40, 42, 82], ["S.3", "Subtotal", 109, 131, 240],
    ["S.4", "East", 38, 60, 98], ["S.4", "West", 44, 50, 94], ["S.4", "North", 37, 60, 97], ["S.4", "Subtotal", 119, 170, 289],
    ["S.5", "Arts", 36, 49, 85], ["S.5", "Sciences", 67, 66, 133], ["S.5", "Subtotal", 103, 115, 218],
    ["S.6", "Arts", 31, 44, 75], ["S.6", "Sciences", 46, 27, 73], ["S.6", "Subtotal", 77, 71, 148],
  ].map(([className, stream, male, female, total]) => ({ className: String(className), stream: String(stream), male: Number(male), female: Number(female), total: Number(total) })),
  boardingDayRows: [
    ["S.1", 69, 105, 174, 43, 59, 102], ["S.2", 68, 104, 172, 46, 45, 91],
    ["S.3", 66, 98, 164, 49, 34, 83], ["S.4", 87, 156, 243, 26, 10, 36],
    ["S.5", 77, 105, 182, 19, 6, 25], ["S.6", 62, 69, 131, 12, 3, 15],
  ].map(([className, boarderBoys, boarderGirls, boarderTotal, dayBoys, dayGirls, dayTotal]) => ({
    className: String(className), boarderBoys: Number(boarderBoys), boarderGirls: Number(boarderGirls), boarderTotal: Number(boarderTotal), dayBoys: Number(dayBoys), dayGirls: Number(dayGirls), dayTotal: Number(dayTotal),
  })),
  boardingDayTotals: { boarderBoys: 429, boarderGirls: 637, boarding: 1066, dayBoys: 195, dayGirls: 157, day: 352 },
} as const;

export const seniorAdministration = [
  ["Mr. Bangirana Robert Bob", "1st Deputy"], ["Mr. Karamuzi Onesmus", "2nd Deputy"],
  ["Ms. Marion Namara", "Deputy in Charge of Academics and School Chaplain"], ["Mr. Bahikire", "Director of Studies (DOS)"],
  ["Mr. Ainomugisha Julius", "DOS O-Level"], ["Mr. Bamanya Julius", "Senior Man"],
  ["Ms. Ahairwe Annet", "Senior Woman"], ["Mr. Muhimbise Pidson", "Project Master"],
] as const;

export const subjectHeads = [
  ["Mr. Tugume Simon Peter", "English/Literature"], ["Ms. Agasha Jescah", "Mathematics"], ["Mr. Atukwatse Moses", "Physics"],
  ["Mr. Nahwera Seth", "Biology"], ["Mr. Mutaremwa Andrew", "Chemistry"], ["Mr. Tindyebwa Mathias", "Geography"],
  ["Mr. Asiimwe William", "History"], ["Ms. Twesigye Edith", "Kiswahili"], ["Mr. Naturinda Richard", "CRE"],
  ["Mr. Muhimbise Pidson", "Agriculture"], ["Ms. Natukunda Babrah Phionah", "Business Studies"], ["Mr. Bajunwe Joab", "Fine Art"],
  ["Mr. Byenyonyozi Lauben", "Computer Studies"], ["Mr. Namanya Sycus", "Runyankole Rukiga"], ["Mr. Barijunaki Crescent", "Physical Education"],
] as const;

export const classTeachers = [
  ["Mr. Atukwatse Moses", "S.6 Sciences"], ["Mr. Tugume Simon Peter", "S.6 Arts"], ["Mr. Tindyebwa Mathias", "S.5 Arts"],
  ["Mr. Mutaremwa Andrew", "S.5 Sciences"], ["Mr. Tugume Geoffrey Amooti", "S.4E"], ["Ms. Twesigye Edith", "S.4N"],
  ["Mr. Ainembeabazi Lincoline", "S.4W"], ["Mr. Mudusu Elvis", "S.3W"], ["Ms. Natukunda Babrah Phionah", "S.3N"],
  ["Mr. Tumuhairwe Alban", "S.3E"], ["Mr. Kanyesigye Denis", "S.2N"], ["Ms. Kansiime Kellen", "S.2E"],
  ["Mr. Tumukunde Lawrence", "S.2W"], ["Mr. Twinomujuni Moses", "S.1N"], ["Mr. Biryahabwe Rogers", "S.1E"], ["Ms. Uwimaana Harima", "S.1W"],
] as const;

export const hostelLeadership = [
  ["Mr. Bangirana Robert Bob", "Overall Hostel Co-ordinator"], ["Ms. Atuhaire Hildah", "Ethiopia & Uganda Hostel Mistress"],
  ["Ms. Asiimwe Joan", "Kenya & Tanzania Hostel Mistress"], ["Ms. Arieriwe Annet", "Ghana"],
  ["Mr. Muhimbise Pidson", "London Hostel Teacher"], ["Mr. Tugume Geoffrey Amooti", "Boston Hostel Teacher"],
  ["Mr. Tumuhairwe Alban", "New York"], ["Mr. Mudusu Elvis", "New York"],
] as const;

export const timetableTeachers = ["Mr. Mugisha Jonan Agyeman", "Mr. Ainomugisha Julius"] as const;
export const careersMasters = ["Mr. Ainomugisha Julius", "Mr. Bajunwe Joab"] as const;

export const aLevelSubjects = ["Literature", "Divinity", "History", "Geography", "Economics", "Kiswahili", "Computer Studies", "Mathematics", "Biology", "Entrepreneurship", "Fine Art", "Agriculture", "Chemistry", "Runyankore/Rukiga", "Sub-Mathematics", "Physics"] as const;

export const academicResults = {
  uce: {
    grades: [{ year: 2025, A: 77, B: 658, C: 1688, D: 136, E: 0 }, { year: 2024, A: 26, B: 283, C: 811, D: 442, E: 23 }],
    classifications: [{ year: 2025, result1: 257, result2: 0, result3: 0, result4: 0 }, { year: 2024, result1: 176, result2: 0, result3: 0, result4: 0 }],
  },
  uace2025: { total: 132, universityQualified: 86, diplomaQualified: 33, points: [[16,1],[15,4],[14,4],[13,3],[12,13],[11,18],[10,11],[9,14],[8,18],[7,15],[6,10],[5,9],[4,7],[3,4],[2,1],[1,0],[0,0]] },
  uaceComparison: {
    points: [19,18,17,16,15,14,13,12,11,10,9,8,7,6,5],
    rows: [{ year: 2025, counts: [0,0,0,1,4,4,3,13,18,11,14,18,15,10,9] }, { year: 2024, counts: [1,0,1,4,4,5,15,13,23,18,17,18,7,10,8] }],
  },
} as const;

export const fees = {
  s1: {
    label: "S1 — Term 1 2026", rows: [["PTA contribution",362000,221000],["Chaplaincy",8000,8000],["Book fund",6000,6000],["ASSHU Ntungamo",1500,1500],["UNSA",2000,2000],["Sanitation",5000,3000],["SESEMAT",1000,1000],["Development",35000,35000],["Internet charges",1500,1500],["Project/practicals",10000,10000],["Bank charges",2000,2000]], total: [434000,291000],
  },
  s5: {
    label: "S5 — Term 1 2026", rows: [["PTA contribution",392000,251000],["Chaplaincy",8000,8000],["Book fund",20000,20000],["ASSHU Ntungamo",1500,1500],["SESEMAT",1000,1000],["Sanitation",5000,3000],["Development fund",35000,35000],["Internet charge",1500,1500],["Bank charges",2000,2000],["UNSA",2000,2000]], total: [468000,325000],
  },
} as const;

export type PublicDownload = { title: string; category: string; href: string; description: string; size: string };
export const publicDownloads: ReadonlyArray<PublicDownload> = [
  { title: "O-Level Admission Pack 2026", category: "Admission Packs", href: "/downloads/o-level-admission-pack-2026.pdf", description: "Complete O-Level admission letter, rules, forms, fees and requirements.", size: "185 KB" },
  { title: "A-Level Admission Pack 2026", category: "Admission Packs", href: "/downloads/a-level-admission-pack-2026.pdf", description: "Complete A-Level admission letter, rules, forms, fees and requirements.", size: "170 KB" },
  { title: "O-Level Admission Letter 2026", category: "Admissions", href: "/downloads/o-level-admission-letter-2026.pdf", description: "Official O-Level reporting and admission information.", size: "108 KB" },
  { title: "A-Level Admission Letter 2026", category: "Admissions", href: "/downloads/a-level-admission-letter-2026.pdf", description: "Official A-Level reporting and admission information.", size: "106 KB" },
  { title: "School Rules and Regulations", category: "Policies & Forms", href: "/downloads/school-rules-and-regulations.pdf", description: "School rules for students and parents or guardians.", size: "80 KB" },
  { title: "S1 Student Information Card", category: "Policies & Forms", href: "/downloads/s1-student-information-card.pdf", description: "Student information form for Senior One entrants.", size: "56 KB" },
  { title: "A-Level Student Information Card", category: "Policies & Forms", href: "/downloads/a-level-student-information-card.pdf", description: "Student information form for A-Level entrants.", size: "61 KB" },
  { title: "S1 Fees — Term 1 2026", category: "Fees & Requirements", href: "/downloads/s1-fees-term-1-2026.pdf", description: "Official Term 1 fee schedule for S1 boarders and day scholars.", size: "71 KB" },
  { title: "S5 Fees — Term 1 2026", category: "Fees & Requirements", href: "/downloads/s5-fees-term-1-2026.pdf", description: "Official Term 1 fee schedule for S5 boarders and day scholars.", size: "69 KB" },
  { title: "S1 Other Requirements", category: "Fees & Requirements", href: "/downloads/s1-other-requirements.pdf", description: "Official Senior One uniform and additional requirements.", size: "78 KB" },
  { title: "Boarding/Hostel Requirements 2026", category: "Fees & Requirements", href: "/downloads/boarding-hostel-requirements-2026.pdf", description: "Official class, uniform and dormitory requirements.", size: "85 KB" },
  { title: "UCE & UACE 2025 Academic Results", category: "Academic Results", href: "/downloads/academic-results-uce-uace-2025.pdf", description: "Official 2025 UCE and UACE results summary with comparison data.", size: "91 KB" },
] as const;
