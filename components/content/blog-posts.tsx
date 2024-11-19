import { Post } from "@/.contentlayer/generated";

import { BlogCard } from "./blog-card";

export function BlogPosts({
  posts,
}: {
  posts: (Post & {
    blurDataURL: string;
  })[];
}) {
  const livePost = posts.find((post) => post.slugAsParams === "we-are-live");

  return (
    <main className="space-y-8">
      <BlogCard data={livePost!} horizontale priority />

      <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
        {posts
          .filter((post) => post.slugAsParams != "we-are-live")
          .map((post, idx) => (
            <BlogCard data={post} key={post._id} priority={idx <= 2} />
          ))}
      </div>
    </main>
  );
}
