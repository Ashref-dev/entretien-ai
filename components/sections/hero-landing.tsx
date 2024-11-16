import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { AnimatedIcon } from "../shared/animated-icon";
import { Icons } from "../shared/icons";
import BackgroundShader from "./background-shader";
import HeroCTA from "./hero-cta";

export default async function HeroLanding() {
  return (
    <section className="relative pt-6 sm:pt-10 lg:pt-16">
      <div className="container relative flex max-w-6xl flex-col items-center gap-5 text-center">
        {/* // le contenaire de le shader gradient  */}
        <div className="relative flex w-full justify-center overflow-hidden rounded-3xl py-12 ">
          <BackgroundShader />

          <div className="relative z-50 flex max-w-5xl flex-col items-center gap-5 text-center">
            <Link
              href="https://www.linkedin.com/in/rayenfassatoui/"
              className={cn(
                "z-50 flex items-center gap-1 rounded-full border border-white/20 bg-neutral-800/10 px-3 py-2 backdrop-blur-md transition-colors duration-300 hover:bg-white/20",
              )}
              target="_blank"
            >
              <div className="flex items-center gap-2">
                <Badge className="gap-1.5 bg-primary/80 text-white transition-colors">
                  <Icons.xTwitter className="size-4" />
                </Badge>
              </div>
              <p className="text-sm font-medium text-white/90">
                Interview preparation in the AI era
              </p>
              <ArrowRightIcon className="size-3 text-white" />
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
              Master Tech Interviews with AI-Powered Practice
            </h1>

            <p className="max-w-2xl text-balance leading-normal text-white sm:text-xl sm:leading-8">
              Get instant feedback, improve fast, and land your dream role. 95%
              of users increased confidence after just 3 sessions.
            </p>
          </div>
        </div>

        <HeroCTA />
      </div>
    </section>
  );
}
