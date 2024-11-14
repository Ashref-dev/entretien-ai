import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "Perfect for Interview Preparation",
    benefits: [
      "Generate up to 10 AI-powered mock interviews",
      "Comprehensive interview history tracking",
      "Detailed performance analytics",
      "Question-by-question feedback analysis",
      "Interview confidence scoring",
    ],
    limitations: [
      "Limited to 10 interview generations",
      "No direct AI interview chat",
      "Basic feedback only",
      "No custom interview focus areas",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "For Serious Job Seekers",
    benefits: [
      "Unlimited AI interview generations",
      "Interactive AI interview chat assistant",
      "Deep-dive feedback analysis",
      "Custom interview focus areas",
      "Question-specific improvement insights",
      "Real-time performance tracking",
      "Priority access to new features",
    ],
    limitations: [],
    prices: {
      monthly: 10,
      yearly: 90,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  },
];

export const plansColumns = ["starter", "pro"] as const;

export const comparePlans: PlansRow[] = [
  {
    feature: "AI Interview Generation",
    starter: "10 interviews",
    pro: "Unlimited",
    tooltip: "Generate realistic mock interviews tailored to your experience",
  },
  {
    feature: "Interview History",
    starter: true,
    pro: true,
    tooltip: "Track all your past interviews and progress over time",
  },
  {
    feature: "Performance Analytics",
    starter: "Basic",
    pro: "Advanced",
    tooltip:
      "Detailed insights into your interview performance and improvements",
  },
  {
    feature: "AI Chat Assistant",
    starter: null,
    pro: true,
    tooltip:
      "Chat directly with AI about specific interview questions and answers",
  },
  {
    feature: "Feedback Analysis",
    starter: "Question-level",
    pro: "Deep-dive & Custom",
    tooltip: "Get detailed feedback on your interview responses",
  },
  {
    feature: "Custom Focus Areas",
    starter: null,
    pro: true,
    tooltip: "Specify areas you want to improve in your interviews",
  },
  {
    feature: "Response Analysis",
    starter: "Basic",
    pro: "Advanced",
    tooltip:
      "In-depth analysis of your interview responses and communication style",
  },
  {
    feature: "Progress Tracking",
    starter: "Basic",
    pro: "Comprehensive",
    tooltip: "Track your improvement across multiple interviews",
  },
];
