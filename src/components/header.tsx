"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { mobileNavigation, navigation, newsNavigation, utilityNavigation, type NavigationItem } from "@/content/navigation";
import type { ResolvedSiteSettings } from "@/sanity/types";

const focusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--school-gold)] focus-visible:ring-offset-2";

function getNavigationId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function isActiveSection(pathname: string, item: NavigationItem) {
  const hrefs = [item.href, ...(item.groups?.flatMap((group) => group.items.map((link) => link.href)) ?? [])];

  return hrefs.some((href) => {
    if (href === "/") return pathname === "/";
    if (href === "/events") return pathname.startsWith("/events");
    return pathname === href || pathname.startsWith(`${href}/`);
  });
}

export function Header({ settings }: { settings: ResolvedSiteSettings }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [activeUtilityMenu, setActiveUtilityMenu] = useState<string | null>(null);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!activeUtilityMenu && !activeDesktopMenu && !isSearchOpen && !isMobileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (headerRef.current?.contains(target)) return;
      setActiveUtilityMenu(null);
      setActiveDesktopMenu(null);
      setIsSearchOpen(false);
      setIsMobileOpen(false);
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setActiveUtilityMenu(null);
      setActiveDesktopMenu(null);
      setIsMobileOpen(false);
      setIsSearchOpen(false);
      searchButtonRef.current?.focus();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDesktopMenu, activeUtilityMenu, isMobileOpen, isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;
    searchInputRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileDrawerRef.current?.querySelector<HTMLAnchorElement | HTMLButtonElement>("a, button")?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-[var(--school-border)] bg-white shadow-sm">
      <UtilityBar settings={settings} activeMenu={activeUtilityMenu} setActiveMenu={setActiveUtilityMenu} />
      <div className="mx-auto grid min-h-20 max-w-[1380px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-2 md:px-6 lg:px-8 xl:grid-cols-[minmax(285px,330px)_1fr_auto] xl:gap-8">
        <SchoolIdentity settings={settings} />
        <DesktopNavigation activeMenu={activeDesktopMenu} setActiveMenu={setActiveDesktopMenu} pathname={pathname} />
        <div className="hidden items-center justify-end gap-2 xl:flex">
          <button
            ref={searchButtonRef}
            type="button"
            aria-label="Search the website"
            aria-expanded={isSearchOpen}
            aria-controls="header-search"
            className={`flex min-h-11 min-w-11 items-center justify-center border border-[var(--school-border)] text-[var(--school-blue)] hover:border-[var(--school-gold)] ${focusClass}`}
            onClick={() => {
              setActiveDesktopMenu(null);
              setIsSearchOpen((current) => !current);
            }}
          >
            <SearchIcon />
          </button>
          <GalleryHeaderCTA />
        </div>
        <div className="flex items-center justify-end gap-2 xl:hidden">
          <Link href="/gallery" aria-label="View School Gallery" className={`hidden min-h-11 items-center bg-[var(--school-gold)] px-4 text-sm font-bold text-[var(--school-ink)] hover:bg-[#e1ad58] sm:flex ${focusClass}`}>
            Gallery
          </Link>
          <button
            type="button"
            className={`min-h-11 border border-[var(--school-blue)] px-4 text-sm font-bold text-[var(--school-blue)] ${focusClass}`}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileOpen((current) => !current)}
          >
            Menu
          </button>
        </div>
      </div>
      {isSearchOpen ? <HeaderSearch inputRef={searchInputRef} onClose={() => setIsSearchOpen(false)} /> : null}
      {isMobileOpen ? <MobileNavigation settings={settings} drawerRef={mobileDrawerRef} openGroup={openMobileGroup} setOpenGroup={setOpenMobileGroup} onClose={() => setIsMobileOpen(false)} pathname={pathname} /> : null}
    </header>
  );
}

function UtilityBar({
  settings,
  activeMenu,
  setActiveMenu,
}: {
  settings: ResolvedSiteSettings;
  activeMenu: string | null;
  setActiveMenu: (label: string | null) => void;
}) {
  const menuId = "utility-news-menu";
  const isNewsOpen = activeMenu === newsNavigation.label;

  return (
    <div className="bg-[var(--school-blue-dark)] text-white">
      <div className="mx-auto flex min-h-9 max-w-[1380px] items-center justify-between gap-4 px-4 text-xs md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 font-medium">
          <a
            href={settings.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Rubaare Secondary School location in Google Maps"
            className={`hidden min-h-9 items-center gap-1.5 whitespace-nowrap text-blue-50 hover:text-white sm:inline-flex ${focusClass}`}
          >
            <LocationIcon />
            {settings.locationDisplay}
          </a>
          <a
            href={settings.primaryTelephoneHref}
            aria-label={`Call ${settings.schoolName} on ${settings.primaryTelephone}`}
            className={`inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap text-blue-50 hover:text-white ${focusClass}`}
          >
            <PhoneIcon />
            {settings.primaryTelephone}
          </a>
          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              aria-label={`Email ${settings.schoolName}`}
              className={`hidden min-h-9 items-center gap-1.5 whitespace-nowrap text-blue-50 hover:text-white lg:inline-flex ${focusClass}`}
            >
              <MailIcon />
              {settings.email}
            </a>
          ) : null}
        </div>
        <nav aria-label="Utility links" className="hidden items-center gap-1 md:flex">
          {utilityNavigation.map((item) => (
            item.label === "News" ? (
              <div
                key={`${item.label}-${item.href}`}
                className="relative"
                onMouseEnter={() => setActiveMenu(newsNavigation.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  type="button"
                  aria-label="Toggle News menu"
                  aria-haspopup="true"
                  aria-expanded={isNewsOpen}
                  aria-controls={menuId}
                  className={`flex min-h-9 items-center gap-1 whitespace-nowrap px-3 py-2 font-semibold text-blue-50 hover:bg-white/10 hover:text-white ${focusClass}`}
                  onClick={() => setActiveMenu(isNewsOpen ? null : newsNavigation.label)}
                  onFocus={() => setActiveMenu(newsNavigation.label)}
                >
                  News
                  <ChevronIcon isOpen={isNewsOpen} />
                </button>
                {isNewsOpen ? <UtilityNewsMenu id={menuId} /> : null}
              </div>
            ) : (
              <Link key={`${item.label}-${item.href}`} href={item.href} className={`min-h-9 whitespace-nowrap px-3 py-2 font-semibold text-blue-50 hover:bg-white/10 ${focusClass}`}>
                {item.label}
              </Link>
            )
          ))}
        </nav>
      </div>
    </div>
  );
}

function SchoolIdentity({ settings }: { settings: ResolvedSiteSettings }) {
  return (
    <Link href="/" className={`flex min-h-14 min-w-0 items-center gap-3 xl:min-w-[285px] xl:max-w-[330px] xl:shrink-0 ${focusClass}`}>
      <Image src={settings.badge.src} alt={settings.badge.alt} width={50} height={75} priority />
      <span className="min-w-0 max-w-[230px] sm:max-w-none">
        <span className="block text-[17px] font-bold leading-tight text-[var(--school-blue-dark)] md:text-[19px]">
          {settings.schoolName}
        </span>
        <span className="block text-xs font-semibold text-[var(--school-muted)]">{settings.motto}</span>
      </span>
    </Link>
  );
}

function DesktopNavigation({
  activeMenu,
  setActiveMenu,
  pathname,
}: {
  activeMenu: string | null;
  setActiveMenu: (label: string | null) => void;
  pathname: string;
}) {
  return (
    <nav aria-label="Primary navigation" className="hidden items-center justify-center gap-3 xl:flex">
      {navigation.map((item) => {
        const hasMenu = item.type !== "direct";
        const menuId = `desktop-menu-${getNavigationId(item.label)}`;
        const isOpen = activeMenu === item.label;
        const isActive = isActiveSection(pathname, item);

        return (
          <div key={`${item.label}-${item.href}`} className="relative" onMouseEnter={() => hasMenu && setActiveMenu(item.label)} onMouseLeave={() => hasMenu && setActiveMenu(null)}>
            <div className="flex items-center">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-11 items-center whitespace-nowrap border-b-2 px-2 py-2 text-sm font-bold ${
                  isActive
                    ? "border-[var(--school-gold)] text-[var(--school-blue)]"
                    : "border-transparent text-[var(--school-ink)] hover:text-[var(--school-blue)]"
                } ${focusClass}`}
                onFocus={() => hasMenu && setActiveMenu(item.label)}
                onClick={() => setActiveMenu(null)}
              >
                {item.label}
              </Link>
              {hasMenu ? (
                <button
                  type="button"
                  aria-label={`Toggle ${item.label} menu`}
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  className={`flex min-h-11 min-w-9 items-center justify-center text-[var(--school-blue)] ${focusClass}`}
                  onClick={() => setActiveMenu(isOpen ? null : item.label)}
                >
                  <ChevronIcon isOpen={isOpen} />
                </button>
              ) : null}
            </div>
            {hasMenu && isOpen ? <DesktopMenu id={menuId} item={item} /> : null}
          </div>
        );
      })}
    </nav>
  );
}

function DesktopMenu({ id, item }: { id: string; item: NavigationItem }) {
  const isMega = item.type === "mega";

  return (
    <div
      id={id}
      className={`absolute left-0 top-full z-50 border border-[var(--school-border)] bg-white p-4 shadow-lg ${
        isMega ? "w-[min(740px,calc(100vw-3rem))]" : "w-80"
      }`}
    >
      <div className={isMega ? "grid gap-5 lg:grid-cols-[1fr_1fr_0.9fr]" : "grid gap-4"}>
        {item.groups?.map((group) => (
          <div key={`${item.label}-${group.heading}`}>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--school-gold)]">{group.heading}</p>
            <div className="grid gap-1">
              {group.items.map((link) => (
                <Link key={`${group.heading}-${link.label}-${link.href}`} href={link.href} className={`block min-h-10 px-2 py-2 text-sm font-semibold text-[var(--school-ink)] hover:bg-[var(--school-cream)] hover:text-[var(--school-blue)] ${focusClass}`}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        {item.feature && isMega ? (
          <Link href={item.feature.href} className={`group border-l border-[var(--school-border)] pl-4 ${focusClass}`}>
            <span className="relative block aspect-[4/3] overflow-hidden bg-[var(--school-cream)]">
              <Image src={item.feature.image.src} alt={item.feature.image.alt} fill sizes="240px" className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none" />
            </span>
            <span className="mt-3 block font-serif text-lg font-semibold text-[var(--school-blue-dark)]">{item.feature.heading}</span>
            <span className="mt-1 block text-sm leading-6 text-[var(--school-muted)]">{item.feature.body}</span>
          </Link>
        ) : null}
      </div>
      {item.label === "Admissions" ? (
        <div className="mt-4 border-t border-[var(--school-border)] pt-4">
          <p className="text-sm font-semibold text-[var(--school-blue-dark)]">Begin Your Journey</p>
          <Link href="/admissions" className={`mt-3 inline-flex min-h-11 items-center bg-[var(--school-gold)] px-4 text-sm font-bold text-[var(--school-ink)] hover:bg-[#c88c27] ${focusClass}`}>
            View Admissions
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function HeaderSearch({
  inputRef,
  onClose,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
}) {
  return (
    <div id="header-search" className="border-t border-[var(--school-border)] bg-[var(--school-cream)]">
      <div className="mx-auto flex max-w-[1380px] items-center gap-3 px-4 py-4 md:px-6 lg:px-8">
        <label className="sr-only" htmlFor="site-search">
          Search the website
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          autoComplete="off"
          placeholder="Search Rubaare Secondary School"
          className={`min-h-11 flex-1 border border-[var(--school-border)] bg-white px-4 text-sm text-[var(--school-ink)] ${focusClass}`}
        />
        <button type="button" className={`min-h-11 border border-[var(--school-blue)] px-4 text-sm font-bold text-[var(--school-blue)] ${focusClass}`} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function UtilityNewsMenu({ id }: { id: string }) {
  return (
    <div id={id} className="absolute right-0 top-full z-50 w-64 border border-[var(--school-border)] bg-white p-3 text-[var(--school-ink)] shadow-lg">
      <div className="grid gap-1">
        {newsNavigation.groups?.[0]?.items.map((link) => (
          <Link key={`${link.label}-${link.href}`} href={link.href} className={`block min-h-10 px-3 py-2 text-sm font-semibold hover:bg-[var(--school-cream)] hover:text-[var(--school-blue)] ${focusClass}`}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function GalleryHeaderCTA() {
  return (
    <Link href="/gallery" aria-label="View School Gallery" className={`flex min-h-11 items-center gap-2 bg-[var(--school-gold)] px-5 text-sm font-bold text-[var(--school-ink)] hover:bg-[#e1ad58] ${focusClass}`}>
      <GalleryIcon />
      Gallery
    </Link>
  );
}

function MobileNavigation({
  settings,
  drawerRef,
  openGroup,
  setOpenGroup,
  onClose,
  pathname,
}: {
  settings: ResolvedSiteSettings;
  drawerRef: RefObject<HTMLDivElement | null>;
  openGroup: string | null;
  setOpenGroup: (label: string | null) => void;
  onClose: () => void;
  pathname: string;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !drawerRef.current) return;
    const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("a, button"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-[var(--school-blue-dark)]/70 xl:hidden" onMouseDown={onClose}>
      <div
        ref={drawerRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="ml-auto flex h-full w-[min(90vw,420px)] flex-col overflow-y-auto bg-white"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--school-border)] px-4 py-4">
          <SchoolIdentity settings={settings} />
          <button type="button" className={`min-h-11 px-3 text-sm font-bold text-[var(--school-blue)] ${focusClass}`} onClick={onClose}>
            Close
          </button>
        </div>
        <nav aria-label="Mobile navigation links" className="grid gap-1 px-4 py-4">
          {mobileNavigation.map((item) => {
            const hasMenu = item.type !== "direct";
            const isOpen = openGroup === item.label;
            const isActive = isActiveSection(pathname, item);

            return (
              <div key={`${item.label}-${item.href}`} className="border-b border-[var(--school-border)] py-2">
                <div className="flex items-center justify-between gap-3">
                  <Link href={item.href} className={`block min-h-11 py-2 text-base font-bold ${isActive ? "text-[var(--school-blue)]" : "text-[var(--school-blue-dark)]"} ${focusClass}`} onClick={onClose}>
                    {item.label}
                  </Link>
                  {hasMenu ? (
                    <button
                      type="button"
                      className={`flex min-h-11 min-w-11 items-center justify-center text-[var(--school-blue)] ${focusClass}`}
                      aria-expanded={isOpen}
                      aria-controls={`mobile-menu-${getNavigationId(item.label)}`}
                      onClick={() => setOpenGroup(isOpen ? null : item.label)}
                    >
                      <ChevronIcon isOpen={isOpen} />
                    </button>
                  ) : null}
                </div>
                {hasMenu && isOpen ? (
                  <div id={`mobile-menu-${getNavigationId(item.label)}`} className="grid gap-3 pb-2 pl-4">
                    {item.groups?.map((group) => (
                      <div key={`${item.label}-${group.heading}`}>
                        <p className="py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--school-gold)]">{group.heading}</p>
                        <div className="grid gap-1">
                          {group.items.map((link) => (
                            <Link key={`${group.heading}-${link.label}-${link.href}`} href={link.href} className={`block min-h-11 py-2 text-sm font-semibold text-[var(--school-muted)] ${focusClass}`} onClick={onClose}>
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m21 15-5-5L5 19" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg aria-hidden="true" className={`h-4 w-4 transition motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.2 7.2a1 1 0 0 1 1.4 0L10 10.6l3.4-3.4a1 1 0 1 1 1.4 1.4l-4.1 4.1a1 1 0 0 1-1.4 0L5.2 8.6a1 1 0 0 1 0-1.4Z" clipRule="evenodd" />
    </svg>
  );
}
