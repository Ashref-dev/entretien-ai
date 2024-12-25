"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Interview } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { InterviewCard } from "./interview-card";

interface InterviewCardsProps {
  interviews: Interview[];
  isLoading?: boolean;
}

const ANIMATION_DURATION = 0.25;

export function InterviewCards({ interviews: initialInterviews, isLoading }: InterviewCardsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);

  const handleDeleteInterview = useCallback((interviewId: string) => {
    setInterviews((prev) => prev.filter((interview) => interview.id !== interviewId));
  }, []);

  const getScoreColor = useCallback((score: number | null) => {
    if (!score) return "bg-gray-500";
    if (score < 50) return "bg-red-500";
    if (score < 75) return "bg-yellow-500";
    return "bg-green-500";
  }, []);

  const getScoreLabel = (score: number | null) => {
    if (!score) return "Incomplete";
    if (score < 50) return "Needs Improvement";
    if (score < 75) return "Good level";
    return "Excellent work";
  };

  const filteredInterviews = useMemo(() => {
    let result = [...interviews];

    // Filter logic
    if (filter !== "all") {
      result = result.filter((interview) => {
        const score = interview.interviewScore || 0;
        if (filter === "high") return score >= 50;
        return score < 50;
      });
    }

    // Sort logic
    result.sort((a, b) => {
      if (sortBy === "score") {
        return (b.interviewScore || 0) - (a.interviewScore || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [interviews, filter, sortBy]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[300px] w-full" />
        ))}
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg font-medium">No interviews found</p>
        <p className="text-sm text-gray-500">
          Complete your first interview to see it here
        </p>
        <Button className="mt-4">
          <Link href="/interviews">Start New Interview</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          defaultValue="all"
          className="w-full sm:w-auto"
          onValueChange={(value) => setFilter(value)}
        >
          <TabsList className="grid h-fit w-full grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="all" className="min-h-[44px]">
              All Interviews
            </TabsTrigger>
            <TabsTrigger value="high" className="min-h-[44px]">
              High Score
            </TabsTrigger>
            <TabsTrigger value="needs-work" className="min-h-[44px]">
              Needs Work
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select defaultValue="date" onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="min-h-[44px] w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Latest First</SelectItem>
            <SelectItem value="score">Highest Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filteredInterviews.map((interview) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{
                opacity: { duration: ANIMATION_DURATION },
                scale: { duration: ANIMATION_DURATION },
                y: { duration: ANIMATION_DURATION },
                layout: { duration: ANIMATION_DURATION },
              }}
              layout
            >
              <InterviewCard
                interview={interview}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                getScoreColor={getScoreColor}
                getScoreLabel={getScoreLabel}
                onDelete={handleDeleteInterview}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
