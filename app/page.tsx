import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { DoctorIntro } from "@/components/site/doctor-intro";
import { TrustStrip } from "@/components/site/trust-strip";
import { Specialties } from "@/components/site/specialties";
import { Services } from "@/components/site/services";
import { Conditions } from "@/components/site/conditions";
import { WhyChoose } from "@/components/site/why-choose";
import { Testimonials } from "@/components/site/testimonials";
import { Gallery } from "@/components/site/gallery";
import { Hospital } from "@/components/site/hospital";
import { Faq } from "@/components/site/faq";
import { HealthLibrary } from "@/components/site/health-library";
import { FinalCta } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";
import { WhatsAppButton } from "@/components/site/whatsapp-button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <DoctorIntro />
        <TrustStrip />
        <Specialties />
        <Services />
        <Conditions />
        <WhyChoose />
        <Testimonials />
        <Gallery />
        <Hospital />
        <Faq />
        <HealthLibrary />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
