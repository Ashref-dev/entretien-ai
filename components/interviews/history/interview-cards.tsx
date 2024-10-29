import { Interview } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon } from "lucide-react";

interface InterviewCardsProps {
  interviews: Interview[];
}

export function InterviewCards({ interviews }: InterviewCardsProps) {
  const getScoreColor = (score: number) => {
    if (score < 50) return "text-red-500";
    if (score < 75) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {interviews.map((interview) => (
        <Card 
          key={interview.id} 
          className="animate-fade-in-up overflow-hidden opacity-0 transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <CardTitle className="text-xl">{interview.jobTitle}</CardTitle>
            <p className="text-sm text-gray-200">{interview.jobTitle.toLowerCase().replace(/\s+/g, '-')}-company mock</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${getScoreColor(interview.interviewScore)}`}>
                {Math.round(interview.interviewScore)}%
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <FileIcon className="mr-1 size-4" />
                {interview.resume?.toLowerCase().replace(/\s+/g, '_')}.pdf
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Completed on {new Date(interview.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
