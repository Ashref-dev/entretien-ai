"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function InterviewError() {
  const router = useRouter();

  useEffect(() => {
    toast.error("You don't have access to this interview");
    router.push("/interviews");
  }, [router]);

  return null;
}
