"use client"
import { useMemo } from "react";
import clsx from "clsx";

import DynamicLottie from "./lottie";

type AnimatedIconName = "edit" | "speech";

interface AnimatedIconProps {
  icon: AnimatedIconName;
  className?: string;
  playMode?: "loop" | "oneTime" | "hover";
  hoverDuration?: number;
}

const iconMap = {
  edit: () => import("@/assets/lotties/docEdit.json"),
  speech: () =>
    import(
      "@/assets/lotties/wired-outline-2803-engagement-alt-hover-pinch.json"
    ),
};

export function AnimatedIcon({
  icon,
  className,
  playMode,
  hoverDuration,
}: AnimatedIconProps) {
  const animationData = useMemo(() => iconMap[icon], [icon]);

  if (!animationData) {
    console.error(`Icon "${icon}" not found in iconMap`);
    return null;
  }

  return (
    <DynamicLottie
      animationData={animationData}
      className={clsx(
        "dark:brightness-75 dark:hue-rotate-180 dark:invert",
        className,
      )}
      playMode={playMode}
      hoverDuration={hoverDuration}
    />
  );
}
