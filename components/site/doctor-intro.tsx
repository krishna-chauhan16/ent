import Image from 'next/image'
import { Award, GraduationCap, Microscope } from 'lucide-react'
import { site } from '@/lib/site'
import { Reveal } from './reveal'

const credentials = [
  { label: 'MBBS', sub: 'Medicine & Surgery' },
  { label: 'MS — ENT', sub: 'Otorhinolaryngology' },
  { label: 'FACS', sub: 'Fellow, Amer. College of Surgeons' },
]

export function DoctorIntro() {
  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-3xl border border-border shadow-xl">
              <Image
                src="/doctor-intro.png"
                alt={`${site.doctor.name} consulting a patient in the clinic`}
                width={680}
                height={760}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -right-3 -top-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl sm:-right-6">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Award className="size-6" />
              </span>
              <div>
                <p className="font-heading text-2xl font-bold leading-none text-foreground">20+</p>
                <p className="text-xs text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <GraduationCap className="size-4" />
              Meet Your Surgeon
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A trusted name in ENT &amp; head-neck surgery
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-6 space-y-4 text-pretty leading-relaxed text-muted-foreground">
              <p>
                {site.doctor.name} is a board-certified otolaryngologist who has cared for more than
                15,000 patients across two decades of practice. She combines meticulous surgical
                skill with a calm, unhurried bedside manner — taking the time to explain every
                diagnosis and treatment option in plain language.
              </p>
              <p>
                Her practice spans minimally invasive endoscopic sinus surgery, advanced hearing
                restoration, voice and swallowing disorders, and complex head &amp; neck procedures.
                She is a proud faculty member and lead ENT consultant at the{' '}
                {site.hospital.name}.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {credentials.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <p className="font-heading text-lg font-bold text-foreground">{c.label}</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{c.sub}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-secondary p-4">
              <Microscope className="size-6 shrink-0 text-accent" />
              <p className="text-sm text-secondary-foreground">
                Fellowship-trained in advanced endoscopic and robotic ENT techniques.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
