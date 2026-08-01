import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "@/sanity/env";

const singletonTypes = new Set(["siteSettings", "navigationSettings", "homepage", "admissionsContent", "masterPlan"]);

function singletonItem(S: Parameters<StructureResolver>[0], title: string, schemaType: string) {
  return S.listItem()
    .title(title)
    .id(schemaType)
    .schemaType(schemaType)
    .child(S.document().schemaType(schemaType).documentId(schemaType).title(title));
}

function gallerySection(S: Parameters<StructureResolver>[0]) {
  return S.listItem()
    .title("Gallery")
    .child(
      S.list()
        .title("Gallery")
        .items([
          S.documentTypeListItem("galleryAlbum").title("Albums"),
          S.documentTypeListItem("galleryMedia").title("Media"),
          S.listItem()
            .title("Draft Albums")
            .schemaType("galleryAlbum")
            .child(S.documentTypeList("galleryAlbum").title("Draft Albums").filter('_type == "galleryAlbum" && published != true').apiVersion(apiVersion)),
          S.listItem()
            .title("Featured Albums")
            .schemaType("galleryAlbum")
            .child(S.documentTypeList("galleryAlbum").title("Featured Albums").filter('_type == "galleryAlbum" && featured == true && published == true && visibility == "public"').apiVersion(apiVersion)),
          S.listItem()
            .title("Archived Albums")
            .schemaType("galleryAlbum")
            .child(S.documentTypeList("galleryAlbum").title("Archived Albums").filter('_type == "galleryAlbum" && visibility == "archived"').apiVersion(apiVersion)),
          S.listItem()
            .title("Media Missing Alt Text")
            .schemaType("galleryMedia")
            .child(S.documentTypeList("galleryMedia").title("Media Missing Alt Text").filter('_type == "galleryMedia" && mediaType == "image" && published == true && (!defined(imageAlt) || imageAlt == "")').apiVersion(apiVersion)),
          S.listItem()
            .title("Unpublished Media")
            .schemaType("galleryMedia")
            .child(S.documentTypeList("galleryMedia").title("Unpublished Media").filter('_type == "galleryMedia" && published != true').apiVersion(apiVersion)),
          S.listItem()
            .title("Videos")
            .schemaType("galleryMedia")
            .child(S.documentTypeList("galleryMedia").title("Videos").filter('_type == "galleryMedia" && mediaType == "video"').apiVersion(apiVersion)),
          S.divider(),
          S.listItem()
            .title("Bulk Import Information")
            .child(S.document().schemaType("genericPage").documentId("gallery-bulk-import-information").title("Bulk Import Information")),
        ]),
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("School Website")
    .items([
      singletonItem(S, "Site Settings", "siteSettings"),
      singletonItem(S, "Homepage", "homepage"),
      singletonItem(S, "Navigation", "navigationSettings"),
      S.listItem().title("Current Enrolment").schemaType("enrolment").child(S.documentTypeList("enrolment").title("Current Enrolment").filter('_type == "enrolment"').apiVersion(apiVersion)),
      S.documentTypeListItem("newsArticle").title("News"),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("announcement").title("Announcements"),
      gallerySection(S),
      S.documentTypeListItem("download").title("Downloads"),
      S.documentTypeListItem("staffMember").title("Leadership & Staff"),
      S.listItem()
        .title("Academics")
        .child(S.list().title("Academics").items([S.documentTypeListItem("department").title("Departments"), S.documentTypeListItem("academicProgramme").title("Academic Programmes")])),
      singletonItem(S, "Admissions", "admissionsContent"),
      S.documentTypeListItem("schoolLifeActivity").title("Student Life"),
      S.documentTypeListItem("facility").title("Facilities"),
      singletonItem(S, "Master Plan", "masterPlan"),
      S.documentTypeListItem("genericPage").title("Other Pages"),
    ]);

export function filterSingletonTemplates<TTemplate extends { schemaType: string }>(prev: TTemplate[]): TTemplate[] {
  return prev.filter((template) => !singletonTypes.has(template.schemaType));
}
