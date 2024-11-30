import { infos } from "@/config/landing";
import BackgroundShaderClient from "@/components/sections/background-shader-client";
import BentoGrid from "@/components/sections/bentogrid";
import { CompareDemo } from "@/components/sections/Compare";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import MarqueeLogo from "@/components/sections/marquee-logo";
import ProductShowcase from "@/components/sections/product-showcase";
import HeroScroll from "@/components/sections/scroll-animation";
import Testimonials from "@/components/sections/testimonials";

export default function IndexPage() {
  return (
    <>
      {/* // aniamted background shader  */}
      <BackgroundShaderClient className="absolute inset-0 z-[-1] h-[calc(100vh+200px)] w-full animate-fade-in opacity-0 [animation-delay:2200ms]" />

      <HeroLanding />

      <MarqueeLogo />
      <HeroScroll />
      {/* <PreviewLanding /> */}
      {/* <Powered /> */}
      {/* <LogoCloud /> */}
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      <CompareDemo />
      <InfoLanding data={infos[1]} />
      <Features />
      <ProductShowcase />
      <Testimonials />
    </>
  );
}
