import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`border-t border-[var(--school-border)] py-16 md:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold text-[var(--school-gold)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-3xl font-semibold leading-tight text-[var(--school-blue-dark)] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-[var(--school-muted)] md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
