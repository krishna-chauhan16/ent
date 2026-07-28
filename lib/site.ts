export const site = {
  doctor: {
    name: 'Dr.Vaidik Chauhan',
    shortName: 'Dr. Chauhan',
    title: 'MD, MS (ENT), FACS',
    role: 'Consultant Ear, Nose & Throat Surgeon',
  },
  hospital: {
    name: 'Atulya Superspeciality Hospital & ICU ',
    addressLine1: '2nd Floor, Elite Mangnum Bhuyangdev cross Rd',
    addressLine2: 'Vardhmannagar Society, C.P. Nagar-1, Parulnagar Society,Ahmedabad, Gujarat 380061',
    phoneDisplay: '09727579000',
    phoneHref: 'tel:+919727579000',
    whatsapp: 'https://wa.me/9601074848',
    email: 'appointments@meridianent.example',
  },
} as const

export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Conditions', href: '#conditions' },
  { label: 'Surgeries', href: '#specialties' },
  { label: 'About', href: '#about' },
  { label: 'Health Library', href: '#health-library' },
  { label: 'Contact', href: '#contact' },
] as const
