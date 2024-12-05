import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import InterviewProcess from "@/components/interviews/process/interview-process";

import InterviewLoading from "./loading";

async function getInterviewData(interviewId: string) {
  try {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
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
    notFound();
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
