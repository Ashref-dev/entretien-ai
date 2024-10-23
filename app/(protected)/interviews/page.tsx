import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { InterviewContainer } from "@/components/interviews/interview-container";
import { InterviewProvider } from "@/components/interviews/interview-context";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      </>
  );
};

export default Page;
