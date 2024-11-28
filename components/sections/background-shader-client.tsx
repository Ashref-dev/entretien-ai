"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";

const BackgroundShader = dynamic(
  () => import("./background-shader").then((mod) => mod.BackgroundShader),
  {
    ssr: false,
    // loading: () => (
    //   <div className="size-40 animate-pulse rounded-xl bg-muted" />
    // ),
  },
);

const BackgroundShaderClient = ({ className }: { className: string }) => {
  return <BackgroundShader className={clsx(className)} />;
};

export default BackgroundShaderClient;
