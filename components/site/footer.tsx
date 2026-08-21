'use client'

import { useState } from 'react'
import { MapPin, Mail, Phone, Send, Stethoscope, ShieldCheck, HeartPulse, Lock } from 'lucide-react'
import { site, navLinks } from '@/lib/site'

const surgicalHighlights = [
  'Septoplasty (1200+ Cases)',
  'FESS Sinus Surgery (1000+ Cases)',
  'Tympanoplasty (1200+ Cases)',
  'Mastoidectomy (700+ Cases)',
  'Tracheostomy (300+ Cases)',
  'Plasma Adenotonsillectomy',
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground dark:bg-secondary dark:text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr_1.1fr_1.3fr]">
          {/* Brand & Doctor Bio */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm">
                <Stethoscope className="size-5" />
              </span>
              <div>
                <span className="font-heading text-lg font-bold block">{site.doctor.name}</span>
                <span className="text-xs text-accent font-semibold">MS (ENT) &middot; Consultant ENT Surgeon</span>
              </div>
            </div>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-primary-foreground/75 dark:text-muted-foreground">
              Director &amp; Head, Department of ENT at Atulya Superspeciality Hospital &amp; ICU, Ahmedabad. Over 10 years of experience with 6,000+ successful ENT surgeries.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-primary-foreground/90 dark:bg-accent/15 dark:text-accent">
                Atulya Hospital
              </span>
              <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-primary-foreground/90 dark:bg-accent/15 dark:text-accent">
                KD Hospital
              </span>
              <span className="rounded-full bg-primary-foreground/10 px-3 py-1 text-primary-foreground/90 dark:bg-accent/15 dark:text-accent">
                Prathana Hospital
              </span>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-accent">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-primary-foreground/75 transition-colors hover:text-accent dark:text-muted-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Core Surgeries */}
          <nav aria-label="Surgeries">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-accent">Key Surgeries</h3>
            <ul className="mt-4 space-y-2.5">
              {surgicalHighlights.map((s) => (
                <li key={s}>
                  <a
                    href="#milestones"
                    className="text-xs sm:text-sm text-primary-foreground/75 transition-colors hover:text-accent dark:text-muted-foreground"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Details */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-accent">Contact &amp; Location</h3>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-primary-foreground/75 dark:text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  <strong>{site.hospital.name}</strong>
                  <br />
                  {site.hospital.addressLine1}, {site.hospital.addressLine2}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-accent" />
                <div>
                  <a href={site.doctor.phoneHref} className="hover:text-accent font-semibold text-primary-foreground dark:text-foreground">
                    {site.doctor.phoneDisplay}
                  </a>
                  <span className="text-xs block text-primary-foreground/60 dark:text-muted-foreground">
                    Landline: {site.hospital.landlineDisplay}
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-accent" />
                <a href={`mailto:${site.doctor.email}`} className="hover:text-accent">
                  {site.doctor.email}
                </a>
              </li>
            </ul>

            <div className="mt-5">
              <a
                href={site.hospital.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-xs font-bold text-white transition-transform hover:scale-[1.02]"
              >
                Chat on WhatsApp (+91 9601074848)
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-8 text-xs text-primary-foreground/60 dark:border-border dark:text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.doctor.name}, MS (ENT) &middot; {site.hospital.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span>Director &amp; Head, Dept of ENT</span>
            <a
              href="/admin"
              className="inline-flex items-center gap-1 text-primary-foreground/60 hover:text-accent transition-colors dark:text-muted-foreground dark:hover:text-accent"
              title="Doctor / Staff Admin Portal"
            >
              <Lock className="size-3" />
              <span>Admin Portal</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
