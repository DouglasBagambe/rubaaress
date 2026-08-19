import type { Metadata } from "next";
import { schoolMedia } from "@/content/media";
import { canonicalSiteUrl } from "@/content/site";
import "./globals.css";

const description =
  "Rubaare Secondary School is a mixed day and boarding secondary school in Rubaare, Ntungamo District, Uganda, offering O-Level and A-Level education. Rise and Shine.";
const socialImage = {
  url: "/images/school/campus/rubaare-campus-aerial-poster.webp",
  width: 1920,
  height: 1080,
  alt: "Aerial view of Rubaare Secondary School in Ntungamo District, Uganda.",
};

export const metadata: Metadata = {
  metadataBase: new URL(canonicalSiteUrl),
  title: {
    default: "Rubaare Secondary School | Ntungamo, Uganda",
    template: "%s | Rubaare Secondary School",
  },
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: schoolMedia.badge.src, type: "image/jpeg" }],
    apple: [{ url: schoolMedia.badge.src, type: "image/jpeg" }],
  },
  openGraph: {
    title: "Rubaare Secondary School | Ntungamo, Uganda",
    description,
    url: `${canonicalSiteUrl}/`,
    siteName: "Rubaare Secondary School",
    type: "website",
    locale: "en_UG",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rubaare Secondary School | Ntungamo, Uganda",
    description,
    images: [socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
