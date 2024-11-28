"use client";

import dynamic from "next/dynamic";

const AnimatedIconWrapper = dynamic(
  () =>
    import("./animated-icon-wrapper").then((mod) => mod.AnimatedIconWrapper),
  {
    ssr: false,
    loading: () => (
      <div className="size-40 animate-pulse rounded-xl bg-muted" />
    ),
  },
);

/**
 * A collection of animated icons using Lottie animations.
 * @type {AnimatedIconName}
 */
export type AnimatedIconName =
  | "barChart"
  | "kuaishouLogo"
  | "locationPin"
  | "xLogo"
  | "privacyPolicy"
  | "safetyRing"
  | "shootingStars"
  | "avatar"
  | "penEdit"
  | "free"
  | "document"
  | "abcHover"
  | "alarmClock"
  | "applause"
  | "arrowBack"
  | "arrowRestart"
  | "cCode"
  | "camera"
  | "coins"
  | "confetti"
  | "consultation"
  | "editIcon"
  | "email"
  | "engagement"
  | "enterKey"
  | "envelope"
  | "gift"
  | "html5"
  | "demand"
  | "api"
  | "instagram"
  | "javaCode"
  | "copyLink"
  | "linkedin"
  | "facebook"
  | "magicWand"
  | "microphone"
  | "phpCode"
  | "pythonCode"
  | "rules"
  | "suitcase"
  | "tiktok"
  | "trashBin"
  | "videoConference";

/**
 * Props for the AnimatedIcon component
 * @interface AnimatedIconProps
 */
interface AnimatedIconProps {
  /** The name of the icon animation to display */
  icon: AnimatedIconName;
  /** Optional CSS classes to apply to the icon */
  className?: string;
  /** Animation play mode
   * @default "hover"
   * - "loop": Plays the animation continuously
   * - "oneTime": Plays the animation once
   * - "hover": Plays the animation on hover
   */
  playMode?: "loop" | "oneTime" | "hover";
  /** Duration of the hover animation in milliseconds
   * @default 2000
   */
  hoverDuration?: number;
  /** Speed of the animation
   * @default 1
   */
  speed?: number;
}

/**
 * A component that displays animated icons using Lottie animations, defaulting to hover animations.
 *
 * @component
 * @example
 * // Basic usage
 * <AnimatedIcon icon="barChart" className="size-32" />
 *
 * @example
 * // With one time animation
 * <AnimatedIcon
 *   icon="confetti"
 *   playMode="oneTime"
 *   className="size-8"
 * />
 *
 *  @example
 * // With hover animation, long animations need more hover duration so they can complete before resetting the animation
 * <AnimatedIcon
 *   icon="confetti"
 *   playMode="hover"
 *   hoverDuration={3000}
 *   className="size-8"
 * />
 *
 * @example
 * // Continuous loop animation
 * <AnimatedIcon
 *   icon="loading"
 *   playMode="loop"
 *   className="size-8"
 * />
 */
export function AnimatedIcon({
  icon,
  className,
  playMode,
  hoverDuration,
  speed,
}: AnimatedIconProps) {
  return (
    <AnimatedIconWrapper
      icon={icon}
      className={className}
      playMode={playMode}
      hoverDuration={hoverDuration}
      speed={speed}
    />
  );
}
