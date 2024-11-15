import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import LogoCloud from "@/components/sections/logo-cloud";
import ProductShowcase from "@/components/sections/product-showcase";
import HeroScroll from "@/components/sections/scroll-animation";
import Testimonials from "@/components/sections/testimonials";
import { CompareDemo } from "@/components/sections/Compare";
export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <HeroScroll />
      {/* <PreviewLanding /> */}
      {/* <Powered /> */}
      
      <LogoCloud />
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
