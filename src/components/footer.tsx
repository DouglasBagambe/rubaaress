import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ResolvedSiteSettings } from "@/sanity/types";

const schoolLinks = [
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "School Life", href: "/school-life" },
  { label: "News", href: "/news" },
];

const resourceLinks = [
  { label: "Events", href: "/events" },
  { label: "Announcements", href: "/announcements" },
  { label: "Gallery", href: "/gallery" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact", href: "/contact" },
];

export function Footer({ settings }: { settings: ResolvedSiteSettings }) {
  return (
    <footer className="bg-[var(--school-blue-dark)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-6 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Image src={settings.badge.src} alt={settings.badge.alt} width={50} height={56} />
            <div>
              <p className="font-serif text-xl font-semibold">{settings.schoolName}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--school-gold)]">{settings.motto}</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-blue-100">
            {settings.footerIntroduction}
          </p>
        </div>
        <FooterColumn title="School">
          {schoolLinks.map((item) => <FooterLink key={item.href} href={item.href} label={item.label} />)}
        </FooterColumn>
        <FooterColumn title="Resources">
          {resourceLinks.map((item) => <FooterLink key={item.href} href={item.href} label={item.label} />)}
        </FooterColumn>
        <FooterColumn title="Contact">
          <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)]">
            {settings.physicalLocation}
          </a>
          <a href={settings.primaryTelephoneHref} className="font-medium hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)]">
            {settings.primaryTelephone}
          </a>
          <p>{settings.postalAddress}</p>
          {settings.email ? (
            <a href={`mailto:${settings.email}`} className="font-medium hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)]">
              {settings.email}
            </a>
          ) : null}
        </FooterColumn>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-blue-100 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>{settings.copyrightText}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-blue-200/80">
              Built by{" "}
              <a
                href="https://nilebitlabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-[var(--school-gold)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--school-blue-dark)]"
              >
                NileBit Labs
              </a>
            </p>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="text-sm">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--school-gold)]">{title}</h2>
      <div className="grid gap-2 text-blue-100">{children}</div>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="min-h-10 py-1 font-medium hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)]">
      {label}
    </Link>
  );
}
