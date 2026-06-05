import { Suspense } from "react"
import NewsLetter from "@/components/global/NewsLetter"
import CodingEnvironment from "@/components/home/Codingenvironment"
import CompaniesAndTestimonials from "@/components/home/CompanesAndTestimonials"
import LearningSection from "@/components/home/LearningSection"
import FastTrackCourses, {
  FastTrackCoursesSection,
  FastTrackCoursesSkeleton,
} from "@/components/home/Fasttrackcourses"
import CusInterviewHero from "@/components/home/Header&Hero"
import MockInterviewBanner from "@/components/home/Mockinterviewbanner"
import PracticeProblems, {
  PracticeProblemsSection,
  PracticeProblemsSkeleton,
} from "@/components/home/Practiceproblems"
import VideoExplanations from "@/components/home/Videoexplanations"
import WebinarsSection from "@/components/home/Webinarssection"

export const revalidate = 60

const Home = () => {
  return (
    <>
      <CusInterviewHero />



      <div className="section-soft">
         <LearningSection />
        <WebinarsSection />
       
        <MockInterviewBanner />

      </div>

      <div className="section-surface">
        <Suspense fallback={<PracticeProblemsSkeleton />}>
          <PracticeProblemsSection />
        </Suspense>
        <Suspense fallback={<FastTrackCoursesSkeleton />}>
          <FastTrackCoursesSection />
        </Suspense>
      </div>

      <div className="section-soft">
        <VideoExplanations />
        <CodingEnvironment />
      </div>

      <div className="section-surface">
        <CompaniesAndTestimonials />
      </div>

      <div className="section-surface">
        <NewsLetter />
      </div>
    </>
  );
};

export default Home;