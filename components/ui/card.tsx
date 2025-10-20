import * as React from "react";

import { cn } from "@/lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export function Card({
  className,
  children,
  glow = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card/95 text-card-foreground shadow-[0_25px_50px_-12px_rgba(15,23,42,0.15)] backdrop-blur supports-[backdrop-filter]:backdrop-blur",
        glow &&
          "before:pointer-events-none before:absolute before:inset-[-40%] before:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_rgba(255,255,255,0))] before:opacity-70 before:content-['']",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-2 p-8 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-4", className)} {...props} />
));
CardFooter.displayName = "CardFooter";
