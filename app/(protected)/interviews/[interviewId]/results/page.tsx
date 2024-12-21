import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Interview } from "@/types";

import { prisma } from "@/lib/db";
import InterviewResults from "@/components/interviews/result/interview-results";

import InterviewLoading from "./loading";

async function getInterviewData(interviewId: string) {
  try {
    const interview: Interview | null = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        interviewData: {
          include: {
            learningResources: true,
          },
        },
      },
    });

    if (!interview) {
      return null;
    }

    return interview;
  } catch (error) {
    console.error("Error fetching interview data:", error);
    return null;
  }
}

async function InterviewContent({ interviewId }: { interviewId: string }) {
  const interview = await getInterviewData(interviewId);

  if (!interview) {
    notFound();
  }

  return <InterviewResults interview={interview} />;
}

export default async function InterviewDisplayPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;

  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewContent interviewId={interviewId} />
    </Suspense>
  );
}
