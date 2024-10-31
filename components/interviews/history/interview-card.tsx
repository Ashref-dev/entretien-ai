"use client";;
import Link from "next/link";
import { Interview } from "@prisma/client";
import { motion } from "framer-motion";
import { ArrowRightCircle, Calendar, FileIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      className="h-full"
    >
      <Card
        className="group relative h-full overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg dark:bg-gray-800/90"
        onMouseEnter={() => setHoveredId(interview.id)}
        onMouseLeave={() => setHoveredId(null)}
        role="article"
        aria-labelledby={`interview-title-${interview.id}`}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-gray-900/80" 
        />

        <CardHeader className="relative z-10 flex flex-row items-start justify-between p-6">
          <div className="flex flex-col space-y-2">
            <Badge 
              variant="secondary" 
              className="w-fit text-sm font-medium"
            >
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
                Mid-level
              </Badge>
            </div>
          </div>

          <div
            className={`flex size-16 items-center justify-center rounded-full ${getScoreColor(
              interview.interviewScore
            )} text-white transition-all duration-300 group-hover:scale-110`}
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">
                {interview.interviewScore
                  ? Math.round(interview.interviewScore)
                  : "N/A"}
              </span>
              <span className="text-xs">Score</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-6 p-6 pt-0">
          <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground dark:text-gray-400">
            <div className="flex items-center space-x-3">
              <FileIcon className="size-5" />
              <span className="truncate">
                {interview.resume?.toLowerCase().replace(/\s+/g, "_")}.pdf
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="size-5" />
              <span>
                {new Date(interview.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <Link
            href={`/interviews/${interview.id}`}
            className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted dark:hover:bg-gray-700/50"
          >
            <span className="text-sm font-medium">View Details</span>
            <ArrowRightCircle className="size-5" />
          </Link>
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
