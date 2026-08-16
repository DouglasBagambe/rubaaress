import type { ReactNode } from "react";

const focusClass = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

export function ResponsiveTable({ caption, headers, rows, footer }: { caption: string; headers: ReadonlyArray<string>; rows: ReadonlyArray<ReadonlyArray<ReactNode>>; footer?: ReadonlyArray<ReactNode> }) {
  return (
    <div className="overflow-x-auto border border-[var(--school-border)] bg-white shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-[var(--school-blue-dark)] text-white"><tr>{headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-bold">{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="border-t border-[var(--school-border)] odd:bg-white even:bg-[var(--school-cream)]/60">{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row" className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{cell}</th> : <td key={cellIndex} className="px-4 py-3 text-[var(--school-ink)]">{cell}</td>)}</tr>)}</tbody>
        {footer ? <tfoot><tr className="border-t-2 border-[var(--school-blue)] bg-[var(--school-gold)]/15">{footer.map((cell, index) => index === 0 ? <th key={index} scope="row" className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{cell}</th> : <td key={index} className="px-4 py-3 font-bold text-[var(--school-blue-dark)]">{cell}</td>)}</tr></tfoot> : null}
      </table>
    </div>
  );
}

export function PdfActions({ href, title }: { href: string; title: string }) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center bg-[var(--school-blue)] px-5 text-sm font-bold text-white hover:bg-[var(--school-blue-dark)] ${focusClass}`}>View PDF</a>
      <a href={href} download className={`inline-flex min-h-11 items-center border border-[var(--school-blue)] px-5 text-sm font-bold text-[var(--school-blue)] hover:bg-[var(--school-blue)] hover:text-white ${focusClass}`} aria-label={`Download ${title}`}>Download PDF</a>
    </div>
  );
}

export function StatCards({ items }: { items: ReadonlyArray<{ label: string; value: string; note?: string }> }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <article key={item.label} className="border-t-4 border-[var(--school-gold)] bg-white p-5 shadow-sm"><p className="font-serif text-4xl font-semibold text-[var(--school-blue-dark)]">{item.value}</p><h3 className="mt-2 font-bold text-[var(--school-ink)]">{item.label}</h3>{item.note ? <p className="mt-2 text-sm leading-6 text-[var(--school-muted)]">{item.note}</p> : null}</article>)}</div>;
}
