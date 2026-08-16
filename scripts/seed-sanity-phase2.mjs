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
const headteacher = await uploadImage("headteacher", "images/school/leadership/headteacher-ms-mpeirwe-monic-atukunda.webp", "Headteacher Ms. Mpeirwe Monic Atukunda seated at her desk.");

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
      heading: "Discipline, Service and Community",
      text: "School life brings together academics, leadership, clubs, sports and shared responsibility.",
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
  headteacherName: "Ms Monica Mpeirwe Atukunda",
  headteacherPhotograph: headteacher,
  headteacherMessage: "Welcome to Rubaare Secondary School. Our school community is committed to purposeful learning, discipline and the steady development of each learner.",
  academicPathwaysIntroduction: "Academic pathways guide learners through lower and advanced secondary study.",
  enrolmentSectionHeading: "Rubaare SS at a Glance",
  latestNewsHeading: "Latest News",
  eventsHeading: "Upcoming Events",
  schoolLifeFeature: "School life introduces learners to leadership, teamwork, service and community participation.",
  masterPlanPreview: "Rubaare Secondary School's master plan presents a long-term vision for the continued development of its learning environment, facilities and student experience.",
  admissionsCta: { label: "Admissions information", href: "/admissions" },
}));

results.push(await createIfMissing({
  _id: "enrolment-2026",
  _type: "enrolment",
  academicYear: "2026",
  reportingDate: "2026-03-16",
  status: "current",
  classRows: [
    { _type: "enrolmentClassRow", _key: "s1", className: "S.1", femaleDay: 59, femaleBoarding: 110, maleDay: 43, maleBoarding: 71 },
    { _type: "enrolmentClassRow", _key: "s2", className: "S.2", femaleDay: 43, femaleBoarding: 108, maleDay: 46, maleBoarding: 63 },
    { _type: "enrolmentClassRow", _key: "s3", className: "S.3", femaleDay: 35, femaleBoarding: 100, maleDay: 46, maleBoarding: 63 },
    { _type: "enrolmentClassRow", _key: "s4", className: "S.4", femaleDay: 10, femaleBoarding: 154, maleDay: 26, maleBoarding: 83 },
    { _type: "enrolmentClassRow", _key: "s5", className: "S.5", femaleDay: 5, femaleBoarding: 106, maleDay: 14, maleBoarding: 77 },
    { _type: "enrolmentClassRow", _key: "s6", className: "S.6", femaleDay: 2, femaleBoarding: 69, maleDay: 12, maleBoarding: 65 },
  ],
}));

console.log(`Seed complete: ${results.join(", ")}`);
