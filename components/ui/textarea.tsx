import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-[140px] w-full rounded-xl border border-border/60 bg-background/95 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-foreground/60 focus:outline-none focus:ring-4 focus:ring-foreground/10 placeholder:text-foreground/45 disabled:cursor-not-allowed",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
