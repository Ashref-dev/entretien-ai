import { Suspense } from "react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import InterviewLoading from "./loading";
import InterviewResults from "@/components/interviews/result/interview-results";


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

export default async function InterviewDisplayPage({
  params,
}: {
  params: { interviewId: string };
}) {
  const { interviewId } = await params;

  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewContent interviewId={interviewId} />
    </Suspense>
  );
}

async function InterviewContent({ interviewId }: { interviewId: string }) {
  const interview = await getInterviewData(interviewId);

  if (!interview) {
    notFound();
  }

  return <InterviewResults interview={interview} />;
}
