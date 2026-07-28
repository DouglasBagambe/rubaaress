"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/site-data";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--school-blue-dark)]";

export function FullWidthHero({ slides }: { slides: ReadonlyArray<HeroSlide> }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || slides.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [isPaused, slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section
      className="relative min-h-[560px] overflow-hidden bg-[var(--school-blue-dark)] text-white md:min-h-[650px]"
      aria-label="School highlights"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.heading}
          src={slide.image.src}
          alt={index === activeIndex ? slide.image.alt : ""}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 motion-reduce:transition-none ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[rgba(15,44,74,0.74)]" />
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-20 md:min-h-[650px] md:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold text-[var(--school-gold)]">{activeSlide.eyebrow}</p>
          <h1 className="font-serif text-5xl font-semibold leading-tight md:text-7xl">
            {activeSlide.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50 md:text-xl">{activeSlide.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={activeSlide.primaryCta.href}
              className={`inline-flex min-h-12 items-center justify-center bg-[var(--school-gold)] px-6 text-sm font-bold text-[var(--school-ink)] hover:bg-[#e1ad58] ${focusClass}`}
            >
              {activeSlide.primaryCta.label}
            </Link>
            {activeSlide.secondaryCta ? (
              <Link
                href={activeSlide.secondaryCta.href}
                className={`inline-flex min-h-12 items-center justify-center border border-white/70 px-6 text-sm font-bold text-white hover:bg-white/10 ${focusClass}`}
              >
                {activeSlide.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={`min-h-11 border border-white/60 px-4 text-sm font-semibold text-white hover:bg-white/10 ${focusClass}`}
            onClick={() => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)}
          >
            Previous
          </button>
          <button
            type="button"
            className={`min-h-11 border border-white/60 px-4 text-sm font-semibold text-white hover:bg-white/10 ${focusClass}`}
            onClick={() => setIsPaused((current) => !current)}
            aria-pressed={isPaused}
          >
            {isPaused ? "Play" : "Pause"}
          </button>
          <button
            type="button"
            className={`min-h-11 border border-white/60 px-4 text-sm font-semibold text-white hover:bg-white/10 ${focusClass}`}
            onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
          >
            Next
          </button>
          <div className="flex gap-2" aria-label="Hero pagination">
            {slides.map((slide, index) => (
              <button
                key={slide.heading}
                type="button"
                className={`h-3 w-10 border border-white/80 ${
                  index === activeIndex ? "bg-[var(--school-gold)]" : "bg-white/20"
                } ${focusClass}`}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 left-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100 md:left-6 lg:left-8">
          Scroll
        </div>
      </div>
    </section>
  );
}
