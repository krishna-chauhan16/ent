'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { cn } from '@/lib/utils'
import { site } from '@/lib/site'

const faqs = [
  {
    q: 'Where does Dr. Vaidik Chauhan consult and operate?',
    a: `Dr. Vaidik Chauhan is the Director & Head, Department of ENT at Atulya Superspeciality Hospital & ICU (2nd Floor, Elite Mangnum, Bhuyangdev Cross Rd, Ahmedabad). He also consults as Visiting Consultant ENT Surgeon at KD Hospital and Prathana Hospital in Ahmedabad.`,
  },
  {
    q: 'How can I book an appointment with Dr. Vaidik Chauhan?',
    a: `You can directly book an appointment by calling or sending a WhatsApp message to +91 9601074848, contacting Atulya Hospital at 09727579000, or filling out the appointment request form on this website.`,
  },
  {
    q: 'What are the main surgical specialties of Dr. Vaidik Chauhan?',
    a: 'Dr. Vaidik Chauhan has performed over 6,000 surgeries specializing in Septoplasty (1200+ cases), Endoscopic Sinus Surgery / FESS (1000+ cases), Tympanoplasty eardrum repair (1200+ cases), Mastoidectomy for CSOM (700+ cases), Tracheostomy airway rescue (300+ cases), and Plasma adenotonsillectomy.',
  },
  {
    q: 'Are ENT surgeries like Septoplasty & Tympanoplasty done as day-care procedures?',
    a: 'Yes, most endoscopic sinus surgeries, septoplasties, and micro-ear tympanoplasties are performed under high-definition visualization as same-day or minimal-stay procedures with rapid recovery and minimal post-operative discomfort.',
  },
  {
    q: 'What diagnostics are available at the clinic on the same day?',
    a: 'We offer high-definition video nasal endoscopy, diagnostic oto-endoscopy, clinical vestibular & vertigo examination, and coordinate digital audiometry and CT imaging support in-house.',
  },
  {
    q: 'Does the hospital provide emergency ENT & airway trauma support?',
    a: 'Yes. Atulya Superspeciality Hospital provides 24x7 multi-specialty ICU backup, emergency airway intervention, tracheostomy facilities, and foreign body extraction round the clock.',
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
          <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{a}</p>
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
          eyebrow="Frequently Asked Questions"
          title="Everything You Need to Know"
          description="Common questions regarding consultations, procedures, hospital locations, and ENT care under Dr. Vaidik Chauhan."
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
