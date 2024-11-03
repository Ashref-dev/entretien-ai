import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { InterviewContainer } from "@/components/interviews/interview-container";
import { InterviewProvider } from "@/components/interviews/interview-context";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardHeader
        heading="Interviews"
        text={`Create your personalized interview preparation.`}
      />
      <InterviewProvider>
        <InterviewContainer />
      </InterviewProvider>
    </>
  );
};

export default Page;
