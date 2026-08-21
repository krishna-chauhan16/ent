import Image from 'next/image'
import { Award, GraduationCap, Microscope, BookOpen, Building2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { site } from '@/lib/site'
import { Reveal } from './reveal'

const credentials = [
  {
    degree: 'M.S. (ENT)',
    institution: 'B.J. Medical College, Gujarat University',
    timeline: 'June 2015 – June 2018',
    highlight: 'Master of Surgery in Otorhinolaryngology',
  },
  {
    degree: 'M.B.B.S.',
    institution: 'Smt. N.H.L Municipal Medical College, Gujarat University',
    timeline: 'July 2007 – March 2013',
    highlight: 'Bachelor of Medicine & Bachelor of Surgery',
  },
]

const rotationalRotations = [
  {
    dept: 'M.P. Shah Gujarat Cancer Research Institute (GCRI)',
    focus: 'Head & Neck Oncology & Surgical Resections',
  },
  {
    dept: 'Department of Plastic Surgery, Civil Hospital',
    focus: 'Microvascular Reconstruction & Facial Flaps',
  },
  {
    dept: 'Department of Neurosurgery, Civil Hospital',
    focus: 'Anterior & Lateral Skull Base Procedures',
  },
  {
    dept: 'Department of Emergency Medicine, Civil Hospital',
    focus: 'Acute Airway Trauma, Foreign Body & Tracheostomies',
  },
]

export function DoctorIntro() {
  return (
    <section id="about" className="bg-background py-20 lg:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual Column */}
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="overflow-hidden rounded-3xl border border-border shadow-2xl bg-card aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/3]">
                <Image
                  src="/doctor-at-desk.jpg"
                  alt={`${site.doctor.name}, MS (ENT) — Director & Head at Atulya Superspeciality Hospital OPD`}
                  width={960}
                  height={720}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute -right-2 -top-2 sm:-right-5 sm:-top-3 flex items-center gap-2 sm:gap-3 rounded-2xl border border-border bg-card/95 p-2.5 sm:p-4 shadow-xl backdrop-blur">
                <span className="inline-flex size-9 sm:size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-md">
                  <Award className="size-4 sm:size-6" />
                </span>
                <div>
                  <p className="font-heading text-lg sm:text-2xl font-bold leading-none text-foreground">10+</p>
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">Years Experience</p>
                </div>
              </div>

              {/* Floating Surgeries Badge */}
              <div className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-5 flex items-center gap-2 sm:gap-3 rounded-2xl border border-border bg-card/95 p-2.5 sm:p-4 shadow-xl backdrop-blur">
                <span className="inline-flex size-9 sm:size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md dark:bg-accent dark:text-accent-foreground">
                  <ShieldCheck className="size-4 sm:size-6" />
                </span>
                <div>
                  <p className="font-heading text-lg sm:text-2xl font-bold leading-none text-foreground">6,000+</p>
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5">Successful Surgeries</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Details Column */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                <GraduationCap className="size-4" />
                Professional Summary &amp; Background
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {site.doctor.name}
                <span className="block text-xl sm:text-2xl font-semibold text-accent mt-1">
                  MS (ENT) &middot; Consultant ENT Surgeon
                </span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-5 space-y-3.5 text-pretty leading-relaxed text-muted-foreground">
                <p className="text-base font-medium text-foreground">
                  ENT Surgeon with more than <strong className="text-accent">10 years of clinical and surgical experience</strong> and over <strong className="text-accent">6,000 successful surgeries</strong> across Ear, Nose, and Throat procedures.
                </p>
                <p>
                  Specializing in <strong>Otology</strong> (Microscopic &amp; Endoscopic Ear Surgery) and <strong>Rhinology</strong> (Advanced Karl Storz Endoscopic Sinus Surgery - FESS). Currently leading the ENT Department as <strong>Director &amp; Head</strong> at Atulya Superspeciality Hospital &amp; ICU, Ahmedabad, with visiting consultations at KD Hospital and Prathana Hospital.
                </p>
                <p>
                  Actively involved in advanced surgical training, cadaveric temporal bone dissection workshops, and academic leadership with over 14 published research papers in national and international medical journals.
                </p>
              </div>
            </Reveal>

            {/* Academic Credentials */}
            <Reveal delay={200}>
              <div className="mt-7">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="size-4 text-accent" />
                  Academic Credentials
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {credentials.map((c) => (
                    <div
                      key={c.degree}
                      className="rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-heading text-lg font-bold text-foreground">{c.degree}</p>
                        <span className="text-[11px] font-semibold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                          {c.timeline}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-foreground">{c.institution}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{c.highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Super-Specialty Rotational Training Callout */}
            <Reveal delay={260}>
              <div className="mt-6 rounded-2xl border border-border bg-secondary/70 p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <Microscope className="size-5 text-accent shrink-0" />
                  <p className="font-heading text-sm font-bold text-foreground">
                    Super-Specialty Rotational Experience (Civil Hospital &amp; GCRI)
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {rotationalRotations.map((item) => (
                    <div key={item.dept} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">{item.dept}</span>
                        <span className="text-muted-foreground block">{item.focus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
