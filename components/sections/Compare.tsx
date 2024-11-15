import React from "react";
import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
  return (
    <div className="container mx-auto py-20">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Compare Your Answer with AI
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          See how your responses stack up against AI-optimized answers
        </p>
      </div>

      <div className="flex items-center justify-center h-[80vh] [perspective:800px] [transform-style:preserve-3d]">
        <div
          style={{
            transform: "rotateX(15deg) translateZ(80px)",
          }}
          className="p-1 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 w-full max-w-5xl h-3/4 md:h-[85%]"
        >
          <Compare
            firstImage="/_static/landing/shot6.png"
            secondImage="/_static/landing/shot7.png"
            firstImageClassName="object-contain w-full h-full"
            secondImageClassname="object-contain w-full h-full"
            className="w-full h-full rounded-[22px] md:rounded-lg"
            slideMode="hover"
            autoplay={true}
          />
        </div>
      </div>
    </div>
  );
}