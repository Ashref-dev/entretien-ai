"use client";

import { useMemo } from "react";
import clsx from "clsx";

import DynamicLottie from "./lottie";

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

export const iconMap = {
  barChart: () => import("@/assets/lotties/Gradient Bar Chart Growth.json"),
  kuaishouLogo: () =>
    import("@/assets/lotties/Kuaishou Logo Gradient Icon.json"),
  locationPin: () => import("@/assets/lotties/Location Pin Hover Jump.json"),
  xLogo: () => import("@/assets/lotties/Lordicon Gradient Logo.json"),
  privacyPolicy: () =>
    import("@/assets/lotties/Lordicon Privacy Policy Hover Swipe.json"),
  safetyRing: () => import("@/assets/lotties/Rescue Safety Ring Icon.json"),
  shootingStars: () =>
    import("@/assets/lotties/Shooting Stars Hover Pinch.json"),
  avatar: () =>
    import("@/assets/lotties/Wired Gradient 21 Avatar Hover Jumping.json"),
  penEdit: () => import("@/assets/lotties/Wired Gradient 35 Hover Circle.json"),
  free: () =>
    import("@/assets/lotties/Wired Gradient 501 Free Hover Roll.json"),
  document: () => import("@/assets/lotties/Wired Gradient 56 Hover Swipe.json"),
  abcHover: () =>
    import("@/assets/lotties/Wired Gradient ABC Hover Pinch.json"),
  alarmClock: () => import("@/assets/lotties/Wired Gradient Alarm Clock.json"),
  applause: () =>
    import("@/assets/lotties/Wired Gradient Applause Hover Pinch.json"),
  arrowBack: () => import("@/assets/lotties/Wired Gradient Arrow 6 Hover.json"),
  arrowRestart: () =>
    import("@/assets/lotties/Wired Gradient Arrow 7 Hover.json"),
  cCode: () => import("@/assets/lotties/Wired Gradient C Code Icon.json"),
  camera: () =>
    import("@/assets/lotties/Wired Gradient Camera Hover Flash.json"),
  coins: () => import("@/assets/lotties/Wired Gradient Coins Hover Jump.json"),
  confetti: () =>
    import("@/assets/lotties/Wired Gradient Confetti Hover Pinch.json"),
  consultation: () =>
    import(
      "@/assets/lotties/Wired Gradient Consultation Hover Conversation.json"
    ),
  editIcon: () => import("@/assets/lotties/Wired Gradient Edit Icon.json"),
  email: () =>
    import("@/assets/lotties/Wired Gradient Email Hover Rotation.json"),
  engagement: () =>
    import("@/assets/lotties/Wired Gradient Engagement Hover Pinch.json"),
  enterKey: () =>
    import("@/assets/lotties/Wired Gradient Enter Key Hover Press.json"),
  envelope: () =>
    import("@/assets/lotties/Wired Gradient Envelope Send Hover.json"),
  gift: () => import("@/assets/lotties/Wired Gradient Gift Hover Squeeze.json"),
  html5: () => import("@/assets/lotties/Wired Gradient HTML 5 Code.json"),
  demand: () => import("@/assets/lotties/Wired Gradient Hover Click.json"),
  api: () => import("@/assets/lotties/Wired Gradient Icon Hover.json"),
  instagram: () =>
    import("@/assets/lotties/Wired Gradient Instagram Logo.json"),
  javaCode: () =>
    import("@/assets/lotties/Wired Gradient Java Code Hover Pinch.json"),
  copyLink: () =>
    import("@/assets/lotties/Wired Gradient Link Unlink Hover Bounce.json"),
  linkedin: () => import("@/assets/lotties/Wired Gradient LinkedIn Icon.json"),
  facebook: () => import("@/assets/lotties/Wired Gradient Logo Facebook.json"),
  magicWand: () =>
    import("@/assets/lotties/Wired Gradient Magic Wand Hover.json"),
  microphone: () =>
    import("@/assets/lotties/Wired Gradient Microphone Recording.json"),
  phpCode: () =>
    import("@/assets/lotties/Wired Gradient PHP Code Hover Pinch.json"),
  pythonCode: () => import("@/assets/lotties/Wired Gradient Python Code.json"),
  rules: () => import("@/assets/lotties/Wired Gradient Rules Hover Pinch.json"),
  suitcase: () =>
    import("@/assets/lotties/Wired Gradient Suitcase Hover Pinch.json"),
  tiktok: () => import("@/assets/lotties/Wired Gradient TikTok Icon.json"),
  trashBin: () =>
    import("@/assets/lotties/Wired Gradient Trash Bin Hover.json"),
  videoConference: () =>
    import("@/assets/lotties/Wired Gradient Video Conference.json"),
};

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
export function AnimatedIconWrapper({
  icon,
  className,
  playMode,
  hoverDuration,
  speed,
}: AnimatedIconProps) {
  const animationData = useMemo(() => iconMap[icon], [icon]);

  if (!animationData) {
    console.error(`Icon "${icon}" not found in iconMap`);
    return null;
  }

  return (
    <DynamicLottie
      animationData={animationData}
      className={clsx(className)}
      playMode={playMode}
      hoverDuration={hoverDuration}
      speed={speed}
    />
  );
}
