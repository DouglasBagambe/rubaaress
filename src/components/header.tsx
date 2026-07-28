"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, schoolIdentity, utilityLinks } from "@/lib/site-data";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--school-border)] bg-white">
      <div className="bg-[var(--school-blue-dark)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-sm md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p className="font-medium">{schoolIdentity.location}</p>
          <nav aria-label="Utility links" className="flex flex-wrap gap-1">
            {utilityLinks.map((item) => (
              <Link key={item.href} href={item.href} className={`min-h-11 px-3 py-2 font-semibold hover:bg-white/10 ${focusClass}`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className={`flex min-h-12 items-center gap-3 ${focusClass}`}>
          <Image src={schoolIdentity.logoPath} alt="Rubaare Secondary School badge" width={42} height={63} priority />
          <span>
            <span className="block text-base font-bold text-[var(--school-blue-dark)] md:text-xl">
              {schoolIdentity.name}
            </span>
            <span className="block text-xs font-semibold text-[var(--school-muted)]">
              Rise and Shine
            </span>
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-2 lg:flex">
          {navigation.map((item) => (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={`flex min-h-11 items-center border-b-2 px-3 py-2 text-sm font-bold ${
                  isActive(pathname, item.href)
                    ? "border-[var(--school-gold)] text-[var(--school-blue)]"
                    : "border-transparent text-[var(--school-ink)] hover:text-[var(--school-blue)]"
                } ${focusClass}`}
              >
                {item.label}
              </Link>
              {item.children ? (
                <div className="invisible absolute left-0 top-full w-72 border border-[var(--school-border)] bg-white p-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link key={`${item.label}-${child.label}-${child.href}`} href={child.href} className={`block min-h-11 px-3 py-2 text-sm font-semibold text-[var(--school-ink)] hover:bg-[var(--school-cream)] ${focusClass}`}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <button
          type="button"
          className={`min-h-11 border border-[var(--school-blue)] px-4 text-sm font-bold text-[var(--school-blue)] lg:hidden ${focusClass}`}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          Menu
        </button>
      </div>
      {isOpen ? (
        <div id="mobile-navigation" className="border-t border-[var(--school-border)] bg-white lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 py-4 md:px-6">
            {navigation.map((item) => (
              <div key={item.href} className="border-b border-[var(--school-border)] py-2">
                <div className="flex items-center justify-between gap-3">
                  <Link href={item.href} className={`block min-h-11 py-2 text-base font-bold text-[var(--school-blue-dark)] ${focusClass}`} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                  {item.children ? (
                    <button
                      type="button"
                      className={`min-h-11 px-3 text-sm font-bold text-[var(--school-blue)] ${focusClass}`}
                      aria-expanded={openMobileGroup === item.label}
                      onClick={() => setOpenMobileGroup((current) => (current === item.label ? null : item.label))}
                    >
                      {openMobileGroup === item.label ? "Close" : "Open"}
                    </button>
                  ) : null}
                </div>
                {item.children && openMobileGroup === item.label ? (
                  <div className="grid gap-1 pb-2 pl-4">
                    {item.children.map((child) => (
                      <Link key={`${item.label}-${child.label}-${child.href}`} href={child.href} className={`block min-h-11 py-2 text-sm font-semibold text-[var(--school-muted)] ${focusClass}`} onClick={() => setIsOpen(false)}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
