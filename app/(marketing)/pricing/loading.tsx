import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container relative mx-auto px-4 py-44 sm:px-6 lg:px-8">
      {/* Background gradient skeleton */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-muted/30 to-muted/30 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <Skeleton className="mx-auto h-12 w-[280px] sm:w-[400px] md:w-[600px]" />
          <Skeleton className="mx-auto mt-6 h-16 w-[260px] sm:w-[380px] md:w-[500px]" />
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Support Card Skeleton */}
          <Skeleton className="h-[320px] w-full rounded-xl" />

          {/* GitHub Card Skeleton */}
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}
