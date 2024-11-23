export function WebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Entretien AI",
    description:
      "AI-powered interview preparation platform for software developers",
    url: "https://entretien-ai.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://entretien-ai.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    sameAs: [
      "https://twitter.com/entretien_ai",
      "https://github.com/ashref-dev",
    ],
    keywords: [
      "interview preparation",
      "technical interviews",
      "AI interview practice",
      "coding interviews",
      "software developer interviews",
    ],
  };
}

export function BlogPostJsonLd({ post }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `https://entretien-ai.com/authors/${post.author.slug}`,
    },
    datePublished: post.date,
    dateModified: post.lastModified || post.date,
    image: {
      "@type": "ImageObject",
      url: post.image,
      width: "1200",
      height: "630",
    },
    publisher: {
      "@type": "Organization",
      name: "Entretien AI",
      logo: {
        "@type": "ImageObject",
        url: "https://entretien-ai.com/_static/logo.png",
        width: "60",
        height: "60",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://entretien-ai.com/blog/${post.slug}`,
    },
    keywords: post.categories.join(","),
    articleBody: post.content,
    wordCount: post.content.split(" ").length,
  };
}

export function InterviewServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Interview Practice",
    serviceType: "Interview Preparation",
    provider: {
      "@type": "Organization",
      name: "Entretien AI",
      description: "AI-powered interview preparation platform",
      url: "https://entretien-ai.com",
    },
    areaServed: "Worldwide",
    description:
      "AI-powered interview preparation service for software developers",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ).toISOString(),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "500",
      bestRating: "5",
      worstRating: "1",
    },
  };
}
