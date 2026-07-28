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
  title:
    "Dr.Vaidik Chauhan, MD — Expert Ear, Nose & Throat Care | Meridian ENT Institute",
  description:
    "Dr. Vaidik Chauhan is a board-certified ENT surgeon with 20+ years of experience treating sinus, hearing, voice, sleep, and head & neck conditions at the Meridian ENT & Head-Neck Institute. Book your consultation today.",
  keywords: [
    "ENT surgeon",
    "ear nose throat doctor",
    "sinus surgery",
    "hearing loss",
    "sleep apnea",
    "pediatric ENT",
    "head and neck surgery",
  ],
  generator: "v0.app",
  openGraph: {
    title: "Dr. Vaidik Chauhan, MD — Expert Ear, Nose & Throat Care",
    description:
      "Board-certified ENT surgeon with 20+ years of experience. Compassionate, advanced care for the whole family.",
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
