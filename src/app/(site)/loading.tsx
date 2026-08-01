export default function Loading() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="h-4 w-40 bg-[var(--school-cream)]" />
        <div className="mt-5 h-10 max-w-xl bg-[var(--school-cream)]" />
        <div className="mt-4 h-5 max-w-2xl bg-[var(--school-cream)]" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="h-40 bg-[var(--school-cream)]" />
          <div className="h-40 bg-[var(--school-cream)]" />
          <div className="h-40 bg-[var(--school-cream)]" />
        </div>
      </div>
    </main>
  );
}
