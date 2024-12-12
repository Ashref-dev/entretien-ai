import InterviewGetReady from "@/components/interviews/process/interview-get-ready";

interface GetReadyPageProps {
  params: {
    interviewId: string;
  };
}

export default async function GetReadyPage({ params }: GetReadyPageProps) {
  const pathParams = await params;
  return <InterviewGetReady interviewId={pathParams.interviewId} />;
}
