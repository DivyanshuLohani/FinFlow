import CounterSection from "./components/counting-section";
import CTASection from "./components/cta";
import FeaturesSection from "./components/features-section";
import FooterSection from "./components/footer";
import HeroSection from "./components/hero-section";
import Navbar from "./components/navbar";

export default function HomePage() {
  return (
    <main className="scroll-smooth">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CounterSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
