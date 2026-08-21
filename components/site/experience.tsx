'use client'

import { Building2, Calendar, CheckCircle2, Hospital, Stethoscope, MapPin, Award } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const experiences = [
  {
    role: 'Director & Head – Department of ENT',
    institution: 'Atulya Superspeciality Hospital & ICU',
    location: 'Bhuyangdev, Ahmedabad',
    period: 'Present',
    type: 'Current Leadership',
    highlight: 'Leading the ENT department, operating complex micro-ear, advanced FESS, airway emergencies & multi-specialty ICU cases.',
    current: true,
  },
  {
    role: 'Visiting Consultant ENT Surgeon',
    institution: 'KD Hospital',
    location: 'SG Highway, Ahmedabad',
    period: 'Active Visiting Practice',
    type: 'Visiting Consultant',
    highlight: 'Performing tertiary-level otology, skull base & sinus surgeries in state-of-the-art operative suites.',
    current: true,
  },
  {
    role: 'Visiting Consultant ENT Surgeon',
    institution: 'Prathana Hospital',
    location: 'Ahmedabad',
    period: 'Active Visiting Practice',
    type: 'Visiting Consultant',
    highlight: 'Consultations, routine and advanced ENT interventions, day-care surgeries & emergency ENT support.',
    current: true,
  },
  {
    role: 'Senior Resident – ENT',
    institution: 'B.J. Medical College & Civil Hospital',
    location: 'Asarwa, Ahmedabad',
    period: 'Post-MS Residency',
    type: 'Residency Training',
    highlight: 'High-volume emergency trauma, cadaveric dissections, complex otolaryngology surgeries and undergraduate clinical tutoring.',
    current: false,
  },
  {
    role: 'Senior Resident – ENT',
    institution: 'ESIC Hospital',
    location: 'Ahmedabad',
    period: 'Residency',
    type: 'Residency Training',
    highlight: 'Comprehensive OPD management, routine ENT surgeries, diagnostic endoscopies & occupational health ENT care.',
    current: false,
  },
]

const medicalTraining = [
  {
    period: '2015 – 2018',
    degree: 'M.S. (ENT - Otorhinolaryngology)',
    institute: 'B.J. Medical College & Civil Hospital, Gujarat University',
    details: [
      'Comprehensive 3-year surgical residency in Otology, Rhinology, Head & Neck Surgery.',
      'Rotational Postings (July 2016 – Dec 2016): M.P. Shah Cancer Hospital (GCRI), Dept of Plastic Surgery, Dept of Neurosurgery, and Dept of Emergency Medicine.',
    ],
  },
  {
    period: '2007 – 2013',
    degree: 'M.B.B.S. (Bachelor of Medicine & Surgery)',
    institute: 'Smt. N.H.L. Municipal Medical College, Gujarat University',
    details: [
      'Rigorous undergraduate clinical training across all medical and surgical domains.',
      'Medical Internship (2012–2013): V.S. Hospital, S.C.L. Hospital, L.G. Hospital, and Community Health Centers.',
    ],
  },
]

export function Experience() {
  return (
    <section id="experience" className="bg-background py-20 lg:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Career & Qualifications"
          title="Professional Experience & Academic Journey"
          description="A distinguished career leading premier ENT departments, consulting across top Ahmedabad hospitals, and rigorous training at top institutions."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Hospital Positions Timeline */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Hospital className="size-5" />
                </span>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Clinical Appointments &amp; Hospital Affiliations
                </h3>
              </div>
            </Reveal>

            <div className="relative border-l-2 border-border pl-6 ml-3 sm:ml-4 space-y-6">
              {experiences.map((exp, idx) => (
                <Reveal key={exp.role + exp.institution} delay={idx * 60}>
                  <div className="relative group">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[31px] top-1.5 size-4 rounded-full border-2 bg-card ${
                        exp.current
                          ? 'border-accent bg-accent shadow-[0_0_0_4px_rgba(10,147,150,0.2)]'
                          : 'border-muted-foreground'
                      }`}
                    />

                    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold ${
                            exp.current
                              ? 'bg-accent/15 text-accent'
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {exp.period}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="size-3 text-accent" />
                          {exp.location}
                        </span>
                      </div>

                      <h4 className="mt-2.5 font-heading text-lg font-bold text-foreground">
                        {exp.role}
                      </h4>
                      <p className="font-medium text-sm text-accent">
                        {exp.institution}
                      </p>

                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {exp.highlight}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right Column: Academic Degrees & Super-Specialty Exposure */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Reveal>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Award className="size-5" />
                </span>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Degrees &amp; Formal Education
                </h3>
              </div>
            </Reveal>

            {medicalTraining.map((edu, idx) => (
              <Reveal key={edu.degree} delay={idx * 80}>
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-accent/50 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-accent/10 px-3 py-1 font-heading text-xs font-bold text-accent">
                      {edu.period}
                    </span>
                    <span className="text-xs text-muted-foreground">Gujarat University</span>
                  </div>

                  <h4 className="mt-3 font-heading text-lg font-bold text-foreground">
                    {edu.degree}
                  </h4>
                  <p className="text-xs font-medium text-accent mt-0.5">
                    {edu.institute}
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                    {edu.details.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}

            {/* Teaching & Mentorship Box */}
            <Reveal delay={160}>
              <div className="rounded-3xl border border-accent/30 bg-secondary/80 p-6 shadow-sm">
                <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                  <Stethoscope className="size-4 text-accent" />
                  Academic &amp; Dissection Mentorship
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Active mentor in Cadaveric Temporal Bone Dissection Workshops and Faculty in FESS surgical courses, training postgraduates and junior ENT surgeons in precision dissection.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
