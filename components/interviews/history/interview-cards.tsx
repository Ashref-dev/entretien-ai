"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Interview } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InterviewCardsProps {
  interviews: Interview[];
  isLoading?: boolean;
}

export function InterviewCards({ interviews, isLoading }: InterviewCardsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  const getScoreColor = useCallback((score: number | null) => {
    if (!score) return "bg-gray-500";
    if (score < 50) return "bg-red-500";
    if (score < 75) return "bg-yellow-500";
    return "bg-green-500";
  }, []);

  const getScoreLabel = (score: number | null) => {
    if (!score) return "Not Available";
    if (score < 50) return "Needs Improvement";
    if (score < 75) return "Good level";
    return "Excellent work";
  };

  const sortedInterviews = useMemo(() => {
    return [...interviews].sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return (b.interviewScore || 0) - (a.interviewScore || 0);
    });
  }, [interviews, sortBy]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[300px] w-full" />
        ))}
      </div>
    );
  }

  if (!interviews.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg font-medium">No interviews found</p>
        <p className="text-sm text-gray-500">
          Complete your first interview to see it here
        </p>
        <Button className="mt-4">
          <Link href="/interviews/new">Start New Interview</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant={sortBy === "date" ? "default" : "outline"}
          onClick={() => setSortBy("date")}
          size="sm"
        >
          Sort by Date
        </Button>
        <Button
          variant={sortBy === "score" ? "default" : "outline"}
          onClick={() => setSortBy("score")}
          size="sm"
        >
          Sort by Score
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence>
          {sortedInterviews.map((interview) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl"
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
                        className="text-xl text-white"
                      >
                        {interview.jobTitle}
                      </CardTitle>
                      <Badge variant="outline" className="text-white">
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
                            <span className="sr-only">
                              View Interview Details
                            </span>
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
                        <p className="text-sm font-medium text-white">Score</p>
                        <p className="text-2xl font-bold text-white">
                          {interview.interviewScore
                            ? Math.round(interview.interviewScore)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-white">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="size-4" />
                      <span>
                        {interview.resume?.toLowerCase().replace(/\s+/g, "_")}
                        .pdf
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
                  className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-300 ease-in-out"
                  style={{
                    width: hoveredId === interview.id ? "100%" : "0%",
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
