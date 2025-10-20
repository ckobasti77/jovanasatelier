import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-transparent bg-foreground/10 text-foreground",
        outline: "border-border text-foreground",
        success:
          "border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
