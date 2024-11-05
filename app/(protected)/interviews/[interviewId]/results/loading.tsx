import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewLoading() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="background-gradient-reverse">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[120px] rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Overall Score */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-[180px]" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>

          <Separator />

          {/* Detailed Scores */}
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="relative overflow-hidden">
                <CardContent className="min-h-[100px] p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Overall Feedback */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-[160px]" />
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Skills Assessed */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-[140px]" />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>

          <Skeleton className="h-11 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
