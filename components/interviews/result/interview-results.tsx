"use client";

import { useState } from "react";
import { Interview } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Book,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  ExternalLink,
  FileText,
  MessageCircle,
  MessageSquare,
  PlayCircle,
  ThumbsUpIcon,
  TriangleAlert,
  Trophy,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface ScoreCardProps {
  icon: React.ReactNode;
  title: string;
  score: number;
  color: string;
}

interface InterviewResultsProps {
  interview: Interview;
}

function ScoreCard({ icon, title, score, color }: ScoreCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="min-h-[100px] p-6">
        <div className="flex items-center gap-4">
          <div className={`bg- rounded-full${color}/10 p-3`}>
            <div className={`${color}`}>{icon}</div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{score.toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

function getScoreIcon(score: number) {
  if (score >= 90) return <Trophy className="ml-2 size-5 text-green-500" />;
  if (score > 60) return <ThumbsUpIcon className="ml-2 size-5 text-cyan-500" />;
  if (score > 30)
    return <TriangleAlert className="ml-2 size-5 text-yellow-500" />;
  return <X className="ml-2 size-5 text-red-500" />;
}

function ResourceTypeIcon({
  type,
}: {
  type: NonNullable<
    Interview["interviewData"][number]["learningResources"]
  >[number]["type"];
}) {
  switch (type.toLowerCase()) {
    case "documentation":
      return <FileText className="size-4 text-blue-500" />;
    case "article":
      return <Book className="size-4 text-purple-500" />;
    case "tutorial":
      return <Code className="size-4 text-green-500" />;
    case "video":
      return <PlayCircle className="size-4 text-red-500" />;
    default:
      return <ExternalLink className="size-4" />;
  }
}

function LearningResources({
  resources,
}: {
  resources: Interview["interviewData"][number]["learningResources"];
}) {
  if (!resources?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {resources.map((resource, index) => (
        <HoverCard key={index}>
          <HoverCardTrigger asChild>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex rounded-md bg-muted transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex max-w-[300px] items-center gap-3 rounded-md border border-transparent bg-background/50 px-3 py-2 transition-all hover:border-border hover:bg-background">
                {/* Favicon */}
                <img
                  src={`https://www.google.com/s2/favicons?domain=${new URL(resource.url).hostname}&sz=32`}
                  alt=""
                  className="size-4 shrink-0 rounded-sm"
                  loading="lazy"
                />

                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <h4 className="min-w-0 flex-1 truncate text-xs font-medium group-hover:text-primary">
                    {resource.title}
                  </h4>
                  <Badge
                    variant="secondary"
                    className="shrink-0 px-1.5 py-0 text-[10px]"
                  >
                    {resource.type}
                  </Badge>
                </div>
              </div>
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${new URL(resource.url).hostname}&sz=32`}
                  alt=""
                  className="size-4 rounded-sm"
                />
                <h4 className="text-sm font-medium">{resource.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {resource.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{resource.type}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new URL(resource.url).hostname}
                </span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}

export default function InterviewResults({ interview }: InterviewResultsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);

  const handleShowQuestions = () => setShowQuestions(true);
  const handleBack = () => setShowQuestions(false);
  const handleNext = () => {
    if (currentQuestionIndex < interview.interviewData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const handleFinish = () => {
    // router.push("/interviews");
    handleBack();
  };

  if (!showQuestions) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card className="overflow-hidden">
            <CardHeader className="background-gradient-reverse text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Interview Summary</CardTitle>
                <div className="flex items-center gap-2 rounded-full bg-black/10 px-4 py-1.5">
                  <Clock className="size-4" />
                  <span className="text-sm font-medium">
                    {interview.duration
                      ? formatDuration(interview.duration)
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Overall Score */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Overall Performance</h3>
                <div className="flex items-center gap-4">
                  <Progress
                    value={interview.interviewScore || 0}
                    className="w-full"
                  />
                  <span className="min-w-16 text-2xl font-bold">
                    {interview.interviewScore?.toFixed(1)}%
                  </span>
                </div>
              </div>

              <Separator />

              {/* Detailed Scores */}
              <div className="grid gap-4 md:grid-cols-3">
                <ScoreCard
                  icon={<Code className="size-5" />}
                  title="Technical"
                  score={interview.technicalScore || 0}
                  color="text-blue-500"
                />
                <ScoreCard
                  icon={<MessageCircle className="size-5" />}
                  title="Communication"
                  score={interview.communicationScore || 0}
                  color="text-green-500"
                />
                <ScoreCard
                  icon={<Brain className="size-5" />}
                  title="Problem Solving"
                  score={interview.problemSolvingScore || 0}
                  color="text-purple-500"
                />
              </div>

              <Separator />

              {/* Overall Feedback */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Overall Feedback</h3>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p
                      dir={interview.language === "AR" ? "rtl" : "ltr"}
                      className="text-muted-foreground"
                    >
                      {interview.overAllFeedback}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Skills Assessed */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Skills Assessed</h3>
                <div className="flex flex-wrap gap-2">
                  {interview.skillsAssessed?.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleShowQuestions}
                className="min-h-[44px] w-full"
              >
                View Detailed Questions & Answers
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Questions View
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="min-h-[44px]">
          <ArrowLeft className="mr-2 size-4" />
          Back to Summary
        </Button>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of{" "}
          {interview.interviewData.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl">
                  Question {currentQuestionIndex + 1}
                </span>
                <Badge variant="secondary" className="min-h-[28px]">
                  Score:{" "}
                  {interview.interviewData[currentQuestionIndex]
                    .questionsScore || 0}
                  %
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent
              dir={interview.language === "AR" ? "rtl" : "ltr"}
              className="text-lg"
            >
              {interview.interviewData[currentQuestionIndex].aiQuestion}
            </CardContent>
          </Card>

          {/* Answers Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  Your Answer
                  {getScoreIcon(
                    interview.interviewData[currentQuestionIndex]
                      .questionsScore || 0,
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent
                dir={interview.language === "AR" ? "rtl" : "ltr"}
                className="min-h-[100px] text-muted-foreground"
              >
                {interview.interviewData[currentQuestionIndex].userAnswer ||
                  "No answer provided"}
              </CardContent>
            </Card>

            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  Ideal Answer
                  <Check className="ml-2 size-5 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent
                dir={interview.language === "AR" ? "rtl" : "ltr"}
                className="min-h-[100px] text-muted-foreground"
              >
                {interview.interviewData[currentQuestionIndex].aiAnswer}
              </CardContent>
            </Card>
          </div>

          {/* Feedback Card */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                Question Feedback
                <MessageSquare className="ml-2 size-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent
              dir={interview.language === "AR" ? "rtl" : "ltr"}
              className="text-muted-foreground"
            >
              {interview.interviewData[currentQuestionIndex].questionFeedback ||
                "No feedback provided"}
            </CardContent>
          </Card>

          {/* Learning Resources */}
          <LearningResources
            resources={
              interview.interviewData[currentQuestionIndex].learningResources
            }
          />

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="min-h-[44px]"
              >
                <ChevronLeft className="mr-2 size-4" />
                Previous
              </Button>
              {currentQuestionIndex === interview.interviewData.length - 1 ? (
                <Button onClick={handleFinish} className="min-h-[44px]">
                  Finish
                  <Check className="ml-2 size-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="outline"
                  className="min-h-[44px]"
                >
                  Next
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              )}
            </div>

            {/* Question Dots Navigation */}
            <div className="hidden items-center gap-2 md:flex">
              {interview.interviewData.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    currentQuestionIndex === index ? "default" : "outline"
                  }
                  className="min-h-[44px] min-w-[44px] rounded-full p-0"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
