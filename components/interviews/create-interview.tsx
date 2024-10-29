"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

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
    setInterviewData(data);
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
        <div className="mb-8 size-16">
          <AnimatedIcon icon="speech" />
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
            className="w-full border-neutral-200 bg-white text-black dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Create
            <Plus className="ml-2 size-5" />
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
