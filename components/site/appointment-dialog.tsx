'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { CalendarCheck, CheckCircle2, Phone, X, MessageCircle, ArrowRight, Loader2 } from 'lucide-react'
import { site } from '@/lib/site'

interface BookAppointmentButtonProps {
  label?: string
  className?: string
  children?: ReactNode
}

interface AppointmentFormState {
  name: string
  phone: string
  location: string
  reason: string
  date: string
}

export function BookAppointmentButton({
  label = 'Book Appointment',
  className,
  children,
}: BookAppointmentButtonProps) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState<AppointmentFormState>({
    name: '',
    phone: '',
    location: 'Atulya Superspeciality Hospital (Bhuyangdev)',
    reason: '',
    date: '',
  })

  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setTimeout(() => {
      setSubmitted(false)
      setLoading(false)
      setFormData({
        name: '',
        phone: '',
        location: 'Atulya Superspeciality Hospital (Bhuyangdev)',
        reason: '',
        date: '',
      })
    }, 200)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close])

  const generateWhatsAppUrl = (data: AppointmentFormState) => {
    const message = `Hello Dr. Vaidik Chauhan,

I would like to book an ENT Consultation Appointment:
• Patient Name: ${data.name.trim()}
• Mobile Number: ${data.phone.trim()}
• Preferred Hospital: ${data.location}
• ENT Concern: ${data.reason || 'General ENT Consultation'}
• Preferred Date: ${data.date || 'Earliest Available'}

Please confirm my appointment slot.`

    return `https://wa.me/919601074848?text=${encodeURIComponent(message)}`
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) return

    setLoading(true)

    try {
      // 1. Save appointment record in database
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: formData.location,
          reason: formData.reason,
          date: formData.date,
        }),
      })
    } catch (err) {
      console.error('Failed to store appointment in DB, continuing WhatsApp redirect', err)
    }

    setLoading(false)
    setSubmitted(true)

    // 2. Automatically trigger WhatsApp redirect
    const waUrl = generateWhatsAppUrl(formData)
    try {
      window.open(waUrl, '_blank')
    } catch {
      window.location.href = waUrl
    }
  }

  const modalContent = open && mounted ? (
    <div
      className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
      role="presentation"
    >
      {/* Dark Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-primary/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative z-10 w-full max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-5 sm:p-7 shadow-2xl border border-border animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 overscroll-contain"
      >
        {/* Close Button */}
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close appointment form"
          className="absolute right-4 top-4 z-20 inline-flex size-9 items-center justify-center rounded-full bg-secondary text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="mb-3 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] shadow-sm">
              <CheckCircle2 className="size-8" />
            </span>
            <h2 id={titleId} className="text-xl sm:text-2xl font-bold text-foreground">
              Request Sent &amp; Recorded!
            </h2>
            <p id={descId} className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your appointment request has been saved in our system and sent to Dr. Vaidik Chauhan on WhatsApp for slot confirmation.
            </p>

            {/* Summary card */}
            <div className="mt-4 w-full rounded-2xl border border-border bg-secondary/60 p-4 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patient:</span>
                <span className="font-semibold text-foreground">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mobile:</span>
                <span className="font-semibold text-foreground">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Center:</span>
                <span className="font-semibold text-foreground">{formData.location}</span>
              </div>
              {formData.reason && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Concern:</span>
                  <span className="font-semibold text-accent">{formData.reason}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full">
              <a
                href={generateWhatsAppUrl(formData)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="size-4" />
                Open WhatsApp Again
              </a>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-secondary px-5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-3 pr-8">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <CalendarCheck className="size-6" />
              </span>
              <div>
                <h2 id={titleId} className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                  Consult with {site.doctor.name}
                </h2>
                <p id={descId} className="text-xs text-muted-foreground mt-0.5">
                  Director &amp; Head, Dept. of ENT &middot; Atulya Hospital
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field id="apt-name" label="Full Name" required className="sm:col-span-2">
                <input
                  id="apt-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Ramesh Patel"
                  className={fieldClass}
                />
              </Field>

              <Field id="apt-phone" label="Mobile Number" required>
                <input
                  id="apt-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className={fieldClass}
                />
              </Field>

              <Field id="apt-location" label="Preferred Center">
                <select
                  id="apt-location"
                  name="location"
                  className={fieldClass}
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                >
                  <option value="Atulya Superspeciality Hospital (Bhuyangdev)">Atulya Hospital (Bhuyangdev)</option>
                  <option value="KD Hospital (SG Highway)">KD Hospital (SG Highway)</option>
                  <option value="Prathana Hospital">Prathana Hospital</option>
                </select>
              </Field>

              <Field id="apt-reason" label="ENT Concern" className="sm:col-span-2">
                <select
                  id="apt-reason"
                  name="reason"
                  className={fieldClass}
                  value={formData.reason}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                >
                  <option value="">Select your ENT condition</option>
                  <option value="Sinusitis / Polyp / Nasal Blockage (FESS / Septoplasty)">Sinusitis, Polyp or Nasal Blockage (FESS / Septoplasty)</option>
                  <option value="Ear Discharge / Hearing Loss / Eardrum Perforation (Tympanoplasty)">Ear Discharge / Hearing Loss / Eardrum Perforation (Tympanoplasty)</option>
                  <option value="Vertigo, Dizziness & Balance Disorders">Vertigo, Dizziness &amp; Balance Disorders</option>
                  <option value="Throat, Tonsils, Adenoids or Voice Issues">Throat, Tonsils, Adenoids or Voice Issues</option>
                  <option value="Pediatric ENT Checkup">Pediatric ENT Checkup</option>
                  <option value="Head & Neck / Skull Base Consultation">Head &amp; Neck / Skull Base Consultation</option>
                  <option value="Second Surgical Opinion / General ENT">Second Surgical Opinion / General ENT</option>
                </select>
              </Field>

              <Field id="apt-date" label="Preferred Date" className="sm:col-span-2">
                <input
                  id="apt-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className={fieldClass}
                />
              </Field>

              <div className="sm:col-span-2 mt-1 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground shadow-md shadow-accent/25 transition-transform hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-75"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Saving Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Appointment</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  Direct contact:{' '}
                  <a href={site.doctor.phoneHref} className="font-semibold text-accent underline-offset-2 hover:underline">
                    {site.doctor.phoneDisplay}
                  </a>
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  ) : null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-haspopup="dialog"
      >
        {children ?? label}
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}

const fieldClass =
  'h-11 w-full rounded-xl border border-input bg-background px-3.5 text-base sm:text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring'

function Field({
  id,
  label,
  required,
  className,
  children,
}: {
  id: string
  label: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </label>
      {children}
    </div>
  )
}
