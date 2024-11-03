import { Metadata } from "next";

import {
  AnimatedIcon,
  AnimatedIconName,
} from "@/components/shared/animated-icon";

import CopyName from "./CopyName";

export const metadata: Metadata = {
  title: "Entretien AI Animated Lottie Icons",
  description: "Browse our collection of beautiful animated Lottie icons.",
};

const IconsPage = () => {
  const icons = {
    barChart: "barChart",
    kuaishouLogo: "kuaishouLogo",
    locationPin: "locationPin",
    xLogo: "xLogo",
    privacyPolicy: "privacyPolicy",
    safetyRing: "safetyRing",
    shootingStars: "shootingStars",
    avatar: "avatar",
    penEdit: "penEdit",
    free: "free",
    document: "document",
    abcHover: "abcHover",
    alarmClock: "alarmClock",
    applause: "applause",
    arrowBack: "arrowBack",
    arrowRestart: "arrowRestart",
    cCode: "cCode",
    camera: "camera",
    coins: "coins",
    confetti: "confetti",
    consultation: "consultation",
    editIcon: "editIcon",
    email: "email",
    engagement: "engagement",
    enterKey: "enterKey",
    envelope: "envelope",
    gift: "gift",
    html5: "html5",
    demand: "demand",
    api: "api",
    instagram: "instagram",
    javaCode: "javaCode",
    copyLink: "copyLink",
    linkedin: "linkedin",
    facebook: "facebook",
    magicWand: "magicWand",
    microphone: "microphone",
    phpCode: "phpCode",
    pythonCode: "pythonCode",
    rules: "rules",
    suitcase: "suitcase",
    tiktok: "tiktok",
    trashBin: "trashBin",
    videoConference: "videoConference",
  } as const;

  // Get all icon names from the AnimatedIconName type
  const iconNames = Object.keys(icons) as AnimatedIconName[];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="mb-6 text-4xl font-bold">AI Icons Gallery 🤖</h1>
        <p className="mb-12 max-w-2xl text-muted-foreground">
          Hover over each icon to see its animation. Click the name below to
          copy the icon component code.
        </p>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {iconNames.map((iconName) => (
            <div key={iconName} className="flex flex-col items-center gap-3">
              <div className="group relative flex aspect-square size-24 items-center justify-center rounded-2xl border bg-background p-4 shadow-sm transition-colors hover:bg-accent/50">
                <AnimatedIcon
                  icon={iconName}
                  className="size-full"
                  playMode="hover"
                  hoverDuration={3000}
                />
              </div>
              <CopyName text={iconName} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconsPage;
