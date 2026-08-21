import { CalendarCheck, Phone, Stethoscope, MessageCircle } from 'lucide-react'
import { site } from '@/lib/site'
import { Reveal } from './reveal'
import { BookAppointmentButton } from './appointment-dialog'

export function FinalCta() {
  return (
    <section id="contact" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center shadow-2xl sm:px-12 sm:py-20 dark:bg-secondary dark:ring-1 dark:ring-border">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-accent/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-10 size-72 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-xs sm:text-sm font-semibold text-accent-foreground dark:bg-accent/15 dark:text-accent">
                <Stethoscope className="size-4" />
                Expert ENT &amp; Surgical Consultation in Ahmedabad
              </span>
              <h2 className="mt-6 text-balance text-3xl font-extrabold tracking-tight text-primary-foreground dark:text-foreground sm:text-4xl lg:text-5xl">
                Consult with {site.doctor.name}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pretty text-sm sm:text-base leading-relaxed text-primary-foreground/80 dark:text-muted-foreground">
                Director &amp; Head, Department of ENT &middot; Atulya Superspeciality Hospital &amp; ICU, Ahmedabad.
                Over 6,000 successful surgeries across Septoplasty, FESS, Tympanoplasty &amp; Mastoidectomy.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <BookAppointmentButton className="inline-flex h-13 items-center justify-center rounded-full bg-accent px-8 text-base font-bold text-accent-foreground shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                <a
                  href={site.doctor.phoneHref}
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-primary-foreground/25 bg-transparent px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-border dark:text-foreground dark:hover:bg-muted"
                >
                  <Phone className="size-5 text-accent" />
                  {site.doctor.phoneDisplay}
                </a>
                <a
                  href={site.hospital.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 text-base font-semibold text-white transition-transform hover:scale-[1.03]"
                >
                  <MessageCircle className="size-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
