import { Wind, Ear, Mic2, Moon, Baby, Slice } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const specialties = [
  {
    icon: Wind,
    title: 'Sinus Surgery',
    desc: 'Minimally invasive endoscopic relief for chronic sinusitis and polyps.',
  },
  {
    icon: Ear,
    title: 'Hearing Loss',
    desc: 'Comprehensive diagnostics, implants, and micro-ear surgery.',
  },
  {
    icon: Mic2,
    title: 'Voice Disorders',
    desc: 'Laryngology care for hoarseness, nodules, and vocal cord issues.',
  },
  {
    icon: Moon,
    title: 'Sleep Apnea',
    desc: 'Airway evaluation and surgical solutions for restful sleep.',
  },
  {
    icon: Baby,
    title: 'Pediatric ENT',
    desc: 'Gentle, child-friendly care for ears, tonsils, and adenoids.',
  },
  {
    icon: Slice,
    title: 'Head & Neck Surgery',
    desc: 'Expert management of thyroid, salivary, and neck conditions.',
  },
]

export function Specialties() {
  return (
    <section id="specialties" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Surgical Specialties"
          title="Focused expertise across ENT care"
          description="Advanced, evidence-based treatment for the conditions that affect how you breathe, hear, speak, and sleep."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 80}>
              <article className="group h-full rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
                <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                  <item.icon className="size-7" />
                </span>
                <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
