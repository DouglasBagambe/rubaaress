import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  academicPathways,
  downloads,
  findUs,
  heroSlides,
  images,
  latestNews,
  masterPlanItems,
  navigation,
  pageIntros,
  galleryAlbums,
  enrolmentRows,
  enrolmentTotals,
  schoolStats,
  upcomingEvents,
  utilityLinks,
} from "./site-data";
import { calculateEnrolment } from "./enrolment";
import { countMedia, filterGalleryAlbums, paginateGalleryMedia, sortGalleryMedia, validateExternalVideoUrl } from "./gallery";
import { checkRateLimit, sendPublicForm, validatePublicForm, type PublicFormInput } from "./forms";
import { corePageSearchResults, filterSearchResults, normaliseQuery } from "./search";
import { resolveAnnouncements, resolveDownloads, resolveEnrolment, resolveEvents, resolveGalleryIndex, resolveHomepage, resolveMasterPlan, resolveNewsArticles, resolveSiteSettings } from "@/sanity/content";
import type { ResolvedGalleryAlbum, ResolvedGalleryMedia } from "@/sanity/types";
import { publicDownloads, verifiedEnrolment } from "@/content/verified-school-content";
import { canonicalSiteUrl, websiteStructuredData } from "@/content/site";
import { termThreeEvents, termTwoClosingUpdate } from "@/content/school-updates";
import { staticRoutes } from "@/app/sitemap";

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}

test("navigation exposes grouped primary items", () => {
  assert.deepEqual(navigation.map((item) => item.label), [
    "Home",
    "About",
    "Academics",
    "Admissions",
    "School Life",
  ]);
});

test("main navigation avoids homepage hash links", () => {
  const links = navigation.flatMap((item) => [
    item.href,
    ...(item.groups?.flatMap((group) => group.items.map((child) => child.href)) ?? []),
  ]);

  assert.ok(links.every((href) => !href.startsWith("/#")));
});

test("content datasets remain CMS-ready and structured", () => {
  assert.equal(utilityLinks.length, 4);
  assert.equal(heroSlides.length, 3);
  assert.equal(academicPathways.length, 2);
  assert.equal(upcomingEvents.length, 9);
  assert.ok(masterPlanItems.length >= 6);
  assert.ok(galleryAlbums.every((album) => album.slug && album.coverImage && album.images.length > 0));
  assert.ok(schoolStats.every((stat) => stat.verificationStatus));
  assert.ok(latestNews.every((item) => item.slug && item.excerpt && item.featuredImage));
  assert.ok(downloads.every((item) => item.fileType === "PDF"));
});

test("all official images use local public school paths", () => {
  Object.values(images).forEach((image) => {
    assert.match(image.src, /^\/images\/school\//);
    assert.ok(image.alt.length > 20);
  });
});

test("all secondary pages have page introductions", () => {
  assert.deepEqual(Object.keys(pageIntros), [
    "about",
    "academics",
    "admissions",
    "schoolLife",
    "news",
    "events",
    "gallery",
    "downloads",
    "contact",
    "masterPlan",
  ]);
});

test("find us data uses Rubaare location and map URLs", () => {
  assert.equal(findUs.heading, "Find Rubaare Secondary School");
  assert.match(findUs.address, /Rubaare, Ntungamo District, Uganda/);
  assert.match(findUs.directionsHref, /^https:\/\/www\.google\.com\/maps/);
  assert.match(findUs.mapEmbedSrc, /^https:\/\/www\.google\.com\/maps/);
});

test("verified enrolment keeps the official headline and source tables distinct", () => {
  assert.equal(enrolmentRows.length, 6);
  assert.equal(enrolmentTotals.totalDay, 352);
  assert.equal(enrolmentTotals.totalBoarding, 1066);
  assert.equal(enrolmentTotals.grandTotal, 1418);
  assert.equal("totalFemale" in verifiedEnrolment.headline, false);
  assert.equal("totalMale" in verifiedEnrolment.headline, false);
  assert.deepEqual(verifiedEnrolment.unconfirmedGenderTotals, { totalFemale: 803, totalMale: 615 });
  assert.equal(verifiedEnrolment.detailedRows.length, 22);
  assert.equal(verifiedEnrolment.boardingDayRows.length, 6);
  assert.deepEqual(schoolStats.map((stat) => stat.label), ["Total Learners", "Boarding Learners", "Day Scholars"]);
  assert.ok(schoolStats.every((stat) => !/female|male/i.test(stat.label)));
  assert.equal(enrolmentRows.every((row) => row.femaleDay + row.femaleBoarding + row.maleDay + row.maleBoarding === row.total), true);
});

test("the approved public download library contains thirteen local PDFs", () => {
  assert.equal(publicDownloads.length, 13);
  assert.ok(publicDownloads.every((item) => item.href.startsWith("/downloads/") && item.href.endsWith(".pdf")));
});

test("site settings resolver keeps local fallback for empty Sanity strings", () => {
  const settings = resolveSiteSettings({
    schoolName: "  ",
    motto: "New motto",
    primaryTelephone: "",
  });

  assert.equal(settings.schoolName, "Rubaare Secondary School");
  assert.equal(settings.motto, "New motto");
  assert.equal(settings.primaryTelephone, "0772 923 571");
});

test("enrolment calculation handles malformed rows with warnings", () => {
  const result = calculateEnrolment([
    { className: "S.1", femaleDay: 1.5, femaleBoarding: -2, maleDay: 3, maleBoarding: 4 },
    { className: "S.1", femaleDay: 1, femaleBoarding: 2, maleDay: 3, maleBoarding: 4 },
  ]);

  assert.equal(result.totals.grandTotal, 17);
  assert.ok(result.warnings.some((warning) => warning.includes("non-negative integer")));
  assert.ok(result.warnings.some((warning) => warning.includes("Duplicate class name")));
});

test("current enrolment resolver selects the newest current record", () => {
  const enrolment = resolveEnrolment([
    {
      _id: "new",
      academicYear: "2027",
      reportingDate: "2027-03-16",
      status: "current",
      headline: { grandTotal: 10, totalBoarding: 6, totalDay: 4 },
      boardingDayRows: [{ className: "S.1", boarderBoys: 4, boarderGirls: 2, boarderTotal: 6, dayBoys: 3, dayGirls: 1, dayTotal: 4 }],
    },
    {
      _id: "old",
      academicYear: "2026",
      reportingDate: "2026-03-16",
      status: "current",
      classRows: [{ className: "S.1", femaleDay: 10, femaleBoarding: 20, maleDay: 30, maleBoarding: 40 }],
    },
  ]);

  assert.equal(enrolment.academicYear, "2027");
  assert.equal(enrolment.totals.grandTotal, 10);
  assert.deepEqual(enrolment.stats.map((stat) => stat.label), ["Total Learners", "Boarding Learners", "Day Scholars"]);
});

test("homepage resolver filters disabled hero slides and sorts enabled slides", () => {
  const homepage = resolveHomepage({
    heroSlides: [
      {
        _key: "disabled",
        heading: "Disabled",
        enabled: false,
        displayOrder: 0,
        image: { url: "https://cdn.sanity.io/images/9x78oq9t/production/example.jpg", alt: "Disabled slide image", dimensions: { width: 1200, height: 800 } },
      },
      {
        _key: "second",
        heading: "Second",
        text: "Second body",
        enabled: true,
        displayOrder: 2,
        image: { url: "https://cdn.sanity.io/images/9x78oq9t/production/second.jpg", alt: "Second slide image", dimensions: { width: 1200, height: 800 } },
      },
      {
        _key: "first",
        heading: "First",
        text: "First body",
        enabled: true,
        displayOrder: 1,
        image: { url: "https://cdn.sanity.io/images/9x78oq9t/production/first.jpg", alt: "First slide image", dimensions: { width: 1200, height: 800 } },
      },
    ],
  });

  assert.equal(homepage.heroSlides.length, 2);
  assert.equal(homepage.heroSlides[0]?.heading, "First");
  assert.equal(homepage.heroSlides[1]?.heading, "Second");
});

test("gallery helpers filter albums and exclude archived content", () => {
  const albums: ReadonlyArray<ResolvedGalleryAlbum> = [
    {
      id: "public",
      title: "Sports Day",
      slug: "sports-day",
      shortDescription: "Sports day photographs.",
      category: "Sports Day",
      academicYear: "2026",
      coverImage: images.sports,
      featured: true,
      published: true,
      visibility: "public",
      displayOrder: 1,
      photoCount: 3,
      videoCount: 1,
      mediaCount: 4,
    },
    {
      id: "archived",
      title: "Archived",
      slug: "archived",
      shortDescription: "Hidden album.",
      category: "Campus",
      coverImage: images.heroCampus,
      featured: false,
      published: true,
      visibility: "archived",
      displayOrder: 2,
      photoCount: 1,
      videoCount: 0,
      mediaCount: 1,
    },
  ];

  assert.deepEqual(filterGalleryAlbums(albums, { category: "Sports Day", type: "videos" }).map((album) => album.slug), ["sports-day"]);
  assert.equal(filterGalleryAlbums(albums, {}).some((album) => album.slug === "archived"), false);
});

test("gallery media ordering, counts and cursor pagination are stable", () => {
  const media: ReadonlyArray<ResolvedGalleryMedia> = [
    { id: "c", title: "C", albumSlug: "album", mediaType: "image", image: images.classroom, displayOrder: 2, featured: false },
    { id: "a", title: "A", albumSlug: "album", mediaType: "video", uploadedVideoUrl: "/video.mp4", displayOrder: 1, featured: false },
    { id: "b", title: "B", albumSlug: "album", mediaType: "image", image: images.sports, displayOrder: 1, featured: false },
  ];

  assert.deepEqual(sortGalleryMedia(media).map((item) => item.id), ["a", "b", "c"]);
  assert.deepEqual(countMedia(media), { photoCount: 2, videoCount: 1, mediaCount: 3 });
  assert.deepEqual(paginateGalleryMedia(media, undefined, 2).items.map((item) => item.id), ["a", "b"]);
  assert.deepEqual(paginateGalleryMedia(media, "b", 2).items.map((item) => item.id), ["c"]);
});

test("gallery URL validation accepts supported video providers only", () => {
  assert.equal(validateExternalVideoUrl("https://www.youtube.com/watch?v=abc"), true);
  assert.equal(validateExternalVideoUrl("https://youtu.be/abc"), true);
  assert.equal(validateExternalVideoUrl("https://vimeo.com/123"), true);
  assert.equal(validateExternalVideoUrl("https://example.com/video"), false);
});

test("gallery resolver preserves fallback albums and empty-caption behaviour", () => {
  const gallery = resolveGalleryIndex(null);

  assert.ok(gallery.albums.length > 0);
  assert.ok(gallery.albums.every((album) => album.published && album.visibility === "public"));
  assert.equal(gallery.albums[0]?.mediaCount, gallery.albums[0]?.photoCount);
});

test("event resolver classifies upcoming and past events by date", () => {
  const events = resolveEvents(
    [
      { _id: "past", title: "Past", startDateTime: "2026-01-01T08:00:00Z" },
      { _id: "future", title: "Future", startDateTime: "2026-12-01T08:00:00Z" },
    ],
    new Date("2026-08-01T00:00:00Z"),
  );

  assert.ok(events.upcoming.some((event) => event.title === "Future"));
  assert.ok(events.past.some((event) => event.title === "Past"));
});

test("event resolver excludes undated and cancelled entries without inventing venues", () => {
  const events = resolveEvents(
    [
      { _id: "undated", title: "Undated", eventStatus: "scheduled" },
      { _id: "cancelled", title: "Cancelled", startDateTime: "2026-12-01", eventStatus: "cancelled" },
      { _id: "future", title: "Future", slug: "future", startDateTime: "2026-12-02", eventStatus: "scheduled" },
    ],
    new Date("2026-08-19T00:00:00Z"),
  );

  assert.ok(!events.upcoming.some((event) => event.title === "Undated"));
  assert.ok(!events.upcoming.some((event) => event.title === "Cancelled"));
  assert.ok(events.upcoming.some((event) => event.title === "Future"));
  assert.equal(events.upcoming.find((event) => event.title === "Future")?.venue, undefined);
});

test("verified Term III events contain dates and exclude unconfirmed programme items", () => {
  assert.ok(termThreeEvents.every((event) => event.startDate));
  assert.ok(!termThreeEvents.some((event) => /farewell|dedication/i.test(event.title)));
});

test("news resolver uses full article bodies and filters process content", () => {
  const articles = resolveNewsArticles([
    { _id: "real", title: "Real school update", slug: "real-school-update", excerpt: "Short list excerpt.", plainBody: "Complete verified article body.", publishedAt: "2026-08-18T12:00:00+03:00" },
    { _id: "process", title: "Website team migration", slug: "process", excerpt: "Prepared for confirmation." },
  ]);

  assert.equal(articles.find((article) => article.slug === "real-school-update")?.content, "Complete verified article body.");
  assert.ok(!articles.some((article) => article.slug === "process"));
  assert.ok(articles.some((article) => article.slug === termTwoClosingUpdate.slug));
});

test("announcement and download resolvers keep clean public shapes", () => {
  const announcements = resolveAnnouncements([{ _id: "notice", title: "Notice", message: "Term opens soon.", type: "general", priority: 1 }]);
  const resolvedDownloads = resolveDownloads([{ _id: "form", title: "Admission Form", category: "Admissions", fileType: "pdf", fileSize: 2048, publicationDate: "2026-08-01", fileUrl: "https://cdn.sanity.io/files/9x78oq9t/production/form.pdf" }]);

  assert.equal(announcements[0]?.message, "Term opens soon.");
  const admissionForm = resolvedDownloads.find((item) => item.title === "Admission Form");
  assert.equal(admissionForm?.fileType, "PDF");
  assert.equal(admissionForm?.fileSize, "2 KB");
});

test("master plan resolver preserves fallback image metadata", () => {
  const masterPlan = resolveMasterPlan(null);

  assert.equal(masterPlan.items[0]?.id, masterPlanItems[0]?.id);
  assert.ok(masterPlan.items.every((item) => item.title && item.caption));
});

test("search normalises queries and filters public results", () => {
  const results = filterSearchResults(
    [
      { title: "Sports Day", type: "Gallery album", excerpt: "Student sports media", href: "/gallery/sports-day" },
      { title: "Admissions", type: "Page", excerpt: "How to apply", href: "/admissions" },
    ],
    "  sports   day  ",
  );

  assert.equal(normaliseQuery("  admissions   forms "), "admissions forms");
  assert.deepEqual(results.map((item) => item.href), ["/gallery/sports-day"]);
});

test("site search covers core pages and the Term III circular", () => {
  assert.ok(filterSearchResults(corePageSearchResults, "headteacher").some((item) => item.href === "/about/headteacher"));
  assert.ok(filterSearchResults(corePageSearchResults, "term 3").some((item) => item.href === "/admissions/fees-and-documents"));
  assert.ok(filterSearchResults(corePageSearchResults, "visiting day").some((item) => item.href === "/events"));
});

test("homepage site-name data uses the HTTPS apex and preferred school name", () => {
  assert.equal(canonicalSiteUrl, "https://rubaaress.sc.ug");
  assert.equal(websiteStructuredData.name, "Rubaare Secondary School");
  assert.equal(websiteStructuredData.url, "https://rubaaress.sc.ug/");
  assert.deepEqual(websiteStructuredData.alternateName, ["Rubaare SS", "rubaaress.sc.ug"]);
});

test("homepage source places the Headteacher section before the Master Plan section", () => {
  const homepageSource = readFileSync(new URL("../app/(site)/page.tsx", import.meta.url), "utf8");
  assert.ok(homepageSource.indexOf("homepage.headteacher.eyebrow") < homepageSource.indexOf("homepage.masterPlanPreview.eyebrow"));
});

test("sitemap static routes exclude private, search and redirect-only paths", () => {
  assert.ok(!staticRoutes.some((route) => route.startsWith("/studio") || route.startsWith("/api") || route.startsWith("/search")));
  assert.ok(!staticRoutes.includes("/school-calendar"));
  assert.ok(!staticRoutes.includes("/academics/results"));
});

test("public form validation rejects spam and accepts clean contact input", () => {
  const spam = new FormData();
  spam.set("kind", "contact");
  spam.set("website", "https://spam.example");
  assert.equal(validatePublicForm(spam).ok, false);

  const clean = new FormData();
  clean.set("kind", "contact");
  clean.set("fullName", "Jane Parent");
  clean.set("email", "JANE@example.com");
  clean.set("subject", "Admissions question");
  clean.set("message", "Please share the admissions process.");
  clean.set("consent", "on");
  clean.set("startedAt", String(Date.now() - 5000));

  const result = validatePublicForm(clean);
  assert.equal(result.ok, true);
  assert.equal(result.cleaned?.email, "jane@example.com");
});

test("rate limiting blocks repeated submissions", () => {
  const key = `test-${Date.now()}`;
  assert.equal(checkRateLimit(key, 2, 10000), true);
  assert.equal(checkRateLimit(key, 2, 10000), true);
  assert.equal(checkRateLimit(key, 2, 10000), false);
});

test("public form sender keeps development fallback when email is unconfigured", async () => {
  const originalProvider = process.env.FORM_EMAIL_PROVIDER;
  const originalTo = process.env.FORM_TO_EMAIL;
  const originalFrom = process.env.FORM_FROM_EMAIL;
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.FORM_EMAIL_PROVIDER;
  delete process.env.FORM_TO_EMAIL;
  delete process.env.FORM_FROM_EMAIL;
  delete process.env.RESEND_API_KEY;

  const input: PublicFormInput = {
    kind: "contact",
    fullName: "Jane Parent",
    email: "jane@example.com",
    subject: "Admissions question",
    message: "Please share the admissions process.",
    consent: true,
  };

  assert.equal(await sendPublicForm(input), "logged");

  restoreEnv("FORM_EMAIL_PROVIDER", originalProvider);
  restoreEnv("FORM_TO_EMAIL", originalTo);
  restoreEnv("FORM_FROM_EMAIL", originalFrom);
  restoreEnv("RESEND_API_KEY", originalKey);
});

test("public form sender rejects unsupported configured providers", async () => {
  const originalProvider = process.env.FORM_EMAIL_PROVIDER;
  const originalTo = process.env.FORM_TO_EMAIL;
  const originalFrom = process.env.FORM_FROM_EMAIL;
  const originalKey = process.env.RESEND_API_KEY;
  process.env.FORM_EMAIL_PROVIDER = "smtp";
  process.env.FORM_TO_EMAIL = "rubaaress2012@gmail.com";
  process.env.FORM_FROM_EMAIL = "Rubaare SS Website <onboarding@resend.dev>";
  process.env.RESEND_API_KEY = "test_key";

  const input: PublicFormInput = {
    kind: "admissions",
    fullName: "Jane Parent",
    email: "jane@example.com",
    intendedLevel: "O-Level",
    message: "Please share the admissions process.",
    consent: true,
  };

  await assert.rejects(sendPublicForm(input), /Email provider is not configured/);

  restoreEnv("FORM_EMAIL_PROVIDER", originalProvider);
  restoreEnv("FORM_TO_EMAIL", originalTo);
  restoreEnv("FORM_FROM_EMAIL", originalFrom);
  restoreEnv("RESEND_API_KEY", originalKey);
});
