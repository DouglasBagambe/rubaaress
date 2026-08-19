import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { canonicalSiteUrl, officialSchoolProfile } from "@/content/site";
import { getSiteSettings } from "@/sanity/content";

export default async function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const schoolJsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    "@id": `${canonicalSiteUrl}/#school`,
    name: officialSchoolProfile.schoolName,
    alternateName: officialSchoolProfile.shortName,
    slogan: officialSchoolProfile.motto,
    url: `${canonicalSiteUrl}/`,
    logo: settings.badge.src,
    telephone: "+256772923571",
    email: officialSchoolProfile.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rubaare",
      addressRegion: "Ntungamo District",
      postOfficeBoxNumber: settings.postalAddress,
      addressCountry: "UG",
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }} />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--school-gold)] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-[var(--school-ink)]">
        Skip to main content
      </a>
      <Header settings={settings} />
      <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
