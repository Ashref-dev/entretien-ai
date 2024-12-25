"use client";

import Link from "next/link";
import { Interview } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowRightCircle,
  Award,
  Briefcase,
  Calendar,
  FileIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteInterviewModalTrigger } from "@/components/modals/delete-interview-modal-trigger";

interface InterviewCardProps {
  interview: Interview;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  getScoreColor: (score: number | null) => string;
  getScoreLabel: (score: number | null) => string;
  onDelete: (interviewId: string) => void;
}

export function InterviewCard({
  interview,
  hoveredId,
  setHoveredId,
  getScoreColor,
  getScoreLabel,
  onDelete,
}: InterviewCardProps) {
  const allQuestionsAnswered = interview.interviewData.every(
    (item) => item.userAnswer && item.userAnswer.trim().length > 0,
  );

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card
        className="group relative overflow-hidden"
        onMouseEnter={() => setHoveredId(interview.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-gray-900/80" />

        <CardHeader className="relative flex flex-row items-start justify-between p-6">
          <div className="flex flex-col space-y-2">
            <Badge variant="secondary" className="w-fit text-sm font-medium">
              {getScoreLabel(interview.interviewScore)}
            </Badge>
            <div className="flex flex-col space-y-1">
              <CardTitle
                id={`interview-title-${interview.id}`}
                className="text-xl font-semibold text-foreground dark:text-white"
              >
                {interview.jobTitle}
              </CardTitle>
              <Badge variant="outline" className="w-fit dark:text-gray-300">
                {interview.difficulty || "Not Specified"}
              </Badge>
            </div>
          </div>

          <div
            className={`flex size-16 items-center justify-center rounded-full ${getScoreColor(
              interview.interviewScore,
            )} text-white transition-all duration-300 group-hover:scale-110`}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Award className="size-4" />
                <span className="text-lg font-bold">
                  {Math.round(interview.interviewScore ?? 0)}
                </span>
              </div>
              <span className="text-xs">Score</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6 p-6 pt-0">
          <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <FileIcon className="size-5" />
              <span className="truncate">
                {typeof interview.resume === "string"
                  ? interview.resume.toLowerCase().replace(/\s+/g, "_")
                  : "No resume uploaded"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase className="size-5" />
              <span>Target: {interview.targetCompany || "Not Specified"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="size-5" />
              <span>
                {new Date(interview.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex h-14 max-h-14 flex-wrap gap-2 overflow-y-hidden">
              {interview.skillsAssessed.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-muted/50 hover:bg-muted dark:bg-gray-700/50 dark:hover:bg-gray-700"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <DeleteInterviewModalTrigger
                interviewId={interview.id}
                interviewTitle={interview.jobTitle}
                onDelete={onDelete}
              />
              <Link
                href={
                  allQuestionsAnswered
                    ? `/interviews/${interview.id}/results`
                    : `/interviews/${interview.id}/getready`
                }
                className="group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted dark:hover:bg-gray-700/50"
              >
                <span className="text-nowrap text-foreground dark:text-white">
                  {allQuestionsAnswered ? "View results" : "Continue"}
                </span>
                <ArrowRightCircle className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </CardContent>

        <div
          className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-in-out dark:bg-white"
          style={{
            width: hoveredId === interview.id ? "100%" : "0%",
          }}
        />
      </Card>
    </motion.div>
  );
}
