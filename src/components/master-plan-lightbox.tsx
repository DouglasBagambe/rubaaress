"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { MasterPlanItem } from "@/lib/site-data";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

type MasterPlanLightboxProps = {
  items: ReadonlyArray<MasterPlanItem>;
};

export function MasterPlanLightbox({ items }: MasterPlanLightboxProps) {
  const [activeItem, setActiveItem] = useState<MasterPlanItem | null>(null);

  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveItem(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeItem]);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="border border-[var(--school-border)] bg-white">
            <button
              type="button"
              className={`group block w-full text-left ${focusClass}`}
              onClick={() => setActiveItem(item)}
              aria-label={`View ${item.title} master-plan image`}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-[var(--school-cream)]">
                <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none" />
              </span>
              <span className="block p-5">
                <span className="block font-serif text-xl font-semibold text-[var(--school-blue-dark)]">{item.title}</span>
                <span className="mt-2 block text-sm leading-6 text-[var(--school-muted)]">{item.caption}</span>
              </span>
            </button>
          </article>
        ))}
      </div>

      {activeItem ? (
        <div className="fixed inset-0 z-[80] bg-[var(--school-blue-dark)]/95 p-4 text-white" role="dialog" aria-modal="true" aria-labelledby="master-plan-lightbox-title">
          <div className="mx-auto flex h-full max-w-7xl flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[var(--school-gold)]">Master Plan</p>
                <h2 id="master-plan-lightbox-title" className="mt-1 font-serif text-2xl font-semibold">
                  {activeItem.title}
                </h2>
                <p className="mt-1 text-sm text-blue-100">{activeItem.caption}</p>
              </div>
              <button
                type="button"
                className={`min-h-11 border border-white/40 px-4 text-sm font-bold text-white hover:bg-white/10 ${focusClass}`}
                onClick={() => setActiveItem(null)}
              >
                Close
              </button>
            </div>
            <div className="relative min-h-0 flex-1 bg-white">
              <Image src={activeItem.src} alt={activeItem.alt} fill sizes="100vw" className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
