import assert from "node:assert/strict";
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

test("navigation exposes grouped primary items", () => {
  assert.deepEqual(navigation.map((item) => item.label), [
    "Home",
    "About",
    "Academics",
    "Admissions",
    "Student Life",
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
  assert.equal(upcomingEvents.length, 0);
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

test("verified enrolment totals are calculated from class rows", () => {
  assert.equal(enrolmentRows.length, 6);
  assert.equal(enrolmentTotals.totalFemale, 801);
  assert.equal(enrolmentTotals.totalMale, 609);
  assert.equal(enrolmentTotals.totalDay, 341);
  assert.equal(enrolmentTotals.totalBoarding, 1069);
  assert.equal(enrolmentTotals.grandTotal, 1410);
  assert.equal(enrolmentRows.every((row) => row.femaleDay + row.femaleBoarding + row.maleDay + row.maleBoarding === row.total), true);
});
