import { Award, Cpu, HandHeart, Building2 } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const features = [
  {
    icon: Award,
    title: '20+ Years of Experience',
    desc: 'Two decades of surgical excellence with 15,000+ patients treated and a 98% satisfaction rate.',
  },
  {
    icon: Cpu,
    title: 'Advanced Technology',
    desc: 'Image-guided navigation, 4K endoscopy, and robotic-assisted techniques for precise, safer outcomes.',
  },
  {
    icon: HandHeart,
    title: 'Personalized Care',
    desc: 'Unhurried consultations and treatment plans built around your goals, comfort, and lifestyle.',
  },
  {
    icon: Building2,
    title: 'Hospital Affiliation',
    desc: 'Full access to accredited operating theatres, ICU support, and a multidisciplinary care team.',
  },
]

export function WhyChoose() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Care you can trust, results you can feel"
          description="The combination of clinical expertise, modern technology, and genuine compassion that sets our practice apart."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-chart-3 text-accent-foreground shadow-md">
                  <f.icon className="size-8" />
                </span>
                <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
