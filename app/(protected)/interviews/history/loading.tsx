import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardInterviewsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Past interviews"
        text="Access your past interviews"
      />
      <div className="space-y-8">
        {/* Filter and Sort Controls */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs Skeleton */}
          <Skeleton className="h-12 w-full sm:w-[400px]" />

          {/* Sort Dropdown Skeleton */}
          <Skeleton className="h-12 w-full sm:w-[180px]" />
        </div>

        {/* Interview Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-[300px] w-full rounded-lg border border-muted/30"
            />
          ))}
        </div>
      </div>
    </>
  );
}
