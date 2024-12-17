"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useInterview } from "../interview-context";

export default function ProcessingView() {
  const { interviewData } = useInterview();
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const processInterview = async () => {
      if (!interviewData) {
        setError(true);
        return;
      }

      try {
        // If all validations pass, proceed to results
        toast.success("Interview data validated successfully");
        router.push(`/interviews/${interviewData.id}/getready`);
      } catch (error) {
        toast.error("Error processing interview, please try again.");
        setError(true);
      }
    };

    processInterview();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">
          Processing Error
        </h2>
        <p className="text-center text-muted-foreground">
          There was an error processing your interview.
          <br />
          Please try again.
        </p>
        <Button
          onClick={() => (window.location.href = "/interviews")}
          variant="default"
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center">
      <Loader2 className="mb-4 size-12 animate-spin" />
      <h2 className="text-2xl font-bold">Creating Your Interview...</h2>
      <p className="mt-2 text-muted-foreground">
        Please wait while we process your information
      </p>
    </div>
  );
}
