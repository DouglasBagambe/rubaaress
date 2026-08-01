import type { Metadata } from "next";
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
      <body className="min-h-full bg-[var(--school-cream)] text-[var(--school-ink)]">{children}</body>
    </html>
  );
}
