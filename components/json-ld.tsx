export function WebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Entretien AI',
    description: 'AI-powered interview preparation platform',
    url: 'https://entretien-ai.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://entretien-ai.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }
}

export function BlogPostJsonLd({ post }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author.name
    },
    datePublished: post.date,
    image: post.image,
    articleBody: post.content
  }
}
