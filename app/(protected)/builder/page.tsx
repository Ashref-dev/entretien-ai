import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardHeader
        heading="Resume builder"
        text={`Create your optimized resume with the help of AI.`}
      />
      <div>Resume builder here</div>
    </>
  );
};

export default Page;
