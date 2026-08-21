import { Wind, Ear, Mic2, HeartPulse, Baby, Slice, Stethoscope, ShieldCheck } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const specialties = [
  {
    icon: Wind,
    title: 'Rhinology & FESS Sinus Surgery',
    desc: 'Advanced Karl Storz endoscopic sinus surgery, polyposis excision, DNS correction, and endoscopic skull base approaches.',
    stat: '1,000+ FESS & 1,200+ Septoplasty',
  },
  {
    icon: Ear,
    title: 'Otology & Micro-Ear Surgery',
    desc: 'Tympanoplasty, Mastoidectomy for CSOM/cholesteatoma, ossiculoplasty, vertigo workup & cochlear implantation.',
    stat: '1,200+ Tympanoplasty & 700+ Mastoidectomy',
  },
  {
    icon: Mic2,
    title: 'Throat & Laryngology',
    desc: 'Coblation/plasma adenoidectomy, tonsillectomy, microlaryngeal vocal surgery, and evaluation of hoarseness.',
    stat: '900+ Procedures',
  },
  {
    icon: HeartPulse,
    title: 'Critical Airway & Tracheostomy',
    desc: 'Emergency and elective surgical airway management, stoma care, and multi-disciplinary ICU ENT interventions.',
    stat: '300+ Tracheostomy Cases',
  },
  {
    icon: Baby,
    title: 'Pediatric ENT Care',
    desc: 'Gentle, child-friendly care for recurrent ear discharge, pediatric adenotonsillar hypertrophy, airway stridor, and glue ear.',
    stat: 'Comprehensive Pediatric ENT',
  },
  {
    icon: Slice,
    title: 'Head & Neck / Facial Plastic',
    desc: 'Forehead and Karapandzic flaps for lip/nasal reconstruction, salivary gland excision, and head-neck tumors.',
    stat: 'Published Surgical Expertise',
  },
]

export function Specialties() {
  return (
    <section id="specialties" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Surgical Specialties"
          title="Focused Expertise Across Modern ENT Surgery"
          description="Evidence-based surgical precision across Otology, Rhinology, Laryngology, and Head-Neck conditions with over 6,000 documented cases."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 80}>
              <article className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
                <div>
                  <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                    <item.icon className="size-7" />
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
                <div className="mt-6 border-t border-border/70 pt-3">
                  <span className="text-xs font-semibold text-accent flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    {item.stat}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
