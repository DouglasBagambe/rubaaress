import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { officialSchoolProfile } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rubaare Secondary School",
  description:
    `${officialSchoolProfile.schoolName} - ${officialSchoolProfile.motto}. ${officialSchoolProfile.mission}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col bg-[var(--school-cream)] text-[var(--school-ink)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
