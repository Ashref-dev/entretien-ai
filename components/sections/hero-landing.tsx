import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { AnimatedIcon } from "../shared/animated-icon";
import BackgroundShader from "./background-shader";
import HeroCTA from "./hero-cta";

export default async function HeroLanding() {
  return (
    <section className="relative space-y-6 py-12 sm:py-20 lg:py-20">
      {/* <BackgroundShader /> */}
      <div className="container relative flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href="https://www.linkedin.com/in/ahmedbalti/"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-3">
            <AnimatedIcon icon="xLogo" className="size-6" />
          </span>
          <span className="hidden md:flex">Revolutionizing&nbsp;</span>
          Interview Preparation with AI
        </Link>

        <div className="flex items-center justify-center gap-4">
          <AnimatedIcon
            icon="consultation"
            className="size-40"
            playMode="loop"
            hoverDuration={3000}
            speed={0.6}
          />
        </div>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Nail Every Interview with{" "}
          <span className="text-gradient font-extrabold">Entretien AI</span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Walk into your dream job interview with unshakeable confidence. Our
          AI-powered mock interviews simulate the real thing, providing instant
          feedback and expert coaching that turns interview anxiety into your
          competitive advantage.
        </p>

        <HeroCTA />
      </div>
    </section>
  );
}
