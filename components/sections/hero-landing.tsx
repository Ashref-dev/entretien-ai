import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { AnimatedIcon } from "../shared/animated-icon";
import { Icons } from "../shared/icons";
import HeroCTA from "./hero-cta";

export default function HeroLanding() {
  return (
    <section className="relative pt-6 sm:pt-10 lg:pt-16">
      <div className="container relative flex max-w-6xl flex-col items-center gap-5 text-center">
        {/* // le contenaire de le shader gradient  */}
        <div className="relative flex w-full justify-center rounded-3xl py-8">
          <div className="pointer-events-none hidden touch-none select-none lg:block">
            {/* <div className="absolute inset-0 ">
              <div className="absolute -left-[40%] -top-[20%] h-[800px] w-[800px] rounded-full bg-[#994bff] opacity-30 blur-[120px]" />
              <div className="absolute -right-[40%] top-[0%] h-[900px] w-[900px] rounded-full bg-[#36cde1] opacity-30 blur-[120px]" />
              <div className="absolute bottom-[0%] left-[20%] h-[600px] w-[600px] rounded-full bg-[#994bff] opacity-20 blur-[120px]" />
            </div> */}
            {/* <BackgroundShader /> */}
          </div>

          <div className="relative z-50 flex max-w-5xl flex-col items-center gap-5 text-center">
            <Link
              href={siteConfig.links.bluesky}
              className={cn(
                "z-50 flex items-center gap-1 rounded-full border px-3 py-2 backdrop-blur-md transition-colors duration-300",
                "border-black/20 bg-white/10 hover:bg-black/20",
                "dark:border-white/20 dark:bg-neutral-800/10 dark:hover:bg-white/20",
                "animate-fade-down opacity-0 [animation-delay:2200ms]",
              )}
              target="_blank"
            >
              <div className="flex items-center gap-2">
                <Badge className="gap-1.5 bg-primary/80 text-white transition-colors">
                  <Icons.bluesky className="size-3 text-black dark:text-white sm:size-4" />
                </Badge>
              </div>
              <p className="text-xs font-medium text-black/90 dark:text-white/90 sm:text-sm">
                Interview preparation in the AI era
              </p>
              <ArrowRightIcon className="size-3 text-black dark:text-white" />
            </Link>

            <div className="flex animate-fade-down items-center justify-center gap-4 opacity-0 [animation-delay:1600ms]">
              <AnimatedIcon
                icon="consultation"
                className="size-40 brightness-[1] lg:brightness-[3] lg:invert dark:lg:invert-0"
                playMode="loop"
                hoverDuration={3000}
                speed={0.6}
              />
            </div>

            <h1 className="animate-fade-up text-balance font-urban text-4xl font-extrabold tracking-tight text-black opacity-0 [animation-delay:100ms] dark:text-white sm:text-5xl md:text-6xl lg:text-[66px]">
              Land Your Dream Job With Our Interview Practice
            </h1>

            <p className="max-w-2xl animate-fade-up text-balance font-medium leading-normal text-black/90 opacity-0 [animation-delay:600ms] dark:text-white sm:text-xl sm:leading-8">
              Get instant feedback, improve fast, and land your dream role. 95%
              of users increased confidence after just 3 sessions.
            </p>
            <div className="animate-fade-up opacity-0 [animation-delay:1100ms]">
              <HeroCTA />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
