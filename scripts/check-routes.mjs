const baseUrl = process.env.ROUTE_CHECK_BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/about",
  "/about/history",
  "/about/mission-vision",
  "/about/headteacher",
  "/about/leadership",
  "/about/facilities",
  "/about/master-plan",
  "/academics",
  "/academics/o-level",
  "/academics/a-level",
  "/academics/departments",
  "/academics/performance",
  "/academics/results",
  "/admissions",
  "/admissions/how-to-apply",
  "/admissions/requirements",
  "/admissions/fees-and-documents",
  "/admissions/faqs",
  "/school-life",
  "/school-life/sports",
  "/school-life/clubs",
  "/school-life/student-leadership",
  "/school-life/spiritual-life",
  "/news",
  "/news/term-ii-2026-closing-circular-term-iii-programme",
  "/events",
  "/announcements",
  "/gallery",
  "/gallery/academics",
  "/downloads",
  "/school-calendar",
  "/contact",
  "/search?q=admissions",
  "/search?q=term+iii",
  "/search?q=headteacher",
  "/privacy",
  "/accessibility",
  "/sitemap.xml",
  "/robots.txt",
  "/downloads/communication-from-school-18-august-2026.pdf",
  "/studio",
];

const failures = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`, { method: "HEAD" });
  const ok = response.status >= 200 && response.status < 400;
  console.log(`${response.status} ${route}`);
  if (!ok) failures.push(`${response.status} ${route}`);
}

if (failures.length) {
  console.error(`Route check failed:\n${failures.join("\n")}`);
  process.exitCode = 1;
}
