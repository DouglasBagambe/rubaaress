export type OfficialSchoolContact = {
  locationDisplay: string;
  location: string;
  mapsUrl: string;
  mapEmbedSrc: string;
  phoneDisplay: string;
  phoneHref: string;
  postalAddress: string;
  email?: string;
};

export type OfficialSchoolProfile = {
  schoolName: string;
  shortName: string;
  motto: string;
  vision: string;
  mission: string;
  contact: OfficialSchoolContact;
};

export const officialSchoolProfile: OfficialSchoolProfile = {
  schoolName: "Rubaare Secondary School",
  shortName: "Rubaare SS",
  motto: "Rise and Shine",
  vision: "To provide educated and responsible citizens for self and community improvement.",
  mission: "To provide equitable, affordable and quality education.",
  contact: {
    locationDisplay: "Rubaare, Ntungamo District",
    location: "Rubaare, Ntungamo District, Uganda",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rubaare+Secondary+School+Ntungamo+Uganda",
    mapEmbedSrc: "https://www.google.com/maps?q=Rubaare%20Secondary%20School%20Ntungamo%20Uganda&output=embed",
    phoneDisplay: "0772 923 571",
    phoneHref: "tel:+256772923571",
    postalAddress: "P.O. Box 65, Ntungamo",
    email: "rubaaress2012@gmail.com",
  },
};

export const canonicalSiteUrl = "https://rubaaress.sc.ug";
