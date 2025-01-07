import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import InterviewGetReady from "@/components/interviews/process/interview-get-ready";

import InterviewError from "../error";

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

export default async function GetReadyPage({ params }) {
  const pathParams = await params;
  const interview = await getInterviewData(pathParams.interviewId);

  if (!interview) {
    return <InterviewError />;
  }

  return <InterviewGetReady interviewId={pathParams.interviewId} />;
}
