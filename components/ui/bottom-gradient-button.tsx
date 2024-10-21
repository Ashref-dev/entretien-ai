import React from "react";
import { cn } from "@/lib/utils";

interface BottomGradientProps {
  className?: string;
}

const BottomGradient: React.FC<BottomGradientProps> = ({ className }) => {
  return (
    <>
      <span className={cn("absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100", className)} />
      <span className={cn("absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100", className)} />
    </>
  );
};

interface BottomGradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const BottomGradientButton: React.FC<BottomGradientButtonProps> = ({ 
  children, 
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "group/btn relative block h-10 w-full rounded-md font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
        "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800",
        "dark:from-black dark:to-neutral-800 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",
        className
      )}
      type="button"
      {...props}
    >
      {children}
      <BottomGradient />
    </button>
  );
};

export default BottomGradientButton;
