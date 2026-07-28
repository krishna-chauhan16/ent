import Image from 'next/image'
import { BadgeCheck, Clock, MapPin, Phone } from 'lucide-react'
import { site } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const accreditations = ['JCI Accredited', 'NABH Certified', 'ISO 9001:2015', 'Center of Excellence']

export function Hospital() {
  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where We Practice"
          title={site.hospital.name}
          description="A state-of-the-art facility equipped with advanced diagnostic and surgical technology, supported by an expert multidisciplinary team."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
              <Image
                src="/hospital.png"
                alt={`Exterior of ${site.hospital.name}`}
                width={820}
                height={620}
                className="h-64 w-full object-cover sm:h-80 lg:h-full"
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-9">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Address</h3>
                    <p className="mt-1 text-muted-foreground">
                      {site.hospital.addressLine1}
                      <br />
                      {site.hospital.addressLine2}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Clinic Hours</h3>
                    <p className="mt-1 text-muted-foreground">
                      Mon – Fri: 9:00 AM – 6:00 PM
                      <br />
                      Saturday: 9:00 AM – 1:00 PM &middot; Sunday: Closed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Appointments</h3>
                    <a
                      href={site.hospital.phoneHref}
                      className="mt-1 inline-block font-medium text-accent underline-offset-2 hover:underline"
                    >
                      {site.hospital.phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Accreditations
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {accreditations.map((a) => (
                    <li
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
                    >
                      <BadgeCheck className="size-4 text-accent" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={80} className="mt-8">
          <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
            <iframe
              title={`Map showing the location of ${site.hospital.name}`}
              src="https://www.google.com/maps?q=Cleveland+Clinic&output=embed"
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full grayscale-[0.2]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
