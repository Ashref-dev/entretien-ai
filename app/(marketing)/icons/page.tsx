"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    AnimatedIcon,
    type AnimatedIconName,
} from "@/components/shared/animated-icon";

const iconNames: AnimatedIconName[] = [
  "barChart",
  "kuaishouLogo",
  "locationPin",
  "xLogo",
  "privacyPolicy",
  "safetyRing",
  "shootingStars",
  "avatar",
  "penEdit",
  "free",
  "document",
  "abcHover",
  "alarmClock",
  "applause",
  "arrowBack",
  "arrowRestart",
  "cCode",
  "camera",
  "coins",
  "confetti",
  "consultation",
  "editIcon",
  "email",
  "engagement",
  "enterKey",
  "envelope",
  "gift",
  "html5",
  "demand",
  "api",
  "instagram",
  "javaCode",
  "copyLink",
  "linkedin",
  "facebook",
  "magicWand",
  "microphone",
  "phpCode",
  "pythonCode",
  "rules",
  "suitcase",
  "tiktok",
  "trashBin",
  "videoConference",
];

export default function IconsPage() {
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const handleCopy = (iconName: string) => {
    navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold">Available Animated Icons</h1>
        <p className="text-muted-foreground">
          Hover over the icons to see their animations. Click the copy button to
          copy the icon name.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {iconNames.map((iconName) => (
          <div
            key={iconName}
            className="group relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent"
          >
            <AnimatedIcon
              icon={iconName}
              className="size-12"
              playMode="hover"
              hoverDuration={2000}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground">
              {iconName}
            </span>
            <button
              onClick={() => handleCopy(iconName)}
              className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-background hover:text-foreground group-hover:opacity-100"
              title="Copy icon name"
            >
              <Copy
                className={cn(
                  "size-4",
                  copiedIcon === iconName && "fill-green-500 text-green-500",
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
