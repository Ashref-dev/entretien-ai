/// <reference types="bun-types" />

import { User } from "@prisma/client";

import { Icons } from "@/components/shared/icons";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    gitHub: string;
    facebook: string;
    instagram: string;
    bluesky: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type DocsConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

// subcriptions
export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

// compare plans
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType;
};

// landing sections
export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type InfoLdg = {
  title: string;
  image: string;
  description: string;
  list: InfoList[];
};

export type FeatureLdg = {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
};

export type TestimonialType = {
  name: string;
  job: string;
  image: string;
  review: string;
};
export type InterviewStep = "initial" | "processing" | "results";

const SUPPORTED_LANGUAGES = {
  en: { name: "English", flag: "🇺🇸", greeting: "Hello!" },
  fr: { name: "French", flag: "🇫🇷", greeting: "Bonjour!" },
  es: { name: "Spanish", flag: "🇪🇸", greeting: "¡Hola!" },
  de: { name: "German", flag: "🇩🇪", greeting: "Hallo!" },
  ar: { name: "Arabic", flag: "🇸🇦", greeting: "!مرحبا" },
} as const;

export type InterviewDifficulty =
  | "JUNIOR"
  | "MID_LEVEL"
  | "SENIOR"
  | "LEAD"
  | "PRINCIPAL";

export type Interview = {
  id: string;
  userId: string;
  jobTitle: string;
  jobDescription: string;
  difficulty: InterviewDifficulty;
  yearsOfExperience: string;
  interviewScore: number | null;
  targetCompany?: string | null;
  overAllFeedback?: string | null;
  resume?: File | string | null;
  duration?: number | null;
  questionsAnswered?: number | null;
  skillsAssessed: string[];
  technicalScore?: number | null;
  communicationScore?: number | null;
  problemSolvingScore?: number | null;
  language: "en" | "fr" | "es" | "de" | "ar";
  createdAt: Date;
  updatedAt: Date;
  interviewData: {
    id: string;
    aiQuestion: string;
    aiAnswer: string;
    userAnswer: string;
    questionFeedback: string | null;
    questionsScore: number | null;
    learningResources?: {
      id: string;
      title: string;
      url: string;
      type: string;
      description: string;
    }[];
  }[];
};
