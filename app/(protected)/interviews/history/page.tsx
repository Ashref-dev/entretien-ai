import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { InterviewCards } from "@/components/interviews/history/interview-cards";
import { prisma } from "@/lib/db";

// Sample interview data
const sampleInterviews = [
  {
    id: "1",
    jobTitle: "Frontend Developer",
    jobDescription: "We are looking for a skilled Frontend Developer...",
    interviewScore: 85.5,
    createdAt: new Date("2023-03-15T10:00:00Z"),
    userId: "user1",
  },
  {
    id: "2",
    jobTitle: "UX Designer",
    jobDescription: "Seeking a creative UX Designer to join our team...",
    interviewScore: 92.0,
    createdAt: new Date("2023-04-02T14:30:00Z"),
    userId: "user1",
  },
];

// const Page = async () => {
//   const user = await getCurrentUser();

//   const interviews = await prisma.interview.findMany({
//     where: {
//       userId: user?.id,
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });
const Page = async () => {
  const user = await getCurrentUser();

  let interviews;
  try {
    interviews = await prisma.interview.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error("Database connection failed, using sample data:", error);
    // Fallback to sample data if database is not accessible
    interviews = sampleInterviews;
  }


  return (
    <>
      <DashboardHeader
        heading="Past interviews"
        text="Access your past interviews"
      />

<InterviewCards
        interviews={interviews.map((interview) => ({
          ...interview,
          updatedAt: interview.createdAt,
          className: `opacity-0 animate-fade-in-up animation-delay-600`,
        }))}
      />
    </>
  );
};

export default Page;
