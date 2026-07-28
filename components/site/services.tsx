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
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const services = [
  {
    icon: Stethoscope,
    title: 'Comprehensive ENT Consultation',
    desc: 'Thorough evaluation with same-day nasal endoscopy and diagnostic imaging.',
  },
  {
    icon: Wind,
    title: 'Endoscopic Sinus Surgery',
    desc: 'Image-guided, minimally invasive procedures for chronic sinus disease.',
  },
  {
    icon: Ear,
    title: 'Hearing & Balance Care',
    desc: 'Audiometry, tinnitus management, and vertigo rehabilitation.',
  },
  {
    icon: Mic2,
    title: 'Voice & Swallowing Therapy',
    desc: 'Laryngoscopy and personalized therapy for voice restoration.',
  },
  {
    icon: Moon,
    title: 'Snoring & Sleep Apnea',
    desc: 'Sleep studies and airway surgery for better, safer rest.',
  },
  {
    icon: Slice,
    title: 'Tonsil & Adenoid Surgery',
    desc: 'Day-care procedures with rapid, comfortable recovery.',
  },
  {
    icon: Baby,
    title: 'Pediatric ENT Services',
    desc: 'Ear tubes, allergy care, and airway support for children.',
  },
  {
    icon: Activity,
    title: 'Thyroid & Neck Surgery',
    desc: 'Precise management of thyroid nodules and neck masses.',
  },
]

export function Services() {
  return (
    <section id="services" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Complete care, from first visit to full recovery"
          description="A full spectrum of medical and surgical ENT services under one roof, tailored to every stage of life."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 70}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <ArrowUpRight className="absolute right-5 top-5 size-5 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                  <item.icon className="size-6" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold leading-snug text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
