"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ProjectType = {
  title: string;
  slug: string;
  color: string;
};

export default function ProjectSwitcher({
  large = false,
}: {
  large?: boolean;
}) {
  const { data: session, status } = useSession();
  const [openPopover, setOpenPopover] = useState(false);

  if (status === "loading") {
    return <ProjectSwitcherPlaceholder />;
  }

  if (!session) {
    return (
      <div className="text-sm text-muted-foreground">
        Please sign in to view projects
      </div>
    );
  }

  const projects: ProjectType[] = [
    {
      title: `${session.user?.name?.split(" ")[0]}'s Project`,
      slug: `${session.user?.name?.toLowerCase().split(" ")[0]}-project`,
      color: "bg-blue-500",
    },
  ];

  const selected: ProjectType = projects[0];

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <div
            className={cn(
              buttonVariants({ variant: "default" }),
              "inline-flex select-none items-center justify-center text-sm font-medium ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
              "group/btn relative h-10 rounded-md",
              "bg-gradient-to-br from-gray-100 to-gray-200",
              "dark:from-neutral-900 dark:to-neutral-800",
              "shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
              "dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",

              "hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-300",
              "dark:hover:from-neutral-800 dark:hover:to-neutral-700",
              "hover:shadow-lg",
              "hover:ring-2 hover:ring-primary/20",
            )}
            onClick={() => setOpenPopover(!openPopover)}
          >
            <div className="flex items-center space-x-3">
              <div className={cn("size-3 rounded-full", selected.color)} />
              <div className="flex items-center space-x-3">
                <span
                  className={cn(
                    "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                    large ? "w-full" : "max-w-[80px]",
                  )}
                >
                  {selected.title}
                </span>
              </div>
            </div>
            <ChevronsUpDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <BottomGradient />
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-60 p-2">
          <ProjectList
            selected={selected}
            projects={projects}
            setOpenPopover={setOpenPopover}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ProjectList({
  selected,
  projects,
  setOpenPopover,
}: {
  selected: ProjectType;
  projects: ProjectType[];
  setOpenPopover: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {projects.map(({ slug, color }) => (
        <Link
          key={slug}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative flex h-9 items-center gap-3 p-3 text-muted-foreground hover:text-foreground",
          )}
          href="#"
          onClick={() => setOpenPopover(false)}
        >
          <div className={cn("size-3 shrink-0 rounded-full", color)} />
          <span
            className={`flex-1 truncate text-sm ${
              selected.slug === slug
                ? "font-medium text-foreground"
                : "font-normal"
            }`}
          >
            {slug}
          </span>
          {selected.slug === slug && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
              <Check size={18} aria-hidden="true" />
            </span>
          )}
        </Link>
      ))}
      <Button
        variant="outline"
        className="relative flex h-9 items-center justify-center gap-2 p-2"
        onClick={() => {
          setOpenPopover(false);
        }}
      >
        <Plus size={18} className="absolute left-2.5 top-2" />
        <span className="flex-1 truncate text-center">New Project</span>
      </Button>
    </div>
  );
}

function ProjectSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  );
}

const BottomGradient: React.FC<{ className?: string }> = ({ className }) => (
  <>
    <span
      className={cn(
        "absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100",
        className,
      )}
    />
    <span
      className={cn(
        "absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100",
        className,
      )}
    />
  </>
);
