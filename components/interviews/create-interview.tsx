"use client";

import { useState } from "react";
import { Interview, InterviewDifficulty } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { CreateInterviewModal } from "../modals/create-interview-modal";
import { AnimatedIcon } from "../shared/animated-icon";
import { MovingBorderButton } from "../ui/moving-border";
import { useInterview } from "./interview-context";

const CreateInterview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCurrentStep, setInterviewData } = useInterview();

  const handleCreateInterview = (data: {
    jobTitle: string;
    jobDescription: string;
    resume: File | null;
    difficulty: InterviewDifficulty;
    yearsOfExperience: number;
    skillsAssessed: string[];
    targetCompany?: string;
    interviewData: any;
  }) => {
    const interview: Interview = {
      id: crypto.randomUUID(),
      userId: "", // You'll need to get this from your auth context
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      resume: data.resume,
      difficulty: data.difficulty,
      yearsOfExperience: data.yearsOfExperience,
      targetCompany: data.targetCompany,
      createdAt: new Date(),
      updatedAt: new Date(),
      interviewData: data.interviewData || [],
      skillsAssessed: data.skillsAssessed || [],
    };
    setInterviewData(interview);
    setCurrentStep("processing");
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-[40vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-8">
          <AnimatedIcon icon="penEdit" className="size-32" />
        </div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4 text-3xl font-bold"
        >
          Ace your next interview.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 text-xl text-muted-foreground"
        >
          Create an interview to get started
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <MovingBorderButton
            borderRadius="1rem"
            className="border-neutral-200 bg-white font-medium text-black dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Create
            <ChevronRight className="size-5" />
          </MovingBorderButton>
        </motion.div>
      </motion.div>

      <CreateInterviewModal
        onCreateInterview={handleCreateInterview}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default CreateInterview;
