'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    quote:
      'After years of chronic sinus infections, Dr. Hart finally gave me lasting relief. The surgery was quick and I could breathe freely within days. I only wish I had come sooner.',
    name: 'Margaret L.',
    detail: 'Endoscopic Sinus Surgery',
    rating: 5,
  },
  {
    quote:
      'She took the time to explain my son’s recurring ear infections in a way we actually understood. The whole team was so gentle and patient with him. Highly recommended.',
    name: 'David & Priya R.',
    detail: 'Pediatric ENT',
    rating: 5,
  },
  {
    quote:
      'I was terrified about my thyroid surgery, but Dr. Hart’s calm confidence put me at ease. The scar is barely visible and my recovery was smoother than I imagined.',
    name: 'Anthony C.',
    detail: 'Thyroid Surgery',
    rating: 5,
  },
  {
    quote:
      'My voice is my career. When hoarseness threatened it, Dr. Hart’s precise diagnosis and therapy plan brought it back completely. Forever grateful.',
    name: 'Rebecca M.',
    detail: 'Voice Disorder Treatment',
    rating: 5,
  },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = testimonials.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  return (
    <section className="bg-primary py-20 dark:bg-secondary lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground dark:bg-accent/15 dark:text-accent">
            Patient Stories
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground dark:text-foreground sm:text-4xl">
            Trusted by thousands of families
          </h2>
        </div>

        <div
          className="relative mt-12"
          role="region"
          aria-roledescription="carousel"
          aria-label="Patient testimonials"
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="w-full shrink-0 px-1"
                  aria-hidden={testimonials[index].name !== t.name}
                >
                  <div className="mx-auto rounded-3xl border border-border bg-card p-8 shadow-xl sm:p-10">
                    <Quote className="size-10 text-accent/30" />
                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <blockquote className="mt-5 text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-6 border-t border-border pt-5">
                      <p className="font-heading font-bold text-foreground">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.detail}</p>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-5" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose testimonial">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-2.5 rounded-full transition-all duration-300',
                    i === index ? 'w-8 bg-accent' : 'w-2.5 bg-card/60 hover:bg-card',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
