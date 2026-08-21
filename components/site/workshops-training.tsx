'use client'

import {
  Award,
  BadgeCheck,
  HeartHandshake,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Activity,
  HeartPulse,
  Users,
  CheckCircle2,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const surgicalWorkshops = [
  {
    title: 'Certified Endoscopic Sinus Surgeon',
    center: 'CEMAST Mumbai by Karl Storz',
    highlight: 'Advanced certification in precision endoscopic sinus & skull base techniques.',
    badge: 'Karl Storz Certified',
  },
  {
    title: 'CIGICON 2018 Cochlear Implant Training',
    center: 'Hands-on Cochlear Implant Surgery Training',
    highlight: 'Electrode array insertion, round window approach & neural telemetry.',
    badge: 'Hands-on Implantology',
  },
  {
    title: 'Skull Base Surgery Workshop',
    center: 'Royal College of Surgeons of England Recognised',
    highlight: 'International accreditation in anterior & lateral skull base approaches.',
    badge: 'RCS England Recognised',
  },
  {
    title: 'CIRCONFERENZA (Skull Base 360°)',
    center: 'GMERS Medical College, Sola, Ahmedabad (August 2017)',
    highlight: 'Comprehensive live skull base dissection & endoscopic anatomy.',
    badge: 'Skull Base 360°',
  },
  {
    title: 'MOMENTUM I & II Live ENT Workshops',
    center: 'B.J Medical College & Civil Hospital (2017)',
    highlight: 'Update on Radiofrequency coblation, micro-laryngeal & otology surgery.',
    badge: 'Live Surgical Training',
  },
  {
    title: 'A to Z Master Class: Cochlear Implantation',
    center: 'GMERS Gandhinagar (April 2017)',
    highlight: 'Advanced masterclass in pediatric and adult cochlear implantation.',
    badge: 'Masterclass',
  },
  {
    title: '6th ENT Update',
    center: 'Maulana Azad Medical College (MAMC), New Delhi (Dec 2017)',
    highlight: 'National update on state-of-the-art otolaryngology advancements.',
    badge: 'National MAMC Update',
  },
  {
    title: 'METAMORPHOSIS & CONSCIENTIA',
    center: 'B.J. Medical College & AOI Gujarat State Branch',
    highlight: 'Live surgical workshop & annual otorhinolaryngology scientific assemblies.',
    badge: 'Surgical Assemblies',
  },
]

const traumaAndCommunity = [
  {
    icon: ShieldCheck,
    title: 'Basic Life Support (BLS) Certification',
    org: 'American Heart Association (AHA)',
    desc: 'Certified in high-performance CPR, AED and life support emergency airway resuscitation.',
  },
  {
    icon: Activity,
    title: '57th National Trauma Management Course',
    org: 'IATSIC (International Association for Trauma & Intensive Care)',
    desc: 'Advanced surgical and airway stabilization protocols for severe multi-system trauma.',
  },
  {
    icon: HeartPulse,
    title: 'Mechanical Ventilation & Critical Care (ASHRAICON 13)',
    org: 'Critical Care Medical Assembly',
    desc: 'Specialized training in ABC of critical care, ventilator management and tracheostomy care.',
  },
  {
    icon: Users,
    title: 'Team Leader: Pulse Polio Immunization',
    org: 'Jamalpur Region, Ahmedabad City',
    desc: 'Led the pulse polio oral vaccination initiative for all children under 5 years of age.',
  },
  {
    icon: HeartHandshake,
    title: 'School Health Program & Factory Worker Camps',
    org: 'Ahmedabad Municipal Corporation & Chiripal Textile',
    desc: 'Extensive school health appraisals for children & occupational health screenings for industrial workers.',
  },
  {
    icon: Stethoscope,
    title: 'Community Diabetes & Heart Awareness Camps',
    org: 'Krishna Heart Institute & Samvedna Foundation',
    desc: 'Conducted free health camps & community lectures on diabetes complications and ocular/cardiac health.',
  },
]

export function WorkshopsTraining() {
  return (
    <section id="workshops" className="bg-background py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Continuous Learning & Leadership"
          title="Advanced Surgical Training & Community Impact"
          description="A career dedicated to rigorous surgical workshops, hands-on masterclasses, and meaningful community health initiatives across Gujarat."
        />

        {/* Surgical Masterclasses Grid */}
        <div className="mt-14">
          <Reveal>
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Microscope className="size-5" />
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Advanced ENT &amp; Skull Base Surgical Workshops
              </h3>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {surgicalWorkshops.map((w, idx) => (
              <Reveal key={w.title} delay={(idx % 4) * 60}>
                <div className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-accent hover:shadow-lg">
                  <div>
                    <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                      {w.badge}
                    </span>
                    <h4 className="mt-3 font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors">
                      {w.title}
                    </h4>
                    <p className="mt-1 text-xs font-semibold text-accent/80">
                      {w.center}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {w.highlight}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-border/60 pt-2.5 flex items-center gap-1 text-[11px] font-medium text-accent">
                    <BadgeCheck className="size-3.5" /> Hands-on Certified
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Trauma, Critical Care & Community Service */}
        <div className="mt-16">
          <Reveal>
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <HeartHandshake className="size-5" />
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                Trauma, Life Support &amp; Community Health Service
              </h3>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {traumaAndCommunity.map((tc, idx) => (
              <Reveal key={tc.title} delay={(idx % 3) * 70}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-accent/40 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <tc.icon className="size-5.5" />
                    </span>
                    <div>
                      <h4 className="font-heading text-sm font-bold text-foreground">
                        {tc.title}
                      </h4>
                      <p className="text-[11px] font-medium text-accent">
                        {tc.org}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3.5 text-xs text-muted-foreground leading-relaxed">
                    {tc.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
