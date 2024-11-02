import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { env } from "@/env.mjs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

import { MovingBorderButton } from "../ui/moving-border";
import HeroCTA from "./hero-cta";

export default async function HeroLanding() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/mickasmt/next-saas-stripe-starter",
    {
      ...(env.GITHUB_OAUTH_TOKEN && {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }),
      next: { revalidate: 3600 },
    },
  )
    .then((res) => res.json())
    .catch((e) => console.log(e));

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href="https://twitter.com/yourtwitterhandle"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4",
          )}
          target="_blank"
        >
          <span className="mr-3">🎯</span>
          <span className="hidden md:flex">Revolutionizing&nbsp;</span>{" "}
          Interview Preparation with AI{" "}
          <Icons.twitter className="ml-2 size-3.5" />
        </Link>

        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Master Your Next Interview with{" "}
          <span className="text-gradient font-extrabold">Interview AI</span>
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Practice smarter with AI-powered mock interviews tailored to your
          role. Get real-time feedback, expert analysis, and personalized
          coaching to land your dream job.
        </p>

        
        <HeroCTA />
      </div>
    </section>
  );
}
