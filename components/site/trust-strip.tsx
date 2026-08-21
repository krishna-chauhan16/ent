'use client'

import { useEffect, useRef, useState } from 'react'
import { Scissors, CalendarClock, BookOpen, Award } from 'lucide-react'

interface Stat {
  icon: typeof Scissors
  value: number
  suffix: string
  label: string
  sublabel: string
}

const stats: Stat[] = [
  {
    icon: Scissors,
    value: 6000,
    suffix: '+',
    label: 'Successful Surgeries',
    sublabel: 'Across Ear, Nose & Throat',
  },
  {
    icon: CalendarClock,
    value: 10,
    suffix: '+',
    label: 'Years Experience',
    sublabel: 'Clinical & Surgical Excellence',
  },
  {
    icon: BookOpen,
    value: 14,
    suffix: '+',
    label: 'Research Publications',
    sublabel: 'National & International Journals',
  },
  {
    icon: Award,
    value: 1200,
    suffix: '+',
    label: 'Tympanoplasty & Septoplasty',
    sublabel: 'Micro-Ear & Endoscopic Sinus (FESS)',
  },
]

function useCountUp(target: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setValue(target)
      return
    }
    let start: number | null = null
    function step(ts: number) {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, active, duration])

  return value
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const value = useCountUp(stat.value, active)
  return (
    <div className="flex flex-col items-center text-center p-2">
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent shadow-sm">
        <stat.icon className="size-7" />
      </span>
      <p className="font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl dark:text-foreground">
        {value.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="mt-2 text-base font-semibold text-primary-foreground/90 dark:text-foreground">
        {stat.label}
      </p>
      <p className="mt-0.5 text-xs text-primary-foreground/70 dark:text-muted-foreground">
        {stat.sublabel}
      </p>
    </div>
  )
}

export function TrustStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-label="Doctor track record numbers"
      className="border-y border-transparent bg-primary py-14 lg:py-18 dark:border-border dark:bg-secondary"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
