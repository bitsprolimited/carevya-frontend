import { HomeCommitmentSection } from "@/features/marketing/components/home-commitment-section";
import { HomeHeroSection } from "@/features/marketing/components/home-hero-section";
import { HomeHowItWorksSection } from "@/features/marketing/components/home-how-it-works-section";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomeHeroSection />
      <HomeHowItWorksSection />
      <HomeCommitmentSection />
    </div>
  );
}
