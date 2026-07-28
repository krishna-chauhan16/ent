'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CalendarCheck, CheckCircle2, X } from 'lucide-react'
import { site } from '@/lib/site'

interface BookAppointmentButtonProps {
  label?: string
  className?: string
  children?: ReactNode
}

export function BookAppointmentButton({
  label = 'Book Appointment',
  className,
  children,
}: BookAppointmentButtonProps) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descId = useId()

  const close = useCallback(() => {
    setOpen(false)
    // reset the success state shortly after the dialog animates out
    setTimeout(() => setSubmitted(false), 200)
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

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

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="presentation"
        >
          <div
            className="absolute inset-0 bg-primary/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={close}
            aria-hidden="true"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="relative z-10 w-full max-w-lg rounded-t-2xl bg-card p-6 shadow-2xl ring-1 ring-border animate-in slide-in-from-bottom-6 duration-300 sm:rounded-2xl sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close appointment form"
              className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <CheckCircle2 className="size-8" />
                </span>
                <h2 id={titleId} className="text-2xl font-bold text-foreground">
                  Request received
                </h2>
                <p id={descId} className="mt-2 max-w-sm text-pretty text-muted-foreground">
                  Thank you. Our care coordinator will call you within one business day to confirm
                  your appointment with {site.doctor.name}.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-semibold text-accent-foreground transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <CalendarCheck className="size-6" />
                  </span>
                  <div>
                    <h2 id={titleId} className="text-xl font-bold text-foreground">
                      Book an Appointment
                    </h2>
                    <p id={descId} className="text-sm text-muted-foreground">
                      Request a consultation with {site.doctor.name}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field id="apt-name" label="Full name" required className="sm:col-span-2">
                    <input
                      id="apt-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Jane Doe"
                      className={fieldClass}
                    />
                  </Field>

                  <Field id="apt-phone" label="Phone number" required>
                    <input
                      id="apt-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="(555) 000-0000"
                      className={fieldClass}
                    />
                  </Field>

                  <Field id="apt-email" label="Email">
                    <input
                      id="apt-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={fieldClass}
                    />
                  </Field>

                  <Field id="apt-reason" label="Reason for visit" className="sm:col-span-2">
                    <select id="apt-reason" name="reason" className={fieldClass} defaultValue="">
                      <option value="" disabled>
                        Select a concern
                      </option>
                      <option>Sinus &amp; nasal issues</option>
                      <option>Hearing loss or ear pain</option>
                      <option>Voice or throat concerns</option>
                      <option>Snoring or sleep apnea</option>
                      <option>Pediatric ENT</option>
                      <option>Head &amp; neck evaluation</option>
                      <option>Other</option>
                    </select>
                  </Field>

                  <Field id="apt-date" label="Preferred date" className="sm:col-span-2">
                    <input id="apt-date" name="date" type="date" className={fieldClass} />
                  </Field>

                  <div className="sm:col-span-2 mt-1 flex flex-col gap-3">
                    <button
                      type="submit"
                      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 font-semibold text-accent-foreground transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      Request appointment
                    </button>
                    <p className="text-center text-xs text-muted-foreground">
                      Prefer to talk? Call us at{' '}
                      <a href={site.hospital.phoneHref} className="font-semibold text-accent underline-offset-2 hover:underline">
                        {site.hospital.phoneDisplay}
                      </a>
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const fieldClass =
  'h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring'

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
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-accent">*</span>}
      </label>
      {children}
    </div>
  )
}
