import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Montserrat, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dr. Vaidik Chauhan, MS (ENT) | Consultant ENT Surgeon & Director, Ahmedabad",
  description:
    "Dr. Vaidik Chauhan, MS (ENT) - Director & Head, Department of ENT at Atulya Superspeciality Hospital & ICU, Ahmedabad. 10+ Years Experience, 6000+ Surgeries in Septoplasty, FESS, Tympanoplasty & Mastoidectomy.",
  keywords: [
    "Dr Vaidik Chauhan ENT",
    "ENT Surgeon Ahmedabad",
    "Atulya Superspeciality Hospital ENT",
    "Septoplasty Ahmedabad",
    "FESS Sinus Surgery Ahmedabad",
    "Tympanoplasty Surgeon Gujarat",
    "Mastoidectomy Specialist",
    "KD Hospital ENT Consultant",
    "Prathana Hospital ENT Surgeon",
    "Ear Nose Throat Specialist Ahmedabad",
  ],
  openGraph: {
    title: "Dr. Vaidik Chauhan, MS (ENT) — Consultant ENT Surgeon, Ahmedabad",
    description:
      "Director & Head, Dept of ENT at Atulya Superspeciality Hospital & ICU, Ahmedabad. Over 6000+ successful surgeries in Otology & Rhinology.",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1f3a" },
  ],
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${sourceSans.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
