"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";

const BackgroundShader = dynamic(
  () => import("./background-shader").then((mod) => mod.BackgroundShader),
  {
    ssr: false,
  },
);

const BackgroundShaderClient = ({ className }: { className: string }) => {
  return (
    <>
      {/* Show shader on md and larger screens */}
      <div className="hidden lg:block">
        <BackgroundShader className={clsx(className)} />
      </div>

      {/* Show gradient background on smaller screens */}
      <div className="absolute inset-0 z-[-1] hidden h-[calc(100vh+400px)] animate-fade-in opacity-0 [animation-delay:1000ms] lg:hidden">
        <div
          className="absolute inset-0 brightness-200 dark:brightness-50 dark:contrast-150"
          style={{
            background: `
              radial-gradient(circle at top left, var(--gradient-1), transparent 50%),
              radial-gradient(circle at top right, var(--gradient-2), transparent 50%),
              radial-gradient(circle at bottom left, var(--gradient-2), transparent 50%),
              radial-gradient(circle at bottom right, var(--gradient-1), transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0 backdrop-blur-[100px]"
          style={{
            background: "rgba(0, 0, 0, 0.05)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-64"
          style={{
            background: `linear-gradient(to top, 
              hsl(var(--background)) 0%,
              hsl(var(--background)) 15%,
              hsl(var(--background) / 0.95) 30%,
              hsl(var(--background) / 0.8) 45%,
              hsl(var(--background) / 0.6) 60%,
              hsl(var(--background) / 0.3) 75%,
              hsl(var(--background) / 0.1) 90%,
              transparent 100%
            )`,
          }}
        />
      </div>
    </>
  );
};

export default BackgroundShaderClient;
