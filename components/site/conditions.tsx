import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const conditions = [
  'Chronic Sinusitis & Polyps',
  'Deviated Nasal Septum (DNS)',
  'Eardrum Perforation',
  'CSOM & Cholesteatoma',
  'Hearing Loss & Tinnitus',
  'Vertigo & Balance Disorders',
  'Adenoid Hypertrophy',
  'Recurrent Tonsillitis',
  'Upper Airway Obstruction',
  'Vocal Cord Nodules & Hoarseness',
  'Foreign Body in Ear/Nose/Throat',
  'Allergic Rhinitis',
  'Facial Flap Reconstruction',
  'Salivary Gland Swellings',
  'Head & Neck Masses',
]

export function Conditions() {
  return (
    <section id="conditions" className="bg-secondary/70 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Conditions We Treat"
          title="Specialized Solutions for Ear, Nose & Throat Disorders"
          description="Expert diagnosis, medical therapy, and advanced surgical interventions for a wide spectrum of acute and chronic ENT conditions."
        />
        <Reveal className="mt-12">
          <ul className="flex flex-wrap justify-center gap-3">
            {conditions.map((c) => (
              <li key={c}>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground">
                  {c}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
