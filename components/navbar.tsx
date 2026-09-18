"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/button";
import type { SchoolSettings } from "@/lib/types/school";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/facilities", label: "Facilities" },
  { href: "/fees", label: "Fees" },
  { href: "/calendar", label: "Calendar" },
  { href: "/admissions", label: "Admissions" },
];

export function Navbar({ settings }: { settings: SchoolSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    menuButtonRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-royal-100/70 bg-white/80 shadow-sm shadow-royal-950/5 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower-400"
          aria-label={`${settings.schoolName} — home`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-royal-100">
            <Image
              src="/images/brooklite-logo.jpg"
              alt="Brooklite Premier School logo"
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="min-w-0 truncate font-display text-base font-bold leading-tight text-royal-950 sm:text-lg">
            Brooklite
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-sunflower-600">
              Premier School
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-royal-50 text-royal-800"
                    : "text-royal-900/70 hover:bg-royal-50 hover:text-royal-900",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button href="/admissions" size="sm" className="hidden sm:inline-flex">
            Enroll Now
          </Button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-royal-100 bg-white text-royal-900 hover:bg-royal-50 md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-navigation"
          className="absolute inset-x-4 top-full z-50 mx-auto mt-2 max-w-sm rounded-2xl border border-royal-100 bg-white p-3 shadow-xl shadow-royal-950/10 ring-1 ring-royal-950/5 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm font-medium",
                    isActive(link.href)
                      ? "bg-royal-50 text-royal-800"
                      : "text-royal-900/80 hover:bg-royal-50",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 p-1">
            <Button href="/admissions" onClick={() => setOpen(false)} className="w-full">
              Enroll Now
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}