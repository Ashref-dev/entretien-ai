import { cn } from "@/lib/utils";
import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
  return (
    <div className="container relative mx-auto py-24">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ideal Answers Tailored For Your Resume
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          See optimal answers for every situation
        </p>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={cn(
            "absolute left-1/2 top-1/2 size-[300px]",
            "-translate-x-1/2 -translate-y-1/2 rounded-full",
            "bg-gradient-to-r from-purple-500/30 to-cyan-500/30",
            "animate-blob blur-[100px]",
          )}
        />
        <div
          className={cn(
            "absolute right-1/3 top-1/3 size-[250px]",
            "rounded-full bg-gradient-to-l from-pink-500/20 to-indigo-500/20",
            "animate-blob animation-delay-2000 blur-[100px]",
          )}
        />
        <div
          className={cn(
            "absolute bottom-1/3 left-1/3 size-[250px]",
            "rounded-full bg-gradient-to-t from-blue-500/20 to-emerald-500/20",
            "animate-blob animation-delay-4000 blur-[100px]",
          )}
        />
      </div>

      <div className="flex h-[32vh] items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
        <div
          style={{
            transform: "rotateX(15deg) translateZ(80px)",
          }}
          className="mx-auto h-1/2 w-3/4 max-w-xl rounded-3xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900 md:h-[85%] md:p-4"
        >
          <Compare
            firstImage="/_static/landing/shot6.png"
            secondImage="/_static/landing/shot7.png"
            firstImageClassName="object-contain w-full h-full rounded-lg"
            secondImageClassname="object-contain w-full h-full rounded-lg"
            className="size-full rounded-[22px] md:rounded-lg"
            slideMode="hover"
            autoplay={true}
          />
        </div>
      </div>
    </div>
  );
}
