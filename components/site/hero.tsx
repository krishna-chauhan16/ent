import Image from "next/image";
import { Phone, ShieldCheck, Star } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "./reveal";
import { BookAppointmentButton } from "./appointment-dialog";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-secondary to-background"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:py-24">
        {/* Copy */}
        <div className="flex flex-col">
          <Reveal>
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-accent shadow-sm">
              <ShieldCheck className="size-4" />
              Board-Certified ENT Surgeon &middot; 20+ Years
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Expert Ear, Nose &amp; Throat Care with Compassion
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {`${site.doctor.name} delivers precise, patient-first diagnosis and advanced surgical care for the whole family — from chronic sinus and hearing concerns to complex head & neck conditions.`}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* <BookAppointmentButton className="inline-flex h-13 min-h-13 items-center justify-center rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" /> */}
              <a
                href={site.hospital.phoneHref}
                className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border bg-background px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Phone className="size-5" />
                Call Now
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">4.9/5</span>{" "}
                from 1,200+ verified patient reviews
              </p>
            </div>
          </Reveal>
        </div>

        {/* Portrait */}
        <Reveal delay={120} className="relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-accent/10 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
              <Image
                src="/doctor-portrait.png"
                alt={`Portrait of ${site.doctor.name}, ${site.doctor.role}`}
                width={720}
                height={860}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 w-[88%] -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:left-6 sm:w-auto sm:translate-x-0">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ShieldCheck className="size-6" />
                </span>
                <div>
                  <p className="font-heading text-sm font-bold text-foreground">
                    {site.doctor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {site.doctor.title}
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
