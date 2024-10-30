import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { InterviewCards } from "@/components/interviews/history/interview-cards";

// Sample interview data
const sampleInterviews = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    interviewScore: 85,
    resume: "john_doe_resume",
    createdAt: new Date(),
    duration: 45,
    questionsAnswered: 12,
    difficulty: "Advanced",
    skillsAssessed: ["React", "System Design", "JavaScript", "Performance"],
    performanceMetrics: {
      technicalScore: 88,
      communicationScore: 92,
      problemSolvingScore: 85,
    },
    feedbackSummary:
      "Excellent technical knowledge and communication skills...",
  },
  {
    id: "2",
    jobTitle: "Senior Frontend Developer",
    interviewScore: 85,
    resume: "john_doe_resume",
    createdAt: new Date(),
    duration: 45,
    questionsAnswered: 12,
    difficulty: "Advanced",
    skillsAssessed: ["React", "System Design", "JavaScript", "Performance"],
    performanceMetrics: {
      technicalScore: 88,
      communicationScore: 92,
      problemSolvingScore: 85,
    },
    feedbackSummary:
      "Excellent technical knowledge and communication skills...",
  },
];

const Page = async () => {
  const user = await getCurrentUser();

  let interviews;
  try {
    interviews = await prisma.interview.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: "desc",
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
