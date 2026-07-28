'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { cn } from '@/lib/utils'

const images = [
  { src: '/gallery-reception.png', alt: 'Modern clinic reception and waiting area', tall: true },
  { src: '/gallery-consult.png', alt: 'Doctor explaining a diagnosis to a patient', tall: false },
  { src: '/gallery-exam-room.png', alt: 'ENT examination room with modern equipment', tall: false },
  { src: '/gallery-hearing.png', alt: 'Audiologist performing a hearing test', tall: true },
  { src: '/gallery-surgery.png', alt: 'Surgical team in a modern operating theatre', tall: false },
  { src: '/gallery-pediatric.png', alt: 'Doctor examining a child’s ear with a parent present', tall: false },
]

export function Gallery() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const close = useCallback(() => setOpen(false), [])
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [])
  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close, next, prev])

  function openAt(i: number) {
    setActive(i)
    setOpen(true)
  }

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Inside Our Practice"
          title="A calm, modern space built for healing"
          description="Take a look at our facilities, technology, and the compassionate care that happens every day."
        />
        <Reveal className="mt-14">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => openAt(i)}
                aria-label={`View image: ${img.alt}`}
                className="group relative block w-full overflow-hidden rounded-2xl border border-border shadow-sm transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Image
                  src={img.src || '/placeholder.svg'}
                  alt={img.alt}
                  width={640}
                  height={img.tall ? 860 : 560}
                  loading="lazy"
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-primary/0 transition-colors duration-300 group-hover:bg-primary/30">
                  <ZoomIn className="size-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm" onClick={close} />
          <button
            type="button"
            onClick={close}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" />
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:left-8"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-8"
          >
            <ChevronRight className="size-6" />
          </button>

          <figure className="relative z-0 max-h-[85vh] w-full max-w-4xl">
            <Image
              src={images[active].src || '/placeholder.svg'}
              alt={images[active].alt}
              width={1280}
              height={960}
              className="mx-auto max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center text-sm text-white/80">
              {images[active].alt} &middot; {active + 1} / {images.length}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}
