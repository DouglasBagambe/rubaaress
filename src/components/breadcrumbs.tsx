import Link from "next/link";

export type Breadcrumb = {
  label: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: ReadonlyArray<Breadcrumb> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-[var(--school-muted)]">
        <li>
          <Link href="/" className="font-semibold hover:text-[var(--school-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)]">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {index === items.length - 1 ? (
              <span className="font-semibold text-[var(--school-ink)]">{item.label}</span>
            ) : (
              <Link href={item.href} className="font-semibold hover:text-[var(--school-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)]">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
