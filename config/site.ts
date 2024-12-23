import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Entretien AI",
  description:
    "Walk into your dream job interview with unshakeable confidence. Our AI-powered mock interviews simulate the real thing, providing instant feedback and expert coaching that turns interview anxiety into your competitive advantage.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    gitHub: "https://github.com/Ashref-dev/entretien-ai",
    twitter: "https://x.com/enretien_ai",
    instagram: "https://www.instagram.com/entretien_ai/",
    facebook: "https://facebook.com/513241155206826",
    bluesky: "https://bsky.app/profile/entretien-ai.com",
  },
  mailSupport: "support@entretien-ai.com",
};

export const SUPPORTED_LANGUAGES = {
  EN: { name: "English", flag: "🇺🇸", greeting: "Hello!" },
  FR: { name: "French", flag: "🇫🇷", greeting: "Bonjour!" },
  ES: { name: "Spanish", flag: "🇪🇸", greeting: "¡Hola!" },
  DE: { name: "German", flag: "🇩🇪", greeting: "Hallo!" },
  AR: { name: "Arabic", flag: "🇸🇦", greeting: "!مرحبا" },
} as const;

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/about" },
      // { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  // {
  //   title: "Product",
  //   items: [
  //     { title: "Security", href: "#" },
  //     { title: "Customization", href: "#" },
  //     { title: "Customers", href: "#" },
  //     { title: "Changelog", href: "#" },
  //   ],
  // },
  // {
  //   title: "Docs",
  //   items: [
  //     { title: "Introduction", href: "#" },
  //     { title: "Installation", href: "#" },
  //     { title: "Components", href: "#" },
  //     { title: "Code Blocks", href: "#" },
  //   ],
  // },
];
