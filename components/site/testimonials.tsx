'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star, ShieldCheck } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { cn } from '@/lib/utils'
import { site } from '@/lib/site'

const testimonials = [
  {
    quote:
      'I suffered from severe nasal blockage and chronic sinusitis for years. Dr. Vaidik Chauhan performed FESS and Septoplasty. The procedure was smooth, painless, and my breathing is completely clear now. Truly the best ENT surgeon in Ahmedabad!',
    name: 'Rajesh Patel',
    detail: 'FESS & Septoplasty Patient',
    rating: 5,
  },
  {
    quote:
      'My mother had a large eardrum perforation with frequent ear discharge. Dr. Chauhan performed Tympanoplasty with microscopic precision. Her hearing has significantly improved and the ear is completely dry.',
    name: 'Sneha Shah',
    detail: 'Tympanoplasty (Ear Drum Repair)',
    rating: 5,
  },
  {
    quote:
      'Dr. Vaidik Chauhan treated my 6-year-old son for enlarged adenoids with plasma dissection. The recovery was remarkably quick and comfortable. His bedside manner is gentle, reassuring, and thorough.',
    name: 'Amit & Hiral Trivedi',
    detail: 'Pediatric Plasma Adenoidectomy',
    rating: 5,
  },
  {
    quote:
      'I was suffering from intense vertigo and dizziness that stopped me from driving. Dr. Chauhan conducted detailed vestibular workup, diagnosed BPPV accurately, and performed repositioning. I felt immediate relief!',
    name: 'Bhavna Ben Desai',
    detail: 'Vertigo & Balance Evaluation',
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
          <span className="mb-4 inline-flex items-center rounded-full bg-accent/20 px-4 py-1.5 text-xs sm:text-sm font-semibold text-accent-foreground dark:bg-accent/15 dark:text-accent">
            <ShieldCheck className="size-4 mr-1.5" /> Patient Experiences
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground dark:text-foreground sm:text-4xl">
            Trusted by Thousands of Patients Across Gujarat
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/75 dark:text-muted-foreground">
            Read real recovery journeys from patients treated by {site.doctor.name}.
          </p>
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
                  <div className="mx-auto rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-10">
                    <Quote className="size-9 text-accent/30" />
                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-5 fill-accent text-accent" />
                      ))}
                    </div>
                    <blockquote className="mt-5 text-pretty text-base sm:text-lg leading-relaxed text-foreground">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-6 border-t border-border pt-4 flex items-center justify-between">
                      <div>
                        <p className="font-heading font-bold text-foreground text-base">{t.name}</p>
                        <p className="text-xs text-accent font-medium">{t.detail}</p>
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                        Verified Review
                      </span>
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
