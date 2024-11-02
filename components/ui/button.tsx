import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 text-gray-800 dark:text-white",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        disable:
          "border border-input bg-transparent text-neutral-600 cursor-not-allowed",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "size-10",
      },
      rounded: {
        default: "rounded-md",
        sm: "rounded-sm",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, rounded, className }),
          "group/btn relative h-10 rounded-md font-medium",
          "bg-gradient-to-br from-gray-100 to-gray-200",
          "dark:from-neutral-900 dark:to-neutral-800",
          "shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
          "dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]",

          "transition-all duration-300",
          "hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-300",
          "dark:hover:from-neutral-800 dark:hover:to-neutral-700",
          "hover:shadow-lg",
          "hover:ring-2 hover:ring-primary/20",
        )}
        ref={ref}
        {...props}
      >
        {props.children}
        <BottomGradient />
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
