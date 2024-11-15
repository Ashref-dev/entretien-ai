import React from "react";

import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
  return (
    <div className="container mx-auto py-20">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ideal answers tailored for your resume
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          See optimal answers for every situation
        </p>
      </div>

      <div className="flex h-[40vh] items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
        <div
          style={{
            transform: "rotateX(15deg) translateZ(80px)",
          }}
          className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900 md:h-[85%] md:p-4"
        >
          <Compare
            firstImage="/_static/landing/shot6.png"
            secondImage="/_static/landing/shot7.png"
            firstImageClassName="object-contain w-full h-full"
            secondImageClassname="object-contain w-full h-full"
            className="size-full rounded-[22px] md:rounded-lg"
            slideMode="hover"
            autoplay={true}
          />
        </div>
      </div>
    </div>
  );
}
