import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Problem from "./components/Problem";
import Comparison from "./components/Comparison";
import Solution from "./components/Solution";
import Showcase from "./components/Showcase";
import Benefits from "./components/Benefits";
import SocialProof from "./components/SocialProof";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import CTAFinal from "./components/CTAFinal";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <Comparison />
        <Solution />
        <Showcase />
        <Benefits />
        <SocialProof />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
