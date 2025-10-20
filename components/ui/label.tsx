import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  helper?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, helper, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "flex flex-col gap-1 text-sm font-medium text-foreground/85",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {helper ? (
        <span className="text-xs font-normal text-foreground/55">{helper}</span>
      ) : null}
    </label>
  ),
);
Label.displayName = "Label";
