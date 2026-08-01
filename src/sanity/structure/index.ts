import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings", "navigationSettings", "homepage", "admissionsContent", "masterPlan"]);

function singletonItem(S: Parameters<StructureResolver>[0], title: string, schemaType: string) {
  return S.listItem()
    .title(title)
    .id(schemaType)
    .schemaType(schemaType)
    .child(S.document().schemaType(schemaType).documentId(schemaType).title(title));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("School Website")
    .items([
      singletonItem(S, "Site Settings", "siteSettings"),
      singletonItem(S, "Homepage", "homepage"),
      singletonItem(S, "Navigation", "navigationSettings"),
      S.listItem().title("Current Enrolment").schemaType("enrolment").child(S.documentTypeList("enrolment").title("Current Enrolment").filter('_type == "enrolment"')),
      S.documentTypeListItem("newsArticle").title("News"),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("announcement").title("Announcements"),
      S.documentTypeListItem("galleryAlbum").title("Gallery"),
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
