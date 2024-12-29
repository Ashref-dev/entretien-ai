import type { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts.map((post) => ({
    url: `https://www.entretien-ai.com/blog/${post.slugAsParams}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const routes = [
    {
      url: "https://www.entretien-ai.com",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    
    {
      url: "https://www.entretien-ai.com/pricing",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: "https://www.entretien-ai.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: "https://www.entretien-ai.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: "https://www.entretien-ai.com/login",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    // {
    //   url: "https://www.entretien-ai.com/register",
    //   lastModified: new Date(),
    //   changeFrequency: "yearly",
    //   priority: 1,
    // },
  ];

  return [...routes, ...posts];
}
