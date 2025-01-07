import { Suspense } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import InterviewProcess from "@/components/interviews/process/interview-process";

import InterviewError from "./error";
import InterviewLoading from "./loading";

async function getInterviewData(interviewId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return null;
    }

    const interview = await prisma.interview.findUnique({
      where: {
        id: interviewId,
        userId: user.id, // Ensure interview belongs to current user
      },
      include: {
        interviewData: true,
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
    return <InterviewError />;
  }

  // Check if all questions have answers
  const allQuestionsAnswered = interview.interviewData.every(
    (item) => item.userAnswer && item.userAnswer.trim().length > 0,
  );

  // If all questions are answered, redirect to results page
  if (allQuestionsAnswered) {
    redirect(`/interviews/${interviewId}/results`);
  }

  return <InterviewProcess interview={interview} />;
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
