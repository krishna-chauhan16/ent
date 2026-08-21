import Image from 'next/image'
import {
  Wind,
  Ear,
  Activity,
  Scissors,
  ShieldCheck,
  Zap,
  Layers,
  HeartPulse,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

interface Milestone {
  icon: typeof Wind
  title: string
  cases: string
  count: number
  category: string
  desc: string
  tags: string[]
}

const milestones: Milestone[] = [
  {
    icon: Wind,
    title: 'Septoplasty',
    cases: '1,200+',
    count: 1200,
    category: 'Rhinology & Airway',
    desc: 'Correction of deviated nasal septum (DNS), turbinectomy, functional nasal airway reconstruction and cosmetic septorhinoplasty.',
    tags: ['Deviated Septum', 'Airway Clearance', 'Nasal Obstruction'],
  },
  {
    icon: Wind,
    title: 'FESS (Endoscopic Sinus Surgery)',
    cases: '1,000+',
    count: 1000,
    category: 'Advanced Endoscopy',
    desc: 'Minimally invasive Karl Storz image-guided endoscopic sinus surgery for chronic sinusitis, polyposis, frontal/sphenoid sinus clearance.',
    tags: ['Sinusitis', 'Nasal Polyps', 'Karl Storz HD', 'Endoscopic'],
  },
  {
    icon: Ear,
    title: 'Tympanoplasty',
    cases: '1,200+',
    count: 1200,
    category: 'Micro-Otology',
    desc: 'Microscopic & endoscopic eardrum perforation repair, ossicular chain reconstruction, and restoration of conductive hearing.',
    tags: ['Perforated Eardrum', 'Hearing Restoration', 'Micro-Ear'],
  },
  {
    icon: Ear,
    title: 'Mastoidectomy',
    cases: '700+',
    count: 700,
    category: 'Advanced Otology',
    desc: 'Cortical, modified radical & canal wall down mastoidectomy for eradication of chronic suppurative otitis media (CSOM) & cholesteatoma.',
    tags: ['Cholesteatoma', 'CSOM', 'Temporal Bone', 'Ear Infection'],
  },
  {
    icon: HeartPulse,
    title: 'Tracheostomy',
    cases: '300+',
    count: 300,
    category: 'Critical Airway Management',
    desc: 'Emergency and elective open/percutaneous tracheostomy procedures for intensive care patients, upper airway obstruction & trauma.',
    tags: ['Emergency Airway', 'ICU Care', 'Stoma Management'],
  },
  {
    icon: Scissors,
    title: 'Other ENT Procedures',
    cases: '900+',
    count: 900,
    category: 'Comprehensive ENT',
    desc: 'Plasma adenoidectomy, tonsillectomy, microlaryngeal surgery (MLS), foreign body removal, skull base flaps and pediatric ENT.',
    tags: ['Plasma Adenoid', 'Coblation/RF', 'Microlaryngeal', 'Tonsils'],
  },
]

export function SurgicalMilestones() {
  return (
    <section id="milestones" className="bg-secondary/60 py-20 lg:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core Competencies"
          title="6,000+ Successful ENT Surgeries"
          description="Proven surgical mastery across Otology, Rhinology, and Head-Neck interventions with exceptional patient outcomes."
        />

        {/* Surgical Total Card Banner */}
        <Reveal className="mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-r from-primary via-primary/95 to-card p-6 sm:p-8 text-primary-foreground shadow-xl dark:border-border dark:bg-card">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="relative size-20 sm:size-24 shrink-0 rounded-2xl overflow-hidden border-2 border-accent shadow-lg bg-card">
                  <Image
                    src="/doctor-scrubs.jpg"
                    alt="Dr. Vaidik Chauhan in Surgical OT Scrubs"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-0.5 text-xs font-bold text-accent mb-1.5">
                    <ShieldCheck className="size-3.5" />
                    <span>Lead ENT Consultant Surgeon</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                    6,000+ Total ENT Cases Performed
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-primary-foreground/80 dark:text-muted-foreground max-w-xl">
                    10+ years of dedicated surgical precision across advanced modular operation theatres in Ahmedabad.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-center backdrop-blur">
                  <span className="block font-heading text-2xl font-bold text-accent">100%</span>
                  <span className="text-[11px] text-white/80">Clinical Dedication</span>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-center backdrop-blur">
                  <span className="block font-heading text-2xl font-bold text-accent">14+</span>
                  <span className="text-[11px] text-white/80">Publications</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Milestone Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {milestones.map((m, i) => (
            <Reveal key={m.title} delay={(i % 3) * 70}>
              <article className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-13 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      <m.icon className="size-6.5" />
                    </span>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-accent/15 px-3 py-1 font-heading text-base font-extrabold text-accent">
                        {m.cases}
                      </span>
                      <span className="block text-[11px] font-medium text-muted-foreground mt-0.5">
                        Documented Cases
                      </span>
                    </div>
                  </div>

                  <span className="mt-4 block text-xs font-semibold uppercase tracking-wider text-accent">
                    {m.category}
                  </span>
                  <h3 className="mt-1 font-heading text-xl font-bold text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/70 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
