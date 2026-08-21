import { Award, Cpu, HandHeart, Building2, BookOpen, ShieldCheck } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const features = [
  {
    icon: Award,
    title: '6,000+ Successful Surgeries',
    desc: 'Extensive documented track record across Septoplasty, FESS, Tympanoplasty, Mastoidectomy, and Tracheostomy.',
  },
  {
    icon: Cpu,
    title: 'Karl Storz Certified Endoscopy',
    desc: 'Precision micro-endoscopic and high-definition video-guided technologies for safer, tissue-preserving surgery.',
  },
  {
    icon: Building2,
    title: 'Director & Head at Atulya Hospital',
    desc: 'Fully equipped modular operation theatres, 24x7 ICU, and multidisciplinary super-specialty support in Ahmedabad.',
  },
  {
    icon: BookOpen,
    title: 'Academic & Research Pioneer',
    desc: 'Over 14 publications in national/international journals, cadaveric dissection mentorship, and ongoing surgical education.',
  },
]

export function WhyChoose() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Dr. Vaidik Chauhan"
          title="Surgical Precision, Academic Excellence & Patient-First Care"
          description="Combining advanced microsurgical techniques, super-specialty hospital infrastructure, and an empathetic bedside approach."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
                <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm">
                  <f.icon className="size-8" />
                </span>
                <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
