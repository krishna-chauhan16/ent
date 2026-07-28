'use client'

import { useState } from 'react'
import { MapPin, Mail, Phone, Send, Stethoscope } from 'lucide-react'
import { site, navLinks } from '@/lib/site'

const services = [
  'Sinus Surgery',
  'Hearing Care',
  'Voice Disorders',
  'Sleep Apnea',
  'Pediatric ENT',
  'Head & Neck Surgery',
]

const socials = [
  {
    label: 'Facebook',
    href: '#',
    path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 01-1.38-.9 3.72 3.72 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.24A6.6 6.6 0 1018.6 12 6.6 6.6 0 0012 5.4zm0 10.89A4.29 4.29 0 1116.29 12 4.29 4.29 0 0112 16.29zm6.85-11.15a1.54 1.54 0 11-1.54-1.54 1.54 1.54 0 011.54 1.54z',
  },
  {
    label: 'LinkedIn',
    href: '#',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 013.38-1.86c3.61 0 4.28 2.38 4.28 5.47v6.28zM5.34 7.43a2.07 2.07 0 112.06-2.07 2.07 2.07 0 01-2.06 2.07zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77A1.75 1.75 0 000 1.73v20.53A1.75 1.75 0 001.77 24h20.45A1.76 1.76 0 0024 22.27V1.73A1.76 1.76 0 0022.22 0z',
  },
  {
    label: 'YouTube',
    href: '#',
    path: 'M23.5 6.2a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 00.5 6.2 31.5 31.5 0 000 12a31.5 31.5 0 00.5 5.8 3.02 3.02 0 002.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 002.12-2.14A31.5 31.5 0 0024 12a31.5 31.5 0 00-.5-5.8zM9.6 15.57V8.43L15.82 12 9.6 15.57z',
  },
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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Stethoscope className="size-5" />
              </span>
              <span className="font-heading text-lg font-bold">{site.doctor.name}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70 dark:text-muted-foreground">
              Compassionate, expert ear, nose &amp; throat care for the whole family — backed by 20+
              years of surgical experience.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground dark:border-border dark:text-muted-foreground"
                >
                  <svg viewBox="0 0 24 24" className="size-4.5 fill-current" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide">Explore</h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent dark:text-muted-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide">Services</h3>
            <ul className="mt-4 space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    className="text-sm text-primary-foreground/70 transition-colors hover:text-accent dark:text-muted-foreground"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + newsletter */}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70 dark:text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>
                  {site.hospital.addressLine1}, {site.hospital.addressLine2}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-accent" />
                <a href={site.hospital.phoneHref} className="hover:text-accent">
                  {site.hospital.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-accent" />
                <a href={`mailto:${site.hospital.email}`} className="hover:text-accent">
                  {site.hospital.email}
                </a>
              </li>
            </ul>

            <form onSubmit={handleSubscribe} className="mt-6">
              <label htmlFor="newsletter" className="text-sm font-medium">
                Subscribe to our health newsletter
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 px-4 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/40 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring dark:border-border dark:bg-background dark:text-foreground dark:placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Send className="size-4.5" />
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-sm text-accent" role="status">
                  Thank you for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/15 pt-8 text-sm text-primary-foreground/60 dark:border-border dark:text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.hospital.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-accent">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-accent">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
