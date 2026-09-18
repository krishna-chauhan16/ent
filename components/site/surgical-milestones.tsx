'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Wind,
  Ear,
  Scissors,
  ShieldCheck,
  HeartPulse,
  Sparkles,
  Award,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Stethoscope,
  Microscope,
  Zap,
  Layers,
  Clock,
  Sparkle,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { BookAppointmentButton } from './appointment-dialog'

interface ProcedureMilestone {
  id: string
  icon: typeof Wind
  title: string
  cases: string
  count: number
  percentage: string
  category: 'Rhinology' | 'Otology' | 'Pediatric' | 'Emergency' | 'Laryngology'
  categoryLabel: string
  equipment: string
  accentColor: {
    badge: string
    iconBg: string
    iconColor: string
    borderHover: string
    progressColor: string
  }
  desc: string
  tags: string[]
  highlights: string
}

const procedures: ProcedureMilestone[] = [
  {
    id: 'septoplasty',
    icon: Wind,
    title: 'Septoplasty & Airway Reconstruction',
    cases: '1,200+',
    count: 1200,
    percentage: '20%',
    category: 'Rhinology',
    categoryLabel: 'Rhinology & Airway',
    equipment: 'Karl Storz HD + Radiofrequency',
    accentColor: {
      badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
      iconBg: 'bg-cyan-500/10 group-hover:bg-cyan-500',
      iconColor: 'text-cyan-600 dark:text-cyan-400 group-hover:text-white',
      borderHover: 'hover:border-cyan-500/50',
      progressColor: 'bg-cyan-500',
    },
    desc: 'Precision correction of deviated nasal septum (DNS), turbinoplasty, functional nasal airway clearance, and aesthetic septorhinoplasty.',
    tags: ['Deviated Septum (DNS)', 'Turbinate Hypertrophy', 'Nasal Obstruction', 'Snoring & Sleep Apnea'],
    highlights: 'Day-care discharge · Rapid painless recovery',
  },
  {
    id: 'tympanoplasty',
    icon: Ear,
    title: 'Tympanoplasty & Hearing Restoration',
    cases: '1,200+',
    count: 1200,
    percentage: '20%',
    category: 'Otology',
    categoryLabel: 'Micro-Otology',
    equipment: 'Carl Zeiss Sensera Optics',
    accentColor: {
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      iconBg: 'bg-amber-500/10 group-hover:bg-amber-500',
      iconColor: 'text-amber-600 dark:text-amber-400 group-hover:text-white',
      borderHover: 'hover:border-amber-500/50',
      progressColor: 'bg-amber-500',
    },
    desc: 'High-magnification microscopic and endoscopic eardrum perforation repair, ossicular chain reconstruction, and conductive hearing restoration.',
    tags: ['Perforated Eardrum', 'Hearing Loss', 'Ossiculoplasty', 'Chronic Ear Discharge'],
    highlights: '99%+ Graft Take Rate · Microscopic detail',
  },
  {
    id: 'fess',
    icon: Microscope,
    title: 'FESS (Functional Endoscopic Sinus Surgery)',
    cases: '1,000+',
    count: 1000,
    percentage: '17%',
    category: 'Rhinology',
    categoryLabel: 'Sinus & Skull Base',
    equipment: 'Karl Storz 4K HD + Micro-debrider',
    accentColor: {
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-500',
      iconColor: 'text-emerald-600 dark:text-emerald-400 group-hover:text-white',
      borderHover: 'hover:border-emerald-500/50',
      progressColor: 'bg-emerald-500',
    },
    desc: 'Minimally invasive image-guided endoscopic sinus surgery for chronic sinusitis, polyposis, fungal sinus clearance, and frontal sinus ostia.',
    tags: ['Chronic Sinusitis', 'Nasal Polyps', 'Fungal Sinusitis', 'Severe Facial Pressure'],
    highlights: 'Zero external scars · Image-guided safety',
  },
  {
    id: 'coblation',
    icon: Scissors,
    title: 'Coblation Adenoidectomy & Tonsillectomy',
    cases: '900+',
    count: 900,
    percentage: '15%',
    category: 'Pediatric',
    categoryLabel: 'Pediatric & Plasma ENT',
    equipment: 'ArthroCare Coblator II Plasma',
    accentColor: {
      badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
      iconBg: 'bg-violet-500/10 group-hover:bg-violet-500',
      iconColor: 'text-violet-600 dark:text-violet-400 group-hover:text-white',
      borderHover: 'hover:border-violet-500/50',
      progressColor: 'bg-violet-500',
    },
    desc: 'Low-temperature plasma dissolution of hypertrophied adenoids and recurrent infected tonsils in children and adults with minimal post-op pain.',
    tags: ['Pediatric Snoring', 'Adenoid Hypertrophy', 'Recurrent Tonsillitis', 'Mouth Breathing'],
    highlights: 'Bloodless technique · 24-hr oral diet resumption',
  },
  {
    id: 'mastoidectomy',
    icon: Activity,
    title: 'Mastoidectomy & Cholesteatoma Clearance',
    cases: '700+',
    count: 700,
    percentage: '12%',
    category: 'Otology',
    categoryLabel: 'Advanced Otology',
    equipment: 'High-Speed Otologic Drill + Microscope',
    accentColor: {
      badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
      iconBg: 'bg-indigo-500/10 group-hover:bg-indigo-500',
      iconColor: 'text-indigo-600 dark:text-indigo-400 group-hover:text-white',
      borderHover: 'hover:border-indigo-500/50',
      progressColor: 'bg-indigo-500',
    },
    desc: 'Cortical, modified radical, and canal wall down mastoidectomy for complete eradication of chronic bone-eroding ear infections (CSOM) and cholesteatoma.',
    tags: ['Cholesteatoma', 'CSOM Bone Infection', 'Foul Ear Discharge', 'Facial Nerve Safety'],
    highlights: 'Complete disease eradication · Safe ear preservation',
  },
  {
    id: 'laryngology',
    icon: Zap,
    title: 'Microlaryngeal Surgery (MLS) & Voice Rehab',
    cases: '700+',
    count: 700,
    percentage: '11%',
    category: 'Laryngology',
    categoryLabel: 'Voice & Laryngology',
    equipment: 'Suspension Laryngoscope + Micro-instruments',
    accentColor: {
      badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
      iconBg: 'bg-blue-500/10 group-hover:bg-blue-500',
      iconColor: 'text-blue-600 dark:text-blue-400 group-hover:text-white',
      borderHover: 'hover:border-blue-500/50',
      progressColor: 'bg-blue-500',
    },
    desc: 'Microscopic vocal cord surgery for hoarseness of voice, vocal polyps, vocal nodules, cysts, papillomas, and precancerous laryngeal lesions.',
    tags: ['Vocal Cord Polyps', 'Hoarseness of Voice', 'Singers Nodules', 'Laryngeal Biopsy'],
    highlights: 'Precision phonosurgery · Vocal restoration',
  },
  {
    id: 'tracheostomy',
    icon: HeartPulse,
    title: 'Emergency Airway & Tracheostomy',
    cases: '300+',
    count: 300,
    percentage: '5%',
    category: 'Emergency',
    categoryLabel: 'Emergency & Critical Care',
    equipment: 'Percutaneous Dilational & Surgical Kit',
    accentColor: {
      badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
      iconBg: 'bg-rose-500/10 group-hover:bg-rose-500',
      iconColor: 'text-rose-600 dark:text-rose-400 group-hover:text-white',
      borderHover: 'hover:border-rose-500/50',
      progressColor: 'bg-rose-500',
    },
    desc: 'Emergency and elective open & percutaneous tracheostomy for ICU patients, acute upper airway obstruction, trauma, and ventilator weaning.',
    tags: ['Acute Airway Obstruction', 'ICU Ventilator Care', 'Stoma Management', 'Critical Trauma'],
    highlights: 'Life-saving surgical precision · 24/7 ICU standby',
  },
]

type FilterCategory = 'ALL' | 'Rhinology' | 'Otology' | 'Pediatric' | 'Emergency' | 'Laryngology'

export function SurgicalMilestones() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL')

  const filteredProcedures = activeFilter === 'ALL'
    ? procedures
    : procedures.filter((p) => p.category === activeFilter)

  return (
    <section id="milestones" className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Dynamic Ambient Background Glow Elements */}
      <div className="pointer-events-none absolute -top-40 right-10 size-[500px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 -left-20 size-[450px] rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Proven Surgical Excellence"
          title="6,000+ Successful ENT Surgeries"
          description="A decade of dedicated precision across Otology, Rhinology, Skull Base, and Emergency Airway interventions in Ahmedabad."
        />

        {/* Master Showcase Banner */}
        <Reveal className="mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white shadow-2xl dark:border-accent/30">
            {/* Top Border Reflection Highlight */}
            <div className="pointer-events-none absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />
            
            {/* Background High-Tech Grid & Radial Flares */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.18),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.14),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Doctor Avatar & Titles */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="relative group">
                  <div className="relative size-24 sm:size-28 shrink-0 rounded-2xl overflow-hidden border-2 border-accent shadow-2xl shadow-accent/25 bg-slate-900">
                    <Image
                      src="/doctor-scrubs.jpg"
                      alt="Dr. Vaidik Chauhan in Modular OT Scrubs"
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Verified Active Surgeon Status Pill */}
                  <div className="absolute -bottom-2.5 -right-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-2.5 py-0.5 text-[10px] font-extrabold shadow-lg shadow-emerald-500/40 border border-emerald-400/50">
                    <span className="size-1.5 rounded-full bg-white animate-ping" />
                    <span>Active OT</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold text-accent backdrop-blur-md">
                    <Award className="size-3.5 text-accent" />
                    <span>Director &amp; Head, Dept of ENT</span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    6,000+ Total ENT Cases Performed
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                    10+ years of dedicated surgical precision across advanced modular operation theatres in Ahmedabad with exceptional clinical outcomes.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Karl Storz HD Endoscopy</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 text-xs font-semibold text-teal-300">
                      <ShieldCheck className="size-3.5 text-teal-400" />
                      <span>Zero-Infection Modular OT</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                      <Microscope className="size-3.5 text-cyan-400" />
                      <span>Zeiss Micro-Otology</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Glassmorphism Stat Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 text-center backdrop-blur-md transition-all hover:bg-white/15 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <span className="block font-heading text-xl xs:text-2xl sm:text-3xl font-extrabold text-accent">
                    6,000+
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                    Total Surgeries
                  </span>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 text-center backdrop-blur-md transition-all hover:bg-white/15 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10">
                  <span className="block font-heading text-xl xs:text-2xl sm:text-3xl font-extrabold text-white">
                    10+ Yrs
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                    Surgical Mastery
                  </span>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 text-center backdrop-blur-md transition-all hover:bg-white/15 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10">
                  <span className="block font-heading text-xl xs:text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    99.6%
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                    Success Rate
                  </span>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 text-center backdrop-blur-md transition-all hover:bg-white/15 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
                  <span className="block font-heading text-xl xs:text-2xl sm:text-3xl font-extrabold text-cyan-400">
                    14+
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                    Publications
                  </span>
                </div>
              </div>
            </div>

            {/* Surgical Case Distribution Multi-Bar */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 text-xs">
                <span className="font-bold tracking-wider uppercase text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-accent" />
                  <span>Surgical Specialty Case Distribution (6,000+ Total)</span>
                </span>
                <span className="text-slate-400 text-[11px]">
                  Highest volume across Rhinology &amp; Micro-Otology
                </span>
              </div>

              {/* Multi-segmented Progress Bar */}
              <div className="h-3.5 w-full rounded-full bg-white/10 overflow-hidden flex shadow-inner border border-white/10">
                <div style={{ width: '20%' }} className="bg-cyan-500 hover:opacity-90 transition-opacity" title="Septoplasty (1,200+ Cases - 20%)" />
                <div style={{ width: '20%' }} className="bg-amber-500 hover:opacity-90 transition-opacity" title="Tympanoplasty (1,200+ Cases - 20%)" />
                <div style={{ width: '17%' }} className="bg-emerald-500 hover:opacity-90 transition-opacity" title="FESS Sinus (1,000+ Cases - 17%)" />
                <div style={{ width: '15%' }} className="bg-violet-500 hover:opacity-90 transition-opacity" title="Coblation Adenoid & Tonsil (900+ Cases - 15%)" />
                <div style={{ width: '12%' }} className="bg-indigo-500 hover:opacity-90 transition-opacity" title="Mastoidectomy (700+ Cases - 12%)" />
                <div style={{ width: '11%' }} className="bg-blue-500 hover:opacity-90 transition-opacity" title="Microlaryngeal Voice MLS (700+ Cases - 11%)" />
                <div style={{ width: '5%' }} className="bg-rose-500 hover:opacity-90 transition-opacity" title="Emergency Tracheostomy (300+ Cases - 5%)" />
              </div>

              {/* Legend Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-300 font-medium">
                <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                  <span className="size-2 rounded-full bg-cyan-500 shrink-0" />
                  <span>Septoplasty: <strong className="text-white">1,200+</strong></span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                  <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Tympanoplasty: <strong className="text-white">1,200+</strong></span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>FESS Sinus: <strong className="text-white">1,000+</strong></span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                  <span className="size-2 rounded-full bg-violet-500 shrink-0" />
                  <span>Coblation: <strong className="text-white">900+</strong></span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                  <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
                  <span>Mastoid: <strong className="text-white">700+</strong></span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                  <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                  <span>Voice MLS: <strong className="text-white">700+</strong></span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 border border-white/5">
                  <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                  <span>Tracheostomy: <strong className="text-white">300+</strong></span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Interactive Category Filter Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'ALL', label: 'All Specialties (6,000+)' },
            { id: 'Rhinology', label: 'Nose & Sinus (2,200+)' },
            { id: 'Otology', label: 'Ear & Hearing (1,900+)' },
            { id: 'Pediatric', label: 'Pediatric Coblation (900+)' },
            { id: 'Laryngology', label: 'Voice & Larynx (700+)' },
            { id: 'Emergency', label: 'Emergency Airway (300+)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as FilterCategory)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                activeFilter === tab.id
                  ? 'bg-accent text-accent-foreground shadow-md shadow-accent/25 scale-105'
                  : 'bg-card border border-border text-muted-foreground hover:border-accent/40 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Milestone Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProcedures.map((m, i) => (
            <Reveal key={m.id} delay={(i % 3) * 60}>
              <article
                className={`group relative flex h-full flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10 ${m.accentColor.borderHover}`}
              >
                {/* Top Subtle Hover Glow Accent */}
                <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  {/* Top Bar: Icon + Case Count Pill */}
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`inline-flex size-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-sm ${m.accentColor.iconBg} ${m.accentColor.iconColor}`}
                    >
                      <m.icon className="size-7" />
                    </span>

                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 rounded-2xl bg-accent/15 border border-accent/25 px-3 py-1 font-heading text-base font-extrabold text-accent">
                        <span>{m.cases}</span>
                      </div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                        Documented Cases
                      </span>
                    </div>
                  </div>

                  {/* Category Pill & Equipment Chip */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${m.accentColor.badge}`}>
                      {m.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      <Layers className="size-3" />
                      <span>{m.equipment}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 font-heading text-lg sm:text-xl font-bold text-foreground transition-colors group-hover:text-accent">
                    {m.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {m.desc}
                  </p>

                  {/* Clinical Highlight */}
                  <div className="mt-3.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span>{m.highlights}</span>
                  </div>
                </div>

                {/* Tags & Action Link */}
                <div className="mt-6 border-t border-border/70 pt-4 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-secondary/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1">
                    <BookAppointmentButton
                      label="Consult for this Procedure"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-accent hover:text-accent-foreground text-foreground px-4 py-2.5 text-xs font-bold transition-all shadow-sm group-hover:shadow"
                    >
                      <Stethoscope className="size-3.5" />
                      <span>Consult for this Procedure</span>
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </BookAppointmentButton>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Surgical Technology & Quality Assurance Bar */}
        <Reveal className="mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
              <div className="rounded-xl bg-accent/10 p-2.5 text-accent shrink-0">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Class 100 Modular OT</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Laminar airflow with HEPA-filtration for zero surgical site infection rate.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Microscope className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Zeiss Optical Precision</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Sub-millimeter nerve-sparing micro-otology preserving vital facial nerves.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
              <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-600 dark:text-violet-400 shrink-0">
                <Zap className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Plasma Coblation II</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Low-temperature tissue ablation minimizing bleeding and post-op pain.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-sm">
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400 shrink-0">
                <Clock className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Day-Care Protocols</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Same-day discharge for standard rhinologic and otologic procedures.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
