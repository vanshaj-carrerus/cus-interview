import AiVisionSection from "@/components/home/AiVisionSection";
import DeveloperSkillsSection from "@/components/home/DeveloperSkillsSection";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import FeatureShowcase from "@/components/home/FeatureShowcase";
import BottomCtaCards from "@/components/home/BottomCtaCards";
import HeroLanding from "@/components/home/HeroLanding";

export const revalidate = 60;

const Home = () => {
  return (
    <>
      <HeroLanding />
      <AiVisionSection />
      <DeveloperSkillsSection />
      <FeatureShowcase />
      <HomeTestimonials />
      <BottomCtaCards />
    </>
  );
};

export default Home;
