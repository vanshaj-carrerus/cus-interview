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
import { getSessionPublicUser } from "@/lib/get-session-user"
import { mergeProfileProgressByTrackSlug } from "@/lib/learning/home-cards"
import { getUserLearningProfile } from "@/lib/learning/service"
import { getTrackCards } from "@/lib/learning/server"

export const revalidate = 60

const Home = async () => {
  const [tracks, courses, sessionUser] = await Promise.all([
    getTrackCards("track"),
    getTrackCards("course"),
    getSessionPublicUser(),
  ])
  const profile = sessionUser
    ? await getUserLearningProfile(sessionUser.id, sessionUser.name || sessionUser.email)
    : null
  const courseProgressBySlug = mergeProfileProgressByTrackSlug(profile)

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
        <PracticeProblems tracks={tracks} />
        <FastTrackCourses courses={courses} progressBySlug={courseProgressBySlug} />
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