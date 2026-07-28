'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Do I need a referral to book an appointment?',
    a: 'No referral is required. You can request an appointment directly through our online form or by calling the clinic. If your insurance plan requires a referral for specialist visits, our team will help you coordinate one.',
  },
  {
    q: 'What should I bring to my first visit?',
    a: 'Please bring a photo ID, your insurance card, a list of current medications, and any prior imaging (CT scans, audiograms) or reports related to your ENT concern. Arriving 15 minutes early helps us complete your intake smoothly.',
  },
  {
    q: 'Are ENT surgeries performed as day-care procedures?',
    a: 'Many of our procedures — including sinus surgery, tonsillectomy, and ear tube placement — are performed as same-day day-care surgeries, allowing you to recover in the comfort of your own home. Your surgeon will advise what to expect for your specific case.',
  },
  {
    q: 'How long is the recovery after sinus surgery?',
    a: 'Most patients return to light activity within 3–5 days and to full routine within 1–2 weeks. You will have a follow-up visit to monitor healing, and detailed aftercare instructions are provided before you leave.',
  },
  {
    q: 'Do you treat children as well as adults?',
    a: 'Yes. We provide dedicated pediatric ENT care in a child-friendly environment, treating ear infections, tonsil and adenoid issues, hearing concerns, and airway conditions for patients of all ages.',
  },
  {
    q: 'Which insurance plans do you accept?',
    a: 'We accept most major insurance providers and offer transparent self-pay options. Please contact our front desk with your plan details and we will verify your coverage and estimated costs before your visit.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm transition-colors">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-2xl"
        >
          <span className="font-heading text-base font-semibold text-foreground sm:text-lg">
            {q}
          </span>
          <span
            className={cn(
              'inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-accent transition-transform duration-300',
              open && 'rotate-45 bg-accent text-accent-foreground',
            )}
          >
            <Plus className="size-5" />
          </span>
        </button>
      </h3>
      <div
        className={cn(
          'grid transition-all duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Answers to common questions"
          description="Everything you need to know before your visit. Can’t find your answer? Give us a call."
        />
        <Reveal className="mt-12 flex flex-col gap-4">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
