"use client";

import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { AnimatedIcon } from "../shared/animated-icon";
import { HeaderSection } from "../shared/header-section";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    image: string;
    name: string;
    description: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = React.useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-slate-700 px-8 py-6 md:w-[450px]"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900))",
            }}
            key={item.name + idx}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 size-[calc(100%+1px)] rounded-[inherit]"
              ></div>
              <Image
                src={item.image}
                alt={item.name}
                className="mb-4 h-64 w-full rounded-lg object-cover"
                height={256}
                width={512}
              />
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-normal leading-[1.6] text-gray-400">
                    {item.description}
                  </span>
                  <span className="text-sm font-normal leading-[1.6] text-gray-400">
                    {item.name}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};

const products = [
  {
    image: "/_static/landing/shot5.webp",
    name: "Real-Time Interview Simulator",
    description:
      "Practice with our AI interviewer that adapts to your responses and provides instant feedback",
  },

  {
    image: "/_static/landing/shot2.webp",
    name: "Communication Coach",
    description:
      "Perfect your delivery with AI-powered feedback on clarity, confidence, and professional presence",
  },
  {
    image: "/_static/landing/shot3.webp",
    name: "Behavioral Interview Mastery",
    description:
      "Compare with the optimized answers and get instant feedback on your soft skills",
  },
  {
    image: "/_static/landing/shot4.webp",
    name: "Performance Analytics",
    description:
      "Track your progress across multiple mock interviews with detailed scoring and improvement insights",
  },
];

export default function ProductShowcase() {
  return (
    <div className="mt-16">
      <AnimatedIcon
        className="mx-auto size-24"
        icon="shootingStars"
        playMode="loop"
        speed={0.7}
      />
      <HeaderSection
        label="Junior to senior roles Interview Prep"
        title="Everything you need to land your next tech role"
        subtitle="We've got you covered from start to finish, junior developers to senior engineers, and everything in between."
      />
      <div className="relative flex h-[40rem] flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="flex flex-col items-center justify-center">
          <InfiniteMovingCards
            items={products}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </div>
  );
}
