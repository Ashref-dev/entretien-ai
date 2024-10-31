"use client";

import Link from "next/link";
import { Interview } from "@prisma/client";
import { motion } from "framer-motion";
import {
    ArrowRightCircle,
    Award,
    Briefcase,
    Calendar,
    FileIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface InterviewCardProps {
  interview: Interview;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  getScoreColor: (score: number | null) => string;
  getScoreLabel: (score: number | null) => string;
}

export function InterviewCard({
  interview,
  hoveredId,
  setHoveredId,
  getScoreColor,
  getScoreLabel,
}: InterviewCardProps) {
  return (
    <motion.div
      key={interview.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
        onMouseEnter={() => setHoveredId(interview.id)}
        onMouseLeave={() => setHoveredId(null)}
        role="article"
        aria-labelledby={`interview-title-${interview.id}`}
      >
        <div className="background-gradient-reverse absolute inset-0 h-[6.4em] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between">
          <div className="flex flex-col space-y-1">
            <Badge variant="secondary" className="w-fit">
              {getScoreLabel(interview.interviewScore)}
            </Badge>
            <div className="flex items-center space-x-2">
              <CardTitle
                id={`interview-title-${interview.id}`}
                className="text-xl text-foreground dark:text-white"
              >
                {interview.jobTitle}
              </CardTitle>
              <Badge variant="outline" className="dark:text-white">
                Mid-level
              </Badge>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`/interviews/${interview.id}`}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                  >
                    <ArrowRightCircle className="size-5" />
                    <span className="sr-only">View Interview Details</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Interview Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="relative z-10 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`flex size-12 items-center justify-center rounded-full ${getScoreColor(
                  interview.interviewScore,
                )} text-white transition-all duration-300 group-hover:scale-110`}
              >
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                  Score
                </p>
                <p className="text-2xl font-bold text-foreground dark:text-white">
                  {interview.interviewScore
                    ? Math.round(interview.interviewScore)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <FileIcon className="size-4" />
              <span>
                {interview.resume?.toLowerCase().replace(/\s+/g, "_")}.pdf
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="size-4" />
              <span>
                Completed on{" "}
                {new Date(interview.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="size-4" />
              <span>{interview.jobTitle}</span>
            </div>
          </div>
        </CardContent>
        <div
          className="absolute bottom-0 left-0 h-1 bg-foreground transition-all duration-300 ease-in-out dark:bg-white"
          style={{
            width: hoveredId === interview.id ? "100%" : "0%",
          }}
        />
      </Card>
    </motion.div>
  );
}
