'use client'

import { useState } from 'react'
import {
  BookOpen,
  FileText,
  Award,
  ExternalLink,
  Search,
  CheckCircle2,
  Bookmark,
  Sparkles,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { cn } from '@/lib/utils'

type Category = 'all' | 'journal' | 'conference'

interface Publication {
  type: 'journal' | 'conference'
  badge: string
  title: string
  journalOrEvent: string
  dateOrVol?: string
  topic: string
  keyHighlight: string
}

const publications: Publication[] = [
  {
    type: 'journal',
    badge: 'International Journal',
    title:
      'Reconstruction of Nose and Upper Lip with Reverse Karapandzic & Median Forehead Flap – A Case Report',
    journalOrEvent: 'International Journal of Scientific Research',
    dateOrVol: 'Vol 06, Issue 11, November 2017',
    topic: 'Facial Plastic & Reconstruction',
    keyHighlight:
      'Advanced complex dual-flap facial reconstructive surgical technique for composite nasal and labial defect repair.',
  },
  {
    type: 'journal',
    badge: 'National Indexed Journal',
    title:
      'CSF Gusher and its Management in Cochlear Implant Patient with Enlarged Vestibular Aqueduct',
    journalOrEvent: 'Indian Journal of Otolaryngology and Head & Neck Surgery',
    dateOrVol: 'Indexed Peer-Reviewed',
    topic: 'Cochlear Implant & Neuro-Otology',
    keyHighlight:
      'Critical surgical strategies and intraoperative sealing protocols for high-pressure perilymph gusher during cochleostomy.',
  },
  {
    type: 'journal',
    badge: 'National Indexed Journal',
    title: 'Plasma Dissection vs Tissue Dissection in Adenoid Surgery',
    journalOrEvent: 'Indian Journal of Otolaryngology and Head & Neck Surgery',
    dateOrVol: 'Comparative Surgical Study',
    topic: 'Pediatric & Advanced Laryngology',
    keyHighlight:
      'Comparative trial evaluating intraoperative blood loss, operative time, and postoperative healing between plasma coblation vs cold dissection.',
  },
  {
    type: 'journal',
    badge: 'International Journal',
    title: 'Temporal Bone Osteoma – A Case Report',
    journalOrEvent: 'International Journal of Scientific Research',
    dateOrVol: 'Case Study',
    topic: 'Otology & Skull Base',
    keyHighlight:
      'Diagnostic workup, HRCT evaluation, and complete surgical excision of rare benign temporal bone osteoma.',
  },
  {
    type: 'journal',
    badge: 'State Medical Journal',
    title: 'Vertigo in ENT OPD – A Study of 200 Patients',
    journalOrEvent: 'Gujarat Medical Journal',
    dateOrVol: 'Vol 14, Issue 7',
    topic: 'Vestibular & Balance Medicine',
    keyHighlight:
      'Extensive clinical epidemiological study classifying peripheral vs central vestibular etiologies in 200 outpatient presentations.',
  },
  {
    type: 'conference',
    badge: 'Oral Paper Presentation',
    title: 'Endoscopic Tympanoplasty – A Systemic Review of Outcome',
    journalOrEvent:
      '10th Dr L H Hiranandani AOI Midterm Conference, SGPGI, Lucknow',
    dateOrVol: 'July 2016',
    topic: 'Endoscopic Micro-Ear Surgery',
    keyHighlight:
      'Evaluated graft uptake rates, cosmetic advantages, and hearing improvement in transcanal endoscopic vs microscopic tympanoplasty.',
  },
  {
    type: 'conference',
    badge: 'Poster Presentation',
    title: 'Supraglottic Lipoma : A Rare Case Report',
    journalOrEvent:
      'CONSCIENTIA 2015 – 39th Annual Conference of AOI Gujarat State Branch',
    dateOrVol: 'Ahmedabad',
    topic: 'Laryngeal Oncology & Pathology',
    keyHighlight:
      'Detailed presentation on rare benign supraglottic mesenchymal tumor, airway preservation and endoscopic resection.',
  },
  {
    type: 'conference',
    badge: 'Poster Presentation',
    title: 'Bartter Syndrome – A Case Report',
    journalOrEvent:
      'CME on System Monitoring in Critical Care, AMC MET Medical College & L.G Hospital',
    dateOrVol: 'Maninagar, Ahmedabad',
    topic: 'Critical Care & System Monitoring',
    keyHighlight:
      'Clinical management of rare renal tubular disorder presenting with electrolyte imbalance in critical hospital care.',
  },
]

export function ResearchPublications() {
  const [activeTab, setActiveTab] = useState<Category>('all')

  const filtered =
    activeTab === 'all'
      ? publications
      : publications.filter((p) => p.type === activeTab)

  return (
    <section id="publications" className="bg-secondary/40 py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Research & Academics"
          title="14+ Research Publications & Scientific Papers"
          description="Evidence-based medicine demonstrated through active peer-reviewed publications in reputed National & International Otolaryngology journals."
        />

        {/* Academic summary stat banner */}
        <Reveal className="mt-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
              <span className="block font-heading text-3xl font-extrabold text-accent">14+</span>
              <span className="text-xs font-semibold text-foreground mt-1 block">National &amp; International Publications</span>
              <span className="text-[11px] text-muted-foreground">Original studies, case reports &amp; reviews</span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
              <span className="block font-heading text-3xl font-extrabold text-accent">Peer Reviewer</span>
              <span className="text-xs font-semibold text-foreground mt-1 block">Medical Journal Reviewer</span>
              <span className="text-[11px] text-muted-foreground">Reviewing cutting-edge ENT literature</span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
              <span className="block font-heading text-3xl font-extrabold text-accent">National Speaker</span>
              <span className="text-xs font-semibold text-foreground mt-1 block">Conference Presentations</span>
              <span className="text-[11px] text-muted-foreground">AOI, SGPGI Lucknow, CONSCIENTIA</span>
            </div>
          </div>
        </Reveal>

        {/* Category Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={cn(
              'rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all',
              activeTab === 'all'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'bg-card border border-border text-foreground hover:bg-muted',
            )}
          >
            All Works ({publications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('journal')}
            className={cn(
              'rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all',
              activeTab === 'journal'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'bg-card border border-border text-foreground hover:bg-muted',
            )}
          >
            Journal Publications (5 Featured)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('conference')}
            className={cn(
              'rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all',
              activeTab === 'conference'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'bg-card border border-border text-foreground hover:bg-muted',
            )}
          >
            Conference Papers &amp; Posters (3 Featured)
          </button>
        </div>

        {/* Publications Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          {filtered.map((item, idx) => (
            <Reveal key={item.title} delay={(idx % 2) * 80}>
              <article className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-accent hover:shadow-xl">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold text-accent">
                      <FileText className="size-3" />
                      {item.badge}
                    </span>
                    {item.dateOrVol && (
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {item.dateOrVol}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3.5 font-heading text-lg font-bold leading-snug text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold text-accent/90">
                    {item.journalOrEvent}
                  </p>

                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                    {item.keyHighlight}
                  </p>
                </div>

                <div className="mt-5 border-t border-border/70 pt-3 flex items-center justify-between">
                  <span className="rounded-lg bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground">
                    {item.topic}
                  </span>
                  <span className="text-[11px] font-semibold text-accent flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Published Research
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
