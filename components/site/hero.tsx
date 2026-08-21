import Image from "next/image";
import { Award, CheckCircle2, Phone, ShieldCheck, Sparkles, Star, Stethoscope, Building2 } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "./reveal";
import { BookAppointmentButton } from "./appointment-dialog";

const badges = [
  "10+ Years Experience",
  "6,000+ Surgeries",
  "Director & Head, Dept. of ENT",
  "Expert Otologist & Rhinologist",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-secondary via-background to-background py-12 lg:py-20"
    >
      {/* Background glow accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 size-96 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-8">
        {/* Copy */}
        <div className="flex flex-col">
          <Reveal>
            <div className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-accent shadow-sm">
              <ShieldCheck className="size-4 shrink-0 text-accent" />
              <span>DIRECTOR &amp; HEAD, DEPARTMENT OF ENT</span>
              <span className="hidden sm:inline">&middot;</span>
              <span className="text-foreground/80">Atulya Superspeciality Hospital &amp; ICU</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {site.doctor.name}
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-accent mt-2">
                MS (ENT) &middot; Consultant ENT Surgeon
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-5 max-w-2xl text-pretty text-base sm:text-lg leading-relaxed text-muted-foreground">
              ENT Surgeon with more than <span className="font-semibold text-foreground">10 years of surgical experience</span> and over <span className="font-semibold text-foreground">6,000 successful surgeries</span> across Ear, Nose, and Throat procedures. Renowned expertise in Otology &amp; Rhinology, leading advanced sinus endoscopy, microscopic ear surgery, and head-neck care in Ahmedabad.
            </p>
          </Reveal>

          {/* Quick highlights pill grid */}
          <Reveal delay={180}>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-2">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 rounded-xl border border-border/80 bg-card/80 p-2.5 text-xs font-medium text-foreground backdrop-blur-sm"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-accent" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <BookAppointmentButton className="inline-flex h-13 min-h-13 items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-bold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              <a
                href={site.doctor.phoneHref}
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Phone className="size-5 text-accent" />
                <span>Call {site.doctor.phoneDisplay}</span>
              </a>
            </div>
          </Reveal>

          {/* Hospital affiliation banner */}
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-border/80 bg-secondary/80 p-4 text-xs sm:text-sm text-muted-foreground">
              <Building2 className="size-5 shrink-0 text-accent" />
              <div>
                <span className="font-semibold text-foreground">Consulting at:</span> Atulya Superspeciality Hospital (Bhuyangdev), KD Hospital &amp; Prathana Hospital, Ahmedabad.
              </div>
            </div>
          </Reveal>
        </div>

        {/* Portrait & Floating Metric Cards */}
        <Reveal delay={120} className="relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Glow frame */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-tr from-accent/30 to-chart-3/20 blur-xl"
            />

            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl aspect-[4/5] sm:aspect-[3/4]">
              <Image
                src="/doctor-portrait.jpg"
                alt={`Portrait of ${site.doctor.name}, ${site.doctor.title} at Atulya Superspeciality Hospital`}
                width={720}
                height={900}
                priority
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Top Floating Pill */}
            <div className="absolute -top-4 right-4 flex items-center gap-2.5 rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur sm:-right-4">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold text-xs">
                6K+
              </span>
              <div>
                <p className="font-heading text-xs font-bold text-foreground">6,000+ Surgeries</p>
                <p className="text-[10px] text-muted-foreground">Ear, Nose &amp; Throat</p>
              </div>
            </div>

            {/* Bottom floating summary card */}
            <div className="absolute -bottom-5 left-1/2 w-[92%] -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:left-4 sm:w-auto sm:translate-x-0">
              <div className="flex items-center gap-3.5">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <ShieldCheck className="size-6" />
                </span>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">
                    {site.doctor.name}
                  </p>
                  <p className="text-xs font-medium text-accent">
                    Director &amp; Head, Dept. of ENT
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Atulya Superspeciality Hospital &amp; ICU
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
