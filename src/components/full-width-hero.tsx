"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HeroSlide } from "@/lib/site-data";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--school-blue-dark)]";

export function FullWidthHero({ slides }: { slides: ReadonlyArray<HeroSlide> }) {
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 640px)");
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const updateVideoPreference = () => {
      const slowConnection = connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";
      setShowVideo(mediaQuery.matches && connection?.saveData !== true && !slowConnection);
    };
    updateVideoPreference();
    mediaQuery.addEventListener("change", updateVideoPreference);
    connection?.addEventListener?.("change", updateVideoPreference);
    return () => {
      mediaQuery.removeEventListener("change", updateVideoPreference);
      connection?.removeEventListener?.("change", updateVideoPreference);
    };
  }, []);

  const activeSlide = slides[0];
  if (!activeSlide) return null;

  const toggleVideoPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsVideoPaused(false);
      return;
    }
    video.pause();
    setIsVideoPaused(true);
  };

  return (
    <section
      className="relative min-h-[560px] overflow-hidden bg-[var(--school-blue-dark)] text-white md:min-h-[650px]"
      aria-label="Introduction to Rubaare Secondary School"
    >
      <Image
        src="/images/school/campus/rubaare-campus-aerial-poster.webp"
        alt="Aerial view of Rubaare Secondary School in Ntungamo District, Uganda."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/school/campus/rubaare-campus-aerial-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/videos/rubaare-campus-aerial.mp4" type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,30,51,0.9)_0%,rgba(12,42,70,0.76)_52%,rgba(12,42,70,0.5)_100%)]" />
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
        <div className="absolute bottom-6 left-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100 md:left-6 lg:left-8">
          Rubaare, Ntungamo District
        </div>
        {showVideo ? (
          <button
            type="button"
            onClick={toggleVideoPlayback}
            aria-pressed={isVideoPaused}
            className={`absolute bottom-4 right-4 min-h-11 border border-white/50 bg-[var(--school-blue-dark)]/70 px-4 text-xs font-semibold text-white backdrop-blur-sm hover:bg-[var(--school-blue-dark)] md:bottom-5 md:right-6 lg:right-8 ${focusClass}`}
          >
            {isVideoPaused ? "Play aerial video" : "Pause aerial video"}
          </button>
        ) : null}
      </div>
    </section>
  );
}
