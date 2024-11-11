import { infos } from "@/config/landing";
import BackgroundShader from "@/components/sections/background-shader";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import LogoCloud from "@/components/sections/logo-cloud";
import PreviewLanding from "@/components/sections/preview-landing";
import { StickyScroll } from "@/components/sections/sticky-scroll-reveal";
import Testimonials from "@/components/sections/testimonials";


const content = [
  {
    title: "Career Growth with AI",
    description:
      "AI is revolutionizing how professionals advance their careers. From personalized learning recommendations to automated skill assessments, AI tools help identify growth opportunities and provide targeted development paths tailored to your career goals.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        <img src="_static/blog/blog-post-1.jpg" alt="Career Growth"/>
      </div>
    ),
  },
  {
    title: "AI-Powered Productivity",
    description:
      "Leverage AI to automate routine tasks and focus on high-impact work. AI assistants can handle everything from email management to data analysis, giving you more time to develop strategic skills and tackle complex challenges.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Enhanced Productivity
      </div>
    ),
  },
  {
    title: "Skill Enhancement",
    description:
      "Stay ahead of industry trends with AI-driven learning platforms. These systems analyze your skills gap and provide personalized training recommendations, helping you remain competitive in an ever-evolving job market.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--purple-500),var(--pink-500))] flex items-center justify-center text-white">
        Continuous Learning
      </div>
    ),
  },
  {
    title: "Professional Networking",
    description:
      "AI algorithms can identify valuable networking opportunities and connect you with mentors and peers in your field. These smart connections help build meaningful professional relationships that can accelerate your career growth.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--blue-500),var(--indigo-500))] flex items-center justify-center text-white">
        Smart Networking
      </div>
    ),
  },
];

export default function IndexPage() {
  return (
    <>
      <BackgroundShader />
      <HeroLanding />
      <PreviewLanding />
      {/* <Powered /> */}
      <LogoCloud />
      <StickyScroll 
        content={content} 
        contentClassName="scrollbar-none" 
      />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      <InfoLanding data={infos[1]} />
      <Features />
      <Testimonials />
    </>
  );
}
