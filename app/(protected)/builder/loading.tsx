import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardInterviewsLoading() {
  return (
    <>
      <DashboardHeader heading="Interviews" text="Manage Interviews" />
      <div className="rounded-lg border border-dashed p-8 shadow-sm animate-in fade-in-50">
        <div className="flex h-[40vh] flex-col items-center justify-center text-center">
          {/* Icon skeleton */}
          <div className="mb-8">
            <Skeleton className="size-32 rounded-full" />
          </div>

          {/* Heading skeleton */}
          <Skeleton className="mb-4 h-10 w-64" />

          {/* Text skeleton */}
          <Skeleton className="mb-8 h-7 w-48" />

          {/* Button skeleton */}
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </>
  );
}
