import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { DoctorIntro } from "@/components/site/doctor-intro";
import { TrustStrip } from "@/components/site/trust-strip";
import { SurgicalMilestones } from "@/components/site/surgical-milestones";
import { Specialties } from "@/components/site/specialties";
import { Services } from "@/components/site/services";
import { Experience } from "@/components/site/experience";
import { ResearchPublications } from "@/components/site/research-publications";
import { WorkshopsTraining } from "@/components/site/workshops-training";
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
import { VisitorTracker } from "@/components/site/visitor-tracker";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <VisitorTracker />
      <Navbar />
      <main>
        <Hero />
        <DoctorIntro />
        <TrustStrip />
        <SurgicalMilestones />
        <Specialties />
        <Services />
        <Experience />
        <ResearchPublications />
        <WorkshopsTraining />
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
