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
  Award,
  BookOpen,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { site, navLinks } from "@/lib/site";
import { ThemeToggle } from "./theme-toggle";
import { BookAppointmentButton } from "./appointment-dialog";

const megaMenu = [
  {
    icon: Wind,
    title: "Rhinology & Sinus (FESS)",
    desc: "Septoplasty (1200+), Sinusitis & Karl Storz FESS (1000+)",
    href: "#milestones",
  },
  {
    icon: Ear,
    title: "Otology & Micro-Ear Surgery",
    desc: "Tympanoplasty (1200+), Mastoidectomy (700+) & Vertigo",
    href: "#milestones",
  },
  {
    icon: Stethoscope,
    title: "Throat, Voice & Airway",
    desc: "Tracheostomy (300+), Adenoid Plasma Dissection, Tonsils",
    href: "#services",
  },
  {
    icon: Activity,
    title: "Head & Neck / Skull Base",
    desc: "Skull base surgery, flap reconstruction & tumor management",
    href: "#publications",
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
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const mobileDrawer =
    mounted && mobileOpen
      ? createPortal(
          <div
            className="fixed inset-0 z-[99990] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-primary/70 backdrop-blur-sm transition-opacity duration-200"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            {/* Slide-out Drawer */}
            <div className="fixed right-0 top-0 bottom-0 flex h-[100dvh] w-[85%] max-w-sm flex-col bg-card shadow-2xl border-l border-border animate-in slide-in-from-right duration-200 z-10">
              <div className="flex items-center justify-between border-b border-border p-4 shrink-0 bg-secondary/40">
                <div className="min-w-0 flex-1 pr-2">
                  <span className="font-heading text-sm font-bold text-foreground block truncate">
                    {site.doctor.name}
                  </span>
                  <p className="text-[11px] text-accent font-semibold truncate">
                    MS (ENT) &middot; Consultant Surgeon
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="inline-flex size-9 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>

              <nav
                aria-label="Mobile navigation"
                className="flex-1 overflow-y-auto p-4 space-y-1"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-accent active:bg-muted"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex flex-col gap-2.5 border-t border-border p-4 shrink-0 bg-card">
                <a
                  href={site.doctor.phoneHref}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground hover:bg-muted"
                >
                  <Phone className="size-4 text-accent" /> {site.doctor.phoneDisplay}
                </a>
                <BookAppointmentButton
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20"
                />
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/90 backdrop-blur-lg shadow-[0_4px_24px_-12px_rgba(11,31,58,0.25)]"
            : "border-b border-transparent bg-background/70 backdrop-blur-sm",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8"
        >
          {/* Logo & Doctor Title */}
          <a
            href="#top"
            className="group flex items-center gap-2.5 min-w-0"
            aria-label={`${site.doctor.name} - ${site.doctor.title}`}
          >
            <span className="inline-flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md shadow-accent/25 transition-transform group-hover:scale-105">
              <Stethoscope className="size-4 sm:size-6" />
            </span>
            <span className="flex flex-col leading-none min-w-0">
              <span className="font-heading text-sm sm:text-lg font-bold tracking-tight text-foreground truncate max-w-[140px] xs:max-w-[190px] sm:max-w-none">
                {site.doctor.name}
              </span>
              <span className="mt-0.5 text-[10px] sm:text-[11px] font-semibold text-accent truncate">
                Director &amp; Head, ENT
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 xl:gap-2 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
              >
                Specialties
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    servicesOpen && "rotate-180",
                  )}
                />
              </button>
              <div
                className={cn(
                  "absolute left-1/2 top-full w-[36rem] -translate-x-1/2 pt-3 transition-all duration-200",
                  servicesOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0",
                )}
              >
                <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-popover p-3 shadow-xl backdrop-blur-md">
                  {megaMenu.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      onClick={() => setServicesOpen(false)}
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

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={site.doctor.phoneHref}
              aria-label={`Call Dr. Vaidik Chauhan at ${site.doctor.phoneDisplay}`}
              className="hidden items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
            >
              <Phone className="size-4 text-accent" />
              <span>{site.doctor.phoneDisplay}</span>
            </a>
            <ThemeToggle className="hidden sm:inline-flex" />
            <BookAppointmentButton className="hidden h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex" />
            
            <BookAppointmentButton
              className="inline-flex sm:hidden h-9 items-center justify-center rounded-full bg-accent px-3 text-xs font-bold text-accent-foreground shadow-sm shrink-0"
              label="Book"
            />

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex size-9 sm:size-10 items-center justify-center rounded-full border border-border bg-background text-foreground shrink-0 lg:hidden"
            >
              <Menu className="size-4.5 sm:size-5" />
            </button>
          </div>
        </nav>
      </header>

      {mobileDrawer}
    </>
  );
}
