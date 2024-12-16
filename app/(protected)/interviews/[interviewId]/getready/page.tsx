import InterviewGetReady from "@/components/interviews/process/interview-get-ready";

export default async function GetReadyPage({ params }) {
  const pathParams = await params;
  return <InterviewGetReady interviewId={pathParams.interviewId} />;
}
