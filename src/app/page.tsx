import CTASection from "./components/cta";
import FeaturesSection from "./components/features-section";
import FooterSection from "./components/footer";
import HeroSection from "./components/hero-section";
import Navbar from "./components/navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </>
  );
}
