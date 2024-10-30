"use client";

import { useState } from "react";
import Link from "next/link";
import { Interview } from "@prisma/client";
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

interface InterviewCardsProps {
  interviews: Interview[];
}

export function InterviewCards({ interviews }: InterviewCardsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getScoreColor = (score: number | null) => {
    if (!score) return "bg-gray-500";
    if (score < 50) return "bg-red-500";
    if (score < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getScoreLabel = (score: number | null) => {
    if (!score) return "Not Available";
    if (score < 50) return "Needs Improvement";
    if (score < 75) return "Good level";
    return "Excellent work";
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {interviews.map((interview) => (
        <Card
          key={interview.id}
          className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setHoveredId(interview.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="background-gradient-reverse absolute inset-0 h-[6.4em] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="relative z-10 flex flex-row items-center justify-between">
            <div className="flex flex-col space-y-1">
              <Badge variant="secondary" className="w-fit">
                {getScoreLabel(interview.interviewScore)}
              </Badge>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-xl text-white">
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
            className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-300 ease-in-out"
            style={{
              width: hoveredId === interview.id ? "100%" : "0%",
            }}
          />
        </Card>
      ))}
    </div>
  );
}
