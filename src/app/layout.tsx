import type { Metadata } from "next";
import { officialSchoolProfile } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rubaaress.vercel.app"),
  title: {
    default: "Rubaare Secondary School",
    template: "%s | Rubaare Secondary School",
  },
  description:
    `${officialSchoolProfile.schoolName} - ${officialSchoolProfile.motto}. ${officialSchoolProfile.mission}`,
  openGraph: {
    title: "Rubaare Secondary School",
    description: `${officialSchoolProfile.schoolName} - ${officialSchoolProfile.motto}. ${officialSchoolProfile.mission}`,
    type: "website",
    locale: "en_UG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rubaare Secondary School",
    description: `${officialSchoolProfile.schoolName} - ${officialSchoolProfile.motto}. ${officialSchoolProfile.mission}`,
  },
  robots: {
    index: true,
    follow: true,
  },
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
      <body className="min-h-full bg-[var(--school-cream)] text-[var(--school-ink)]">{children}</body>
    </html>
  );
}
