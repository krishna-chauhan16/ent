import {
  Stethoscope,
  Ear,
  Wind,
  Mic2,
  Moon,
  Baby,
  Slice,
  Activity,
  ArrowUpRight,
  HeartPulse,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const services = [
  {
    icon: Stethoscope,
    title: 'Comprehensive ENT OPD Consultation',
    desc: 'Diagnostic video nasal endoscopy, otoscopy, and same-day evaluation for acute and chronic conditions.',
  },
  {
    icon: Wind,
    title: 'FESS (Endoscopic Sinus Surgery)',
    desc: 'Minimally invasive, Karl Storz HD image-guided clearance for chronic rhinosinusitis and nasal polyposis.',
  },
  {
    icon: Wind,
    title: 'Septoplasty & Turbinoplasty',
    desc: 'Restoring nasal airflow and correcting deviated nasal septum (DNS) with rapid postoperative recovery.',
  },
  {
    icon: Ear,
    title: 'Tympanoplasty & Mastoidectomy',
    desc: 'Microscopic and endoscopic repair of perforated eardrums and surgical clearance for CSOM / cholesteatoma.',
  },
  {
    icon: Activity,
    title: 'Vertigo & Vestibular Evaluation',
    desc: 'Clinical workup and management for BPPV, Meniere’s disease, labyrinthitis, and balance disorders.',
  },
  {
    icon: Mic2,
    title: 'Plasma / Coblation Adenotonsillectomy',
    desc: 'Gentle, low-pain pediatric and adult adenoid and tonsil surgery using advanced plasma dissection.',
  },
  {
    icon: HeartPulse,
    title: 'Airway Management & Tracheostomy',
    desc: 'Emergency and critical airway procedures, stoma revisions, and intensive care pulmonary support.',
  },
  {
    icon: Slice,
    title: 'Facial Plastic & Head-Neck Surgery',
    desc: 'Specialized local flap reconstructions (Karapandzic & forehead flap), salivary gland and neck mass management.',
  },
]

export function Services() {
  return (
    <section id="services" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Clinical & Surgical Care"
          title="Comprehensive ENT Services Under One Roof"
          description="From advanced endoscopic outpatient diagnostics to tertiary surgical interventions, delivering tailored care for patients of all ages."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 70}>
              <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <item.icon className="size-6" />
                    </span>
                    <ArrowUpRight className="size-5 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>
                  <h3 className="mt-5 font-heading text-base font-bold leading-snug text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
