"use client";

import Link from "next/link";

export default function SiteError({ reset }: { reset: () => void }) {
  return (
    <main className="bg-[var(--school-cream)] px-4 py-16">
      <div className="mx-auto max-w-2xl border border-[var(--school-border)] bg-white p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--school-gold)]">Something went wrong</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-[var(--school-blue-dark)]">The page could not be loaded.</h1>
        <p className="mt-4 text-base leading-7 text-[var(--school-muted)]">Try again, search the site, or return to the homepage.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="bg-[var(--school-blue)] px-5 py-3 text-sm font-bold text-white">Try Again</button>
          <Link href="/search" className="border border-[var(--school-blue)] px-5 py-3 text-sm font-bold text-[var(--school-blue-dark)]">Search</Link>
        </div>
      </div>
    </main>
  );
}
