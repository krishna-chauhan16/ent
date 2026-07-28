import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const articles = [
  {
    img: '/article-sinus.png',
    category: 'Sinus Health',
    title: '5 signs your chronic congestion needs a specialist',
    excerpt:
      'When over-the-counter remedies stop working, these symptoms may point to a treatable sinus condition.',
    readTime: '4 min read',
  },
  {
    img: '/article-hearing.png',
    category: 'Hearing Care',
    title: 'Protecting your hearing in a noisy world',
    excerpt:
      'Simple, evidence-based habits to preserve your hearing and know when it’s time for a test.',
    readTime: '5 min read',
  },
  {
    img: '/article-sleep.png',
    category: 'Sleep & Snoring',
    title: 'Is it just snoring, or could it be sleep apnea?',
    excerpt:
      'Understanding the difference could protect your heart, your energy, and your quality of life.',
    readTime: '6 min read',
  },
]

export function HealthLibrary() {
  return (
    <section id="health-library" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Health Library"
          title="Guidance you can rely on"
          description="Expert-reviewed articles to help you understand your symptoms and make informed decisions about your care."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article, i) => (
            <Reveal key={article.title} delay={(i % 3) * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={article.img || '/placeholder.svg'}
                    alt=""
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold text-accent backdrop-blur">
                    {article.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {article.readTime}
                  </div>
                  <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-foreground">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <a
                    href="#health-library"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
                  >
                    Read article
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
