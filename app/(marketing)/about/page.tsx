import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MovingBorderButton } from "@/components/ui/moving-border-button";

const AnimatedIcon = dynamic(
  () =>
    import("@/components/shared/animated-icon").then((mod) => mod.AnimatedIcon),
  { ssr: false },
);

export const metadata = constructMetadata({
  title: "About – Entretien AI",
  description:
    "Learn about our mission to revolutionize interview preparation.",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <header className="animate-fade-in-up mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            About Entretien AI
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Revolutionizing interview preparation with AI-powered mock
            interviews
          </p>
        </header>

        <section className="animate-fade-in-up mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                At Entretien AI, we&apos;re on a mission to empower job seekers
                with cutting-edge AI technology. Our platform provides
                realistic, adaptive mock interviews that help candidates build
                confidence and sharpen their skills, ensuring they&apos;re fully
                prepared to ace their real interviews.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Why Choose Entretien AI?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
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
            ].map((feature, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
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
        </section>

        <section className="animate-fade-in-up text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to ace your next interview?
          </h2>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
            Join thousands of successful candidates who have prepared with
            Entretien AI.
          </p>
          <Link href="/" passHref>
            <MovingBorderButton
              borderRadius="1rem"
              className="border-neutral-200 bg-white font-medium text-black dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              Get Started
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </MovingBorderButton>
          </Link>
        </section>
      </div>
    </div>
  );
}
