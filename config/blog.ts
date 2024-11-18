export const BLOG_CATEGORIES: {
  title: string;
  slug: "news" | "education" | "interviews" | "ai";
  description: string;
}[] = [
  {
    title: "News",
    slug: "news",
    description: "Updates and announcements from Entretien AI.",
  },
  {
    title: "Interview Preparation",
    slug: "interviews",
    description: "Interviews and tips for technical interviews.",
  },
];

export const BLOG_AUTHORS = {
  rayen: {
    name: "Rayen Fassatoui",
    image: "/_static/avatars/mickasmt.png",
    twitter: "rayen",
  },
  ashref: {
    name: "Ashref Ben Abdallah",
    image: "/_static/avatars/shadcn.jpeg",
    twitter: "ashref",
  },
};
