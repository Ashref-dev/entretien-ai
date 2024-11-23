import { Post } from "@/.contentlayer/generated";

import {
    BlogPostJsonLd,
    InterviewServiceJsonLd,
    WebsiteJsonLd,
} from "./json-ld";

export default function JsonLdWrapper({
  type,
  post = null,
  includeService = true,
}: {
  type: "blog" | "website";
  post?: Post | null;
  includeService?: boolean;
}) {
  return (
    <>
      {/* Always include the website schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WebsiteJsonLd()) }}
      />

      {/* Include blog post schema when viewing a post */}
      {type === "blog" && post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(BlogPostJsonLd({ post })),
          }}
        />
      )}

      {/* Include interview service schema when needed */}
      {includeService && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(InterviewServiceJsonLd()),
          }}
        />
      )}
    </>
  );
}
