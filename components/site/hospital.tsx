import Image from 'next/image'
import { BadgeCheck, Clock, MapPin, Phone, Mail, Building2, Stethoscope } from 'lucide-react'
import { site } from '@/lib/site'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const hospitalAffiliations = [
  {
    name: 'Atulya Superspeciality Hospital & ICU',
    role: 'Director & Head – Department of ENT',
    address: '2nd Floor, Elite Mangnum, Bhuyangdev Cross Rd, Ahmedabad - 380061',
    phone: '+91 9601074848 / 09727579000',
    tag: 'Primary Center',
  },
  {
    name: 'KD Hospital',
    role: 'Visiting Consultant ENT Surgeon',
    address: 'Vaishno Devi Circle, SG Highway, Ahmedabad',
    phone: '+91 9601074848',
    tag: 'Visiting Center',
  },
  {
    name: 'Prathana Hospital',
    role: 'Visiting Consultant ENT Surgeon',
    address: 'Ahmedabad, Gujarat',
    phone: '+91 9601074848',
    tag: 'Visiting Center',
  },
]

const facilityFeatures = [
  'Modern Modular ENT Operation Theatre',
  'Advanced 4K Karl Storz Endoscopy Tower',
  'Carl Zeiss High-Precision Operating Microscope',
  'Comprehensive 24x7 Multi-Specialty ICU Support',
  'In-House Diagnostic Video Endoscopy & Audiology',
  'Dedicated Day-Care & Pediatric Recovery Suites',
]

export function Hospital() {
  return (
    <section id="hospital" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Clinical Practice Locations"
          title={site.hospital.name}
          description="Advanced ENT infrastructure with state-of-the-art diagnostic and surgical technology, supported by round-the-clock ICU and emergency airway backup."
        />

        {/* Primary Hospital Overview */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border shadow-xl h-full flex flex-col">
              <Image
                src="/hospital.png"
                alt={`Exterior of ${site.hospital.name}`}
                width={820}
                height={620}
                className="h-72 w-full object-cover sm:h-80 lg:h-80"
              />
              <div className="bg-card p-6 border-t border-border flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    Director &amp; Head, Dept. of ENT
                  </span>
                  <h3 className="mt-2 font-heading text-xl font-bold text-foreground">
                    {site.hospital.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Superspeciality hospital with dedicated ENT wing, cutting-edge surgical suites and round-the-clock emergency care.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={site.doctor.phoneHref}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-sm transition-transform hover:scale-105"
                  >
                    <Phone className="size-3.5" /> Call +91 9601074848
                  </a>
                  <a
                    href={`mailto:${site.hospital.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    <Mail className="size-3.5 text-accent" /> {site.hospital.email}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-8 justify-between">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <MapPin className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Hospital Address</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {site.hospital.addressLine1}
                      <br />
                      {site.hospital.addressLine2}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">Contact Numbers</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      Mobile &amp; WhatsApp:{' '}
                      <a href={site.doctor.phoneHref} className="font-semibold text-accent hover:underline">
                        {site.doctor.phoneDisplay}
                      </a>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Hospital Landline: {site.hospital.landlineDisplay}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Clock className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground">OPD &amp; Emergency Hours</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      Consultation: Mon – Sat (By Appointment / Walk-in)
                      <br />
                      Emergency Airway &amp; ENT Trauma: 24x7 Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Infrastructure Highlights */}
              <div className="mt-6 border-t border-border pt-5">
                <h3 className="mb-3 font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Center Infrastructure &amp; Technology
                </h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {facilityFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs font-medium text-foreground"
                    >
                      <BadgeCheck className="size-4 shrink-0 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        {/* All Affiliated Consulting Centers */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {hospitalAffiliations.map((h, i) => (
            <Reveal key={h.name} delay={i * 60}>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-accent/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                    {h.tag}
                  </span>
                  <Building2 className="size-4 text-muted-foreground" />
                </div>
                <h4 className="mt-3 font-heading text-base font-bold text-foreground">
                  {h.name}
                </h4>
                <p className="text-xs font-semibold text-accent mt-0.5">
                  {h.role}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {h.address}
                </p>
                <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs">
                  <a href={`tel:${h.phone.split('/')[0].trim()}`} className="font-semibold text-accent flex items-center gap-1 hover:underline">
                    <Phone className="size-3" /> {h.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Google Map Location */}
        <Reveal delay={80} className="mt-10">
          <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
            <iframe
              title={`Map showing location of ${site.hospital.name}`}
              src="https://www.google.com/maps?q=Atulya+Superspeciality+Hospital+Bhuyangdev+Ahmedabad&output=embed"
              width="100%"
              height="340"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full grayscale-[0.1]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
