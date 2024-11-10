import Link from "next/link";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { AnimatedIcon } from "../shared/animated-icon";
import HeroCTA from "./hero-cta";

export default async function HeroLanding() {
  return (
    <section className="relative space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container relative flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href="https://www.linkedin.com/in/ahmedbalti/"
          className={cn(
            "flex items-center gap-2 rounded-full bg-neutral-600/50 px-3 py-2",
          )}
          target="_blank"
        >
          <div className="flex items-center gap-2">
            <Badge className="gap-1.5 bg-orange-400/90 text-white">
              What&apos;s new
            </Badge>
          </div>
          <p className="text-sm font-medium text-white">
            Revolutionizing Interview Preparation with AI
          </p>
        </Link>

        <div className="flex items-center justify-center gap-4">
          <AnimatedIcon
            icon="consultation"
            className="size-40 brightness-[3]"
            playMode="loop"
            hoverDuration={3000}
            speed={0.6}
          />
        </div>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[66px]">
          Nail Every Interview with Entretien AI
        </h1>

        <p className="max-w-2xl text-balance leading-normal text-white sm:text-xl sm:leading-8">
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
