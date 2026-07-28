import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const conditions = [
  'Chronic Sinusitis',
  'Deviated Nasal Septum',
  'Nasal Polyps',
  'Hearing Loss',
  'Tinnitus (Ringing Ears)',
  'Ear Infections',
  'Vertigo & Dizziness',
  'Tonsillitis',
  'Sleep Apnea & Snoring',
  'Hoarseness & Voice Loss',
  'Allergic Rhinitis',
  'Acid Reflux (LPR)',
  'Thyroid Nodules',
  'Swallowing Disorders',
  'Head & Neck Tumors',
]

export function Conditions() {
  return (
    <section id="conditions" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Conditions We Treat"
          title="Relief for a wide range of ENT concerns"
          description="If a symptom is affecting your daily life, chances are we can help. Here are some of the conditions we manage most often."
        />
        <Reveal className="mt-12">
          <ul className="flex flex-wrap justify-center gap-3">
            {conditions.map((c) => (
              <li key={c}>
                <span className="inline-flex items-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground">
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
