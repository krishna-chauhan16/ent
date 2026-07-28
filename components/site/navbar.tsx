"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  ChevronDown,
  Ear,
  Menu,
  Phone,
  Stethoscope,
  Wind,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { site, navLinks } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";
import { BookAppointmentButton } from "./appointment-dialog";

const megaMenu = [
  {
    icon: Wind,
    title: "Sinus & Nasal",
    desc: "Sinusitis, deviated septum & rhinoplasty",
    href: "#services",
  },
  {
    icon: Ear,
    title: "Ear & Hearing",
    desc: "Hearing loss, tinnitus & ear surgery",
    href: "#services",
  },
  {
    icon: Stethoscope,
    title: "Throat & Voice",
    desc: "Voice disorders, tonsils & swallowing",
    href: "#services",
  },
  {
    icon: Activity,
    title: "Head & Neck",
    desc: "Thyroid, salivary glands & tumors",
    href: "#specialties",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-lg shadow-[0_4px_24px_-12px_rgba(11,31,58,0.25)]"
          : "border-b border-transparent bg-background/60 backdrop-blur-sm",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        {/* Logo */}
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label={`${site.hospital.name} home`}
        >
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm">
            <Stethoscope className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              {site.doctor.name}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              ENT &amp; Head-Neck Surgery
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
            >
              Services
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  servicesOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3 transition-all duration-200",
                servicesOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0",
              )}
            >
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-popover p-3 shadow-xl">
                {megaMenu.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
                  >
                    <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <item.icon className="size-5" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.desc}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={site.hospital.phoneHref}
            aria-label={`Call ${site.hospital.phoneDisplay}`}
            className="hidden size-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            <Phone className="size-5" />
          </a>
          <ThemeToggle className="hidden sm:inline-flex" />
          {/* <BookAppointmentButton className="hidden h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex" /> */}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground lg:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      {mounted && (
        <div
          className={cn(
            "fixed inset-0 z-[100] lg:hidden",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
          aria-hidden={!mobileOpen}
        >
          <div
            className={cn(
              "absolute inset-0 bg-primary/50 backdrop-blur-sm transition-opacity duration-300",
              mobileOpen ? "opacity-100" : "opacity-0",
            )}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-card shadow-2xl transition-transform duration-300",
              mobileOpen ? "translate-x-0" : "translate-x-full",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-heading text-sm font-bold text-foreground">
                Menu
              </span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 border-t border-border p-4">
              <a
                href={site.hospital.phoneHref}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border font-semibold text-foreground"
              >
                <Phone className="size-4" /> {site.hospital.phoneDisplay}
              </a>
              <BookAppointmentButton className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-5 font-semibold text-accent-foreground" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
