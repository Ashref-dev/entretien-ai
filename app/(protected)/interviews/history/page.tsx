import Link from "next/link";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { InterviewCards } from "@/components/interviews/history/interview-cards";

const Page = async () => {
  const user = await getCurrentUser();
  let interviews: any[] = [];
  let error: string | null = null;

  if (!user) {
    error = "You must be signed in to view your interviews";
  } else {
    try {
      interviews = await prisma.interview.findMany({
        where: {
          userId: user.id,
        },
        include: {
          interviewData: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (e) {
      console.error("Error fetching interviews:", e);
      error = "Failed to load interviews. Please try again later.";
    }
  }

  return (
    <>
      <DashboardHeader
        heading="Past interviews"
        text="Access your past interviews"
      />

      {error ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-2xl font-bold">An error has occured</h1>
            <p>If this persists, please contact support.</p>
            <p className="mb-4 text-red-500">{error}</p>
            <Button>
              <Link href="/interviews">Return to Interviews</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <InterviewCards
          interviews={interviews.map((interview) => ({
            ...interview,
            updatedAt: interview.createdAt,
            className: `opacity-0 animate-fade-in-up animation-delay-600`,
          }))}
          isLoading={false}
        />
      )}
    </>
  );
};

export default Page;
