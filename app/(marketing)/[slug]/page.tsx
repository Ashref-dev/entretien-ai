import { notFound } from "next/navigation";

import { Mdx } from "@/components/content/mdx-components";

import "@/styles/mdx.css";

import { Metadata } from "next";
import { allPages } from "@/.contentlayer/generated";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slugAsParams,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  try {
    const parameters = await params;
    const page = allPages.find((page) => page.slugAsParams === parameters.slug);
    if (!page) {
      return;
    }

    const { title, description } = page;

    return constructMetadata({
      title: `${title} – Entretien AI`,
      description: description,
    });
  } catch (error) {
    console.error("Metadata generation error:", error);
    return constructMetadata({
      title: "Entretien AI",
      description: "Loading...",
    });
  }
}

export default async function PagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const parameters = await params;
    const page = allPages.find((page) => page.slugAsParams === parameters.slug);

    if (!page) {
      notFound();
    }

    const images = await Promise.all(
      page.images?.map(async (src: string) => ({
        src,
        blurDataURL: await getBlurDataURL(src),
      })) ?? [],
    );

    return (
      <article className="container max-w-3xl py-6 lg:py-12">
        <div className="space-y-4">
          <h1 className="inline-block font-heading text-4xl lg:text-5xl">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-xl text-muted-foreground">{page.description}</p>
          )}
        </div>
        <hr className="my-4" />
        <Mdx code={page.body.code} images={images} />
      </article>
    );
  } catch (error) {
    console.error("Page rendering error:", error);
    notFound();
  }
}
