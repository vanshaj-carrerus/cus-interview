import AiVisionSection from "@/components/home/AiVisionSection";
import DeveloperSkillsSection from "@/components/home/DeveloperSkillsSection";
import HomeTestimonials from "@/components/home/HomeTestimonials";
import BottomCtaCards from "@/components/home/BottomCtaCards";
import CusInterviewHero from "@/components/home/Header&Hero";

export const revalidate = 60;

const Home = () => {
  return (
    <>
      <CusInterviewHero />
      <AiVisionSection />
      <DeveloperSkillsSection />
      <HomeTestimonials />
      <BottomCtaCards />
    </>
  );
};

export default Home;
