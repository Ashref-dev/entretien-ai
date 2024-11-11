"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { theme } = useTheme();
  const currentTheme = theme as 'light' | 'dark' | 'system';

  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = {
    light: [
      "var(--background)",
      "var(--card)",
      "var(--popover)",
    ],
    dark: [
      "var(--background)",
      "var(--card)",
      "var(--popover)",
    ],
  };

  const linearGradients = {
    light: [
      "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
      "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
      "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
    ],
    dark: [
      "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
      "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
      "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
    ],
  };

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[currentTheme === 'system' ? 'light' : currentTheme][0],
  );

  useEffect(() => {
    setBackgroundGradient(
      linearGradients[currentTheme === 'system' ? 'light' : currentTheme][
        activeCard % linearGradients[currentTheme === 'system' ? 'light' : currentTheme].length
      ],
    );
  }, [activeCard, currentTheme]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[currentTheme][activeCard % backgroundColors[currentTheme].length],
      }}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-md p-10"
      ref={ref}
      style={{
        msOverflowStyle: "none", // IE and Edge
        scrollbarWidth: "none", // Firefox
      
      }}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-kg mt-10 max-w-sm text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-10 hidden h-60 w-80 overflow-hidden rounded-md bg-white lg:block",
          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
