"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteInterview } from "@/lib/actions/interview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface DeleteInterviewModalProps {
  interviewId: string;
  interviewTitle: string;
  onDelete: (interviewId: string) => void;
}

export function DeleteInterviewModalTrigger({
  interviewId,
  interviewTitle,
  onDelete,
}: DeleteInterviewModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // Optimistically update UI
      onDelete(interviewId);

      // Then perform the actual deletion
      const result = await deleteInterview(interviewId);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        // If there's an error, we should ideally revert the optimistic update
        // But since we're refreshing the page anyway, we'll let the refresh handle it
        router.refresh();
        return;
      }

      toast({
        title: "Success",
        description: "Interview deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete interview",
        variant: "destructive",
      });
      // Refresh to revert the optimistic update
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="z-10 size-10 rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-destructive group-hover:opacity-100 dark:hover:bg-gray-700/50">
          <Trash2 className="mx-auto size-4 text-inherit" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Interview</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the interview for {interviewTitle}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
