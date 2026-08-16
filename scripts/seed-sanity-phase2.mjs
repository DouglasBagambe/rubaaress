import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

readEnvFile(path.join(root, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-01";

if (!projectId) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID before running this seed.");
  process.exit(1);
}

const client = getCliClient({ apiVersion }).withConfig({ projectId, dataset, useCdn: false });

async function uploadImage(id, relativePath, alt) {
  const filePath = path.join(root, "public", relativePath);
  const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
    label: alt,
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

async function createIfMissing(document) {
  const existing = await client.getDocument(document._id);
  if (existing) {
    console.warn(`Skipped ${document._id}: document already exists.`);
    return "skipped";
  }
  await client.create(document);
  console.log(`Created ${document._id}`);
  return "created";
}

const badge = await uploadImage("badge", "images/school/brand/rubaare-school-badge.jpg", "Rubaare Secondary School badge.");
const heroCampus = await uploadImage("hero-campus", "images/school/students/student-assembly.webp", "Rubaare Secondary School students seated outdoors during a school gathering.");
const classroom = await uploadImage("classroom", "images/school/academics/classroom-learning.webp", "Rubaare Secondary School students in a classroom lesson.");
const compound = await uploadImage("compound", "images/school/campus/school-compound.webp", "A landscaped compound at Rubaare Secondary School.");
const headteacher = await uploadImage("headteacher", "images/school/leadership/headteacher-mpeirwe-monic-atukunda.jpg", "Headteacher Ms. Mpeirwe Monic Atukunda wearing glasses and seated at her desk.");

const results = [];

results.push(await createIfMissing({
  _id: "siteSettings",
  _type: "siteSettings",
  schoolName: "Rubaare Secondary School",
  shortSchoolName: "Rubaare SS",
  motto: "Rise and Shine",
  mission: "To provide equitable, affordable and quality education.",
  vision: "To provide educated and responsible citizens for self and community improvement.",
  badge,
  primaryTelephone: "0772 923 571",
  email: "rubaaress2012@gmail.com",
  postalAddress: "P.O. Box 65, Ntungamo",
  physicalLocation: "Rubaare, Ntungamo District, Uganda",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rubaare+Secondary+School+Ntungamo+Uganda",
  googleMapsEmbedUrl: "https://www.google.com/maps?q=Rubaare%20Secondary%20School%20Ntungamo%20Uganda&output=embed",
  footerIntroduction: "A mixed day and boarding secondary school serving learners in Rubaare, Ntungamo District.",
  copyrightText: "Copyright 2026 Rubaare Secondary School.",
}));

results.push(await createIfMissing({
  _id: "homepage",
  _type: "homepage",
  heroSlides: [
    {
      _type: "heroSlide",
      _key: "welcome",
      internalTitle: "Welcome",
      eyebrow: "Welcome to Rubaare Secondary School",
      heading: "Learning, Character and Opportunity",
      text: "A mixed day and boarding secondary school serving learners in Rubaare, Ntungamo District.",
      image: compound,
      primaryCtaLabel: "Explore Our School",
      primaryCtaUrl: "/about",
      secondaryCtaLabel: "Admissions",
      secondaryCtaUrl: "/admissions",
      displayOrder: 0,
      enabled: true,
    },
    {
      _type: "heroSlide",
      _key: "academics",
      internalTitle: "Academics",
      eyebrow: "Academic Pathways",
      heading: "O-Level and A-Level Preparation",
      text: "A structured secondary-school environment for classroom learning, learner support and academic progression.",
      image: classroom,
      primaryCtaLabel: "View Academics",
      primaryCtaUrl: "/academics",
      secondaryCtaLabel: "Departments",
      secondaryCtaUrl: "/academics/departments",
      displayOrder: 1,
      enabled: true,
    },
    {
      _type: "heroSlide",
      _key: "school-life",
      internalTitle: "School Life",
      eyebrow: "School Life",
      heading: "Learning and Community",
      text: "Day and boarding learners share academic, sporting, faith and community life.",
      image: heroCampus,
      primaryCtaLabel: "School Life",
      primaryCtaUrl: "/school-life",
      secondaryCtaLabel: "Gallery",
      secondaryCtaUrl: "/gallery",
      displayOrder: 2,
      enabled: true,
    },
  ],
  welcomeHeading: "A secondary-school community in Rubaare, Ntungamo District.",
  welcomeIntroduction: "To provide equitable, affordable and quality education. To provide educated and responsible citizens for self and community improvement.",
  headteacherName: "Ms. Mpeirwe Monic Atukunda",
  headteacherPhotograph: headteacher,
  headteacherMessage: "Rubaare Secondary School is led by Headteacher Ms. Mpeirwe Monic Atukunda, supported by the senior administration and academic leadership team.",
  academicPathwaysIntroduction: "Academic pathways guide learners through lower and advanced secondary study.",
  enrolmentSectionHeading: "Rubaare SS at a Glance",
  latestNewsHeading: "Latest News",
  eventsHeading: "Upcoming Events",
  schoolLifeFeature: "Day and boarding learners share academic, sporting, faith and community life.",
  masterPlanPreview: "Rubaare Secondary School's master plan presents a long-term vision for the continued development of its learning environment, facilities and student experience.",
  admissionsCta: { label: "Admissions information", href: "/admissions" },
}));

results.push(await createIfMissing({
  _id: "enrolment-2026",
  _type: "enrolment",
  academicYear: "2026",
  reportingDate: "2026-07-27",
  status: "current",
  headline: { grandTotal: 1418, totalBoarding: 1066, totalDay: 352 },
  detailedRows: [
    ["s1e","S.1","East",34,58,92], ["s1w","S.1","West",34,56,90], ["s1n","S.1","North",41,49,90], ["s1t","S.1","Subtotal",109,163,272],
    ["s2e","S.2","East",37,46,83], ["s2w","S.2","West",33,56,89], ["s2n","S.2","North",38,51,89], ["s2t","S.2","Subtotal",108,153,261],
    ["s3e","S.3","East",35,48,83], ["s3w","S.3","West",34,41,75], ["s3n","S.3","North",40,42,82], ["s3t","S.3","Subtotal",109,131,240],
    ["s4e","S.4","East",38,60,98], ["s4w","S.4","West",44,50,94], ["s4n","S.4","North",37,60,97], ["s4t","S.4","Subtotal",119,170,289],
    ["s5a","S.5","Arts",36,49,85], ["s5s","S.5","Sciences",67,66,133], ["s5t","S.5","Subtotal",103,115,218],
    ["s6a","S.6","Arts",31,44,75], ["s6s","S.6","Sciences",46,27,73], ["s6t","S.6","Subtotal",77,71,148],
  ].map(([_key, className, stream, male, female, total]) => ({ _type: "detailedEnrolmentRow", _key, className, stream, male, female, total })),
  boardingDayRows: [
    ["s1","S.1",69,105,174,43,59,102], ["s2","S.2",68,104,172,46,45,91], ["s3","S.3",66,98,164,49,34,83],
    ["s4","S.4",87,156,243,26,10,36], ["s5","S.5",77,105,182,19,6,25], ["s6","S.6",62,69,131,12,3,15],
  ].map(([_key, className, boarderBoys, boarderGirls, boarderTotal, dayBoys, dayGirls, dayTotal]) => ({ _type: "boardingDayEnrolmentRow", _key, className, boarderBoys, boarderGirls, boarderTotal, dayBoys, dayGirls, dayTotal })),
}));

console.log(`Seed complete: ${results.join(", ")}`);
