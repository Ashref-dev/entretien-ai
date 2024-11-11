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
    <section className="relative space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container relative flex max-w-6xl flex-col items-center gap-5 text-center">
        {/* // le contenaire de le shader gradient  */}
        <div className="relative flex w-full justify-center overflow-hidden rounded-3xl py-16">
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
                Revolutionizing Interview Preparation with AI
              </p>
              <ArrowRightIcon className="size-3" />
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
              Walk into your dream job interview with unshakeable confidence.
              Our AI-powered mock interviews simulate the real thing, providing
              instant feedback and expert coaching that turns interview anxiety
              into your competitive advantage.
            </p>
          </div>
        </div>

        <HeroCTA />
      </div>
    </section>
  );
}
