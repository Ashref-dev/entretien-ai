"use client";

import dynamic from "next/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AnimatedIcon = dynamic(
  () =>
    import("@/components/shared/animated-icon").then((mod) => mod.AnimatedIcon),
  { ssr: false },
);

const features = [
  {
    icon: "engagement",
    title: "AI-Powered Insights",
    description: "Get personalized feedback and analysis",
  },
  {
    icon: "consultation",
    title: "Industry Expertise",
    description: "Interviews tailored to your field",
  },
  {
    icon: "magicWand",
    title: "Continuous Learning",
    description: "Adapt and improve with each session",
  },
  {
    icon: "videoConference",
    title: "Natural Conversations",
    description: "Realistic interview simulations",
  },
  {
    icon: "cCode",
    title: "Technical Interviews",
    description: "Practice coding and system design",
  },
  {
    icon: "confetti",
    title: "Confidence Boost",
    description: "Feel prepared and reduce interview anxiety",
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <div
          key={index}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Card className="group transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <AnimatedIcon
                icon={feature.icon as any}
                className="mb-2 size-12 text-primary"
                playMode="hover"
                hoverDuration={2000}
              />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
