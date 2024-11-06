import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewLoading() {
  return (
    <div className="container mx-auto space-y-4 p-2 sm:space-y-6 sm:p-4">
      <Skeleton className="mx-auto mb-4 h-8 w-[200px] sm:mb-6 sm:h-9 sm:w-[250px]" />{" "}
      {/* Title */}
      {/* Header with controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-5 w-[180px] sm:w-[200px]" />{" "}
        {/* Question counter */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="size-8 sm:size-9"
            /> /* Control buttons */
          ))}
        </div>
      </div>
      {/* Question Card */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-5 w-[120px] sm:h-6 sm:w-[150px]" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Skeleton className="h-[50px] w-full sm:h-[60px]" />
          </CardContent>
        </Card>

        {/* Webcam Card */}
        <Card className="col-span-1">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-5 w-[80px] sm:h-6 sm:w-[100px]" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <Skeleton className="size-full" />
            </div>
          </CardContent>
        </Card>

        {/* Answer Card */}
        <Card className="col-span-1">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-5 w-[100px] sm:h-6 sm:w-[120px]" />
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
            <Skeleton className="h-[120px] w-full sm:h-[150px]" />
            <Skeleton className="h-9 w-full sm:h-10" />
          </CardContent>
        </Card>
      </div>
      {/* Navigation Controls */}
      <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:justify-between sm:space-x-4">
        <Skeleton className="h-9 w-full sm:h-10 sm:w-[100px]" />{" "}
        {/* Previous button */}
        <div className="flex items-center justify-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="size-7 sm:size-8"
            /> /* Question number buttons */
          ))}
        </div>
        <Skeleton className="h-9 w-full sm:h-10 sm:w-[100px]" />{" "}
        {/* Next button */}
      </div>
    </div>
  );
}
