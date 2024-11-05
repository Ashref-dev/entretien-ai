import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewLoading() {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <Skeleton className="mx-auto mb-6 h-9 w-[250px]" /> {/* Title */}
      {/* Header with controls */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-[200px]" /> {/* Question counter */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="size-9" /> /* Control buttons */
          ))}
        </div>
      </div>
      {/* Question Card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent className="p-6">
            <Skeleton className="h-[60px] w-full" />
          </CardContent>
        </Card>

        {/* Webcam Card */}
        <Card className="col-span-1">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-6 w-[100px]" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <Skeleton className="size-full" />
            </div>
          </CardContent>
        </Card>

        {/* Answer Card */}
        <Card className="col-span-1">
          <CardHeader className="bg-muted/50">
            <Skeleton className="h-6 w-[120px]" />
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
      {/* Navigation Controls */}
      <div className="mt-6 flex justify-between space-x-4">
        <Skeleton className="h-10 w-[100px]" /> {/* Previous button */}
        <div className="flex items-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="size-8"
            /> /* Question number buttons */
          ))}
        </div>
        <Skeleton className="h-10 w-[100px]" /> {/* Next button */}
      </div>
    </div>
  );
}
