"use client";

import BenefitsSection from "@/components/home/benefit-section";
import CtaSection from "@/components/home/cta-section";
import FaqSection from "@/components/home/faq-section";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";
import { ListingClient } from "../sell/current-listing";
import TrendingListing from "./trending-listing";
export type ListingWithImage = (ListingClient & {
  image_url: string;
})[];
const HomePage = ({ safeListings }: { safeListings?: ListingWithImage }) => {
  return (
    <div className="space-y-4 sm:space-y-8">
      <Hero />
      <Features />
      <BenefitsSection />
      <TrendingListing safeListings={safeListings} />
      <FaqSection />
      <CtaSection />
    </div>
  );
};
export default HomePage;
