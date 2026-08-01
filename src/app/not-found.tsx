import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--school-cream)] px-4 py-16">
      <div className="mx-auto max-w-2xl border border-[var(--school-border)] bg-white p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--school-gold)]">Page not found</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold text-[var(--school-blue-dark)]">We could not find that page.</h1>
        <p className="mt-4 text-base leading-7 text-[var(--school-muted)]">Use search or return to the homepage to continue browsing Rubaare Secondary School.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="bg-[var(--school-blue)] px-5 py-3 text-sm font-bold text-white">Home</Link>
          <Link href="/search" className="border border-[var(--school-blue)] px-5 py-3 text-sm font-bold text-[var(--school-blue-dark)]">Search</Link>
        </div>
      </div>
    </main>
  );
}
