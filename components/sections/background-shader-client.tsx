"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";

const BackgroundShader = dynamic(
  () => import("./background-shader").then((mod) => mod.BackgroundShader),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-[-1]">
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
      </div>
    ),
  },
);

const BackgroundShaderClient = ({ className }: { className: string }) => {
  return <BackgroundShader className={clsx(className)} />;
};

export default BackgroundShaderClient;
