import NewsLetter from "@/components/global/NewsLetter"
import CodingEnvironment from "@/components/home/Codingenvironment"
import CompaniesAndTestimonials from "@/components/home/CompanesAndTestimonials"
import FastTrackCourses from "@/components/home/Fasttrackcourses"
import CusInterviewHero from "@/components/home/Header&Hero"
import MockInterviewBanner from "@/components/home/Mockinterviewbanner"
import MockInterviews from "@/components/home/Mockinterviews"
import PracticeProblems from "@/components/home/Practiceproblems"
import VideoExplanations from "@/components/home/Videoexplanations"
import WebinarsSection from "@/components/home/Webinarssection"

const Home = () => {
  return (
    <>
      <CusInterviewHero />

      <div className="section-surface">
        <CompaniesAndTestimonials />
      </div>

      <div className="section-soft">
        <MockInterviewBanner />
        <WebinarsSection />
      </div>

      <div className="section-surface">
        <PracticeProblems />
        <FastTrackCourses />
      </div>

      <div className="section-soft">
        <MockInterviews />
        <VideoExplanations />
        <CodingEnvironment />
      </div>

      <div className="section-surface">
        <NewsLetter />
      </div>
    </>
  );
};

export default Home;