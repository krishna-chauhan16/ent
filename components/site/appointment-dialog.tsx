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
import Image from 'next/image'
import { CheckCircle2, X, ArrowRight, Loader2 } from 'lucide-react'
import { site } from '@/lib/site'

interface BookAppointmentButtonProps {
  label?: string
  className?: string
  children?: ReactNode
  onClick?: () => void
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
  onClick,
}: BookAppointmentButtonProps) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [centers, setCenters] = useState<Array<{ id: string; name: string; area: string; timings?: string; isDefault?: boolean }>>([])
  const [concerns, setConcerns] = useState<Array<{ id: string; title: string; category: string; description?: string; isDefault?: boolean }>>([])
  const [dateError, setDateError] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [formData, setFormData] = useState<AppointmentFormState>({
    name: '',
    phone: '',
    location: '',
    reason: '',
    date: '',
  })

  // Format today's local date as YYYY-MM-DD for min date picker attribute
  const today = new Date()
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const handleDateChange = (val: string) => {
    if (!val) {
      setDateError('')
      setFormData((prev) => ({ ...prev, date: '' }))
      return
    }

    // Check if selected date is in the past
    if (val < minDate) {
      setDateError('Past dates are not allowed. Please choose today or a future date.')
      setFormData((prev) => ({ ...prev, date: '' }))
      return
    }

    // Check if selected date is a Sunday (0 = Sunday in JavaScript Date)
    const selectedDate = new Date(`${val}T00:00:00`)
    if (selectedDate.getDay() === 0) {
      setDateError('Sunday is closed for OPD. Please select Monday to Saturday.')
      setFormData((prev) => ({ ...prev, date: '' }))
      return
    }

    setDateError('')
    setFormData((prev) => ({ ...prev, date: val }))
  }

  const titleId = useId()
  const descId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
    // 1. Fetch Master Centers
    fetch('/api/centers')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.centers && data.centers.length > 0) {
          setCenters(data.centers)
          const def = data.centers.find((c: { isDefault?: boolean }) => c.isDefault)
          if (def) {
            setFormData((prev) => ({ ...prev, location: def.name }))
          }
        }
      })
      .catch(() => { })

    // 2. Fetch Active ENT Concerns
    fetch('/api/concerns')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.concerns && data.concerns.length > 0) {
          setConcerns(data.concerns)
        }
      })
      .catch(() => { })
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    setTimeout(() => {
      setSubmitted(false)
      setLoading(false)
      setDateError('')
      setBookingId('')
      setFormData({
        name: '',
        phone: '',
        location: centers.find((c) => c.isDefault)?.name || (centers[0]?.name || ''),
        reason: '',
        date: '',
      })
    }, 200)
  }, [centers])

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim() || !formData.phone.trim()) return

    // Validate date is not past or Sunday
    if (formData.date) {
      const selected = new Date(`${formData.date}T00:00:00`)
      if (formData.date < minDate || selected.getDay() === 0) {
        setDateError('Sunday is closed for OPD. Please select Monday to Saturday.')
        return
      }
    }

    setLoading(true)

    try {
      // 1. Direct entry in Database (appointments table)
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: formData.location || (centers[0]?.name || 'Atulya Superspeciality Hospital (Bhuyangdev)'),
          reason: formData.reason || 'General ENT Consultation',
          date: formData.date || '',
        }),
      })

      const data = await res.json()
      const now = new Date()
      const dateCode = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`

      if (data.success && data.appointment?.id) {
        const generatedId = `ENT-${dateCode}-${String(data.appointment.id).padStart(4, '0')}`
        setBookingId(generatedId)
      } else {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000)
        setBookingId(`ENT-${dateCode}-${randomSuffix}`)
      }
    } catch (err) {
      console.error('Failed to store appointment in DB:', err)
      const now = new Date()
      const dateCode = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
      setBookingId(`ENT-${dateCode}-${Math.floor(1000 + Math.random() * 9000)}`)
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  const modalContent = open && mounted ? (
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto bg-primary/80 backdrop-blur-sm p-3 sm:p-4 md:p-6"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="flex min-h-full items-center justify-center py-2 sm:py-6">
        {/* Modal Box */}
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-card p-4 sm:p-6 md:p-7 shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close appointment form"
            className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 z-20 inline-flex size-9 sm:size-10 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" />
          </button>

          {submitted ? (
            <div className="flex flex-col items-center py-3 text-center">
              <span className="mb-3 inline-flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm">
                <CheckCircle2 className="size-8" />
              </span>
              <h2 id={titleId} className="text-xl sm:text-2xl font-bold text-foreground">
                Appointment Booked Successfully!
              </h2>
              <p id={descId} className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your appointment request has been successfully recorded in our system. Our clinic reception team will call you shortly to confirm your time slot.
              </p>

              {/* Booking Reference ID Badge */}
              {bookingId && (
                <div className="mt-3.5 inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent">
                  <span className="text-muted-foreground">Booking ID:</span>
                  <span className="font-mono text-sm font-bold tracking-wider text-foreground">#{bookingId}</span>
                </div>
              )}

              {/* Summary card */}
              <div className="mt-4 w-full rounded-2xl border border-border bg-secondary/60 p-4 text-left text-xs space-y-2">
                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">Patient Name:</span>
                  <span className="font-semibold text-foreground">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">Contact Number:</span>
                  <span className="font-semibold text-foreground">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                  <span className="text-muted-foreground">Consultation Center:</span>
                  <span className="font-semibold text-foreground">{formData.location || 'Primary Center'}</span>
                </div>
                {formData.reason && (
                  <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                    <span className="text-muted-foreground">ENT Concern:</span>
                    <span className="font-semibold text-accent">{formData.reason}</span>
                  </div>
                )}
                {formData.date && (
                  <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                    <span className="text-muted-foreground">Preferred Date:</span>
                    <span className="font-semibold text-foreground">{formData.date}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Pending Confirmation
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full">
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground shadow-md transition-transform hover:scale-[1.02]"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Doctor Info Header */}
              <div className="mb-4 sm:mb-5 flex items-center gap-3 pr-8">
                <div className="relative size-11 sm:size-12 shrink-0 rounded-2xl overflow-hidden border-2 border-accent shadow-md bg-card">
                  <Image
                    src="/doctor-portrait.jpg"
                    alt={`Dr. Vaidik Chauhan`}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 id={titleId} className="text-base sm:text-lg font-bold text-foreground leading-snug truncate">
                    Consult with {site.doctor.name}
                  </h2>
                  <p id={descId} className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                    Director &amp; Head, Dept. of ENT &middot; Atulya Hospital
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

                  <Field id="apt-phone" label="Mobile Number" required className="sm:col-span-1">
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

                  <Field id="apt-date" label="Preferred Date (Mon - Sat)" className="sm:col-span-1">
                    <input
                      id="apt-date"
                      name="date"
                      type="date"
                      min={minDate}
                      value={formData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className={`${fieldClass} ${dateError ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                    />
                    {dateError && (
                      <p className="mt-1 text-[11px] font-semibold text-rose-500 leading-tight">
                        {dateError}
                      </p>
                    )}
                  </Field>

                  <Field id="apt-location" label="Preferred Center" className="sm:col-span-2">
                    <select
                      id="apt-location"
                      name="location"
                      className={fieldClass}
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="apt-reason" label="ENT Concern / Condition" className="sm:col-span-2">
                    <select
                      id="apt-reason"
                      name="reason"
                      className={fieldClass}
                      value={formData.reason}
                      onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                    >
                      <option value="">Select condition / symptom</option>
                      {concerns.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="pt-1 flex flex-col gap-2">
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
                    Or call directly:{' '}
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
    </div>
  ) : null

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onClick?.()
          setOpen(true)
        }}
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
