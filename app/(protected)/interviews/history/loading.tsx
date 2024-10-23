import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { CardSkeleton } from "@/components/shared/card-skeleton";

export default function DashboardInterviewsLoading() {
  return (
    <>
      <DashboardHeader
        heading="Past interviews"
        text="Access your past interviews"
      />
      <div className="grid gap-8">
        <CardSkeleton  />
        <CardSkeleton  />
      </div>
    </>
  );
}