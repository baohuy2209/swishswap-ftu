"use client";

import BenefitsSection from "@/components/home/benefit-section";
import CtaSection from "@/components/home/cta-section";
import FaqSection from "@/components/home/faq-section";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";

const HomePage = () => {
  return (
    <div className="space-y-4 sm:space-y-8">
      <Hero />
      <Features />
      <BenefitsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
};
export default HomePage;
