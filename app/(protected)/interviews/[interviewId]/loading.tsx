import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterviewLoading() {
  return (
    <div className="container relative mx-auto space-y-8 p-6">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-[80px]" />
      </div>

      {/* Header */}
      <div className="space-y-3 text-center">
        <Skeleton className="mx-auto h-10 w-[200px]" />
        <Skeleton className="mx-auto h-6 w-[400px]" />
      </div>

      {/* Controls */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-[100px] rounded-md" />
      </div>

      {/* Main content grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Camera Preview Card */}
        <Card className="overflow-hidden border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="size-2.5 rounded-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-xl bg-black/90">
              <Skeleton className="size-full" />
            </div>
          </CardContent>
        </Card>

        {/* Microphone Test Card */}
        <Card className="border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="size-2.5 rounded-full" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="min-h-[150px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Card */}
      <Card className="border-2 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-8">
          <div className="flex flex-col items-center space-y-6 text-center">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-16 w-[400px]" />
            <Skeleton className="h-10 w-[200px] rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
