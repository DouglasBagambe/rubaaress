import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getSiteSettings } from "@/sanity/content";

export default async function PublicSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
