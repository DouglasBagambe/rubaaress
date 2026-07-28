import Link from "next/link";
import { findUs } from "@/lib/site-data";

export function LocationSection() {
  return (
    <section className="border-t border-[var(--school-border)] bg-[var(--school-cream)] py-16 md:py-20" aria-labelledby="find-us-heading">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold text-[var(--school-gold)]">Location</p>
          <h2 id="find-us-heading" className="font-serif text-3xl font-semibold leading-tight text-[var(--school-blue-dark)] md:text-4xl">
            {findUs.heading}
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--school-ink)]">{findUs.address}</p>
          <Link
            href={findUs.directionsHref}
            className="mt-8 inline-flex min-h-12 w-fit items-center justify-center bg-[var(--school-blue)] px-6 text-sm font-bold text-white hover:bg-[var(--school-blue-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Directions
          </Link>
        </div>
        <div className="min-h-80 overflow-hidden border border-[var(--school-border)] bg-white">
          <iframe
            src={findUs.mapEmbedSrc}
            title={findUs.mapTitle}
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
