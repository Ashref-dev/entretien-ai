import { Suspense } from "react";
import { Interview } from "@/types";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import InterviewResults from "@/components/interviews/result/interview-results";

import InterviewError from "../error";
import InterviewLoading from "./loading";

async function getInterviewData(interviewId: string) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return null;
    }

    const interview: Interview | null = await prisma.interview.findUnique({
      where: {
        id: interviewId,
        userId: user.id,
      },
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
    return <InterviewError />;
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
