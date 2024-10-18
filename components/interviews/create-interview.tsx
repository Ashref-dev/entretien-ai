"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { MovingBorderButton } from "../ui/moving-border";
import { CreateInterviewModal } from "./create-interview-modal";

const CreateInterview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateInterview = (data: {
    jobTitle: string;
    jobDescription: string;
    resume: File | null;
  }) => {
    // Handle the interview creation logic here
    console.log("Creating interview with data:", data);
    // You would typically send this data to your API
  };

  return (
    <div>
      <div className="mb-12 mt-8">
        <Card className="mx-auto w-full max-w-3xl overflow-hidden">
          <CardContent className="flex flex-col items-center p-6">
            <h2 className="mb-4 text-center text-3xl font-bold">
              Create a New Interview
            </h2>
            <MovingBorderButton
              borderRadius="1rem"
              className="w-full border-neutral-200 bg-white text-black dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Create
              <Plus className="ml-2 size-5" />
            </MovingBorderButton>
          </CardContent>
        </Card>
      </div>
      <CreateInterviewModal
        onCreateInterview={handleCreateInterview}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default CreateInterview;
