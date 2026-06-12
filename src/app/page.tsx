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

import CareerGuidanceBanner from "@/components/home/CareerGuidanceBanner"
import CrackedInterviewsSection from "@/components/home/CrackedInterviewsSection"
import MustExplore from "@/components/home/MustExplore"
import ExploreTopics from "@/components/home/ExploreTopics"


export const revalidate = 60

const Home = () => {
  return (
    <>
      <CusInterviewHero />

      <div className="section-soft">
        <LearningSection />
        <CareerGuidanceBanner />
        <MustExplore />
        <ExploreTopics /> 
      </div>

      {/* <div className="section-surface">
        <Suspense fallback={<PracticeProblemsSkeleton />}>
          <PracticeProblemsSection />
        </Suspense>
        <Suspense fallback={<FastTrackCoursesSkeleton />}>
          <FastTrackCoursesSection />
        </Suspense>
      </div> */}
    </>
  );
};

export default Home;