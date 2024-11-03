"use client";

import { useState } from "react";
import { Interview } from "@/types";
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
  }) => {
    const interview: Interview = {
      id: crypto.randomUUID(),
      userId: "", // You'll need to get this from your auth context
      jobTitle: data.jobTitle,
      jobDescription: data.jobDescription,
      resume: null,
      difficulty: "MID_LEVEL", // Set default or get from form
      yearsOfExperience: 0, // Set default or get from form
      createdAt: new Date(),
      updatedAt: new Date(),
      interviewData: [],
      skillsAssessed: [],
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
          <AnimatedIcon icon="consultation" className="size-32" />
        </div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4 text-3xl font-bold"
        >
          No Mock Interviews Yet
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 text-xl text-muted-foreground"
        >
          Create your first mock interview to get started!
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
