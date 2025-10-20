import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type, ...props }, ref) => {
    return (
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground/50">
            {icon}
          </span>
        ) : null}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-border/60 bg-background/95 px-4 text-sm text-foreground shadow-sm transition-all placeholder:text-foreground/45 focus:border-foreground/60 focus:outline-none focus:ring-4 focus:ring-foreground/10 disabled:cursor-not-allowed",
            icon && "pl-10",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";
