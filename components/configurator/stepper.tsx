import { Sparkles } from "lucide-react";

import { configuratorSteps } from "@/lib/configurator-schema";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";

type StepperProps = {
  activeStep: number;
};

export function Stepper({ activeStep }: StepperProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-foreground/45">
          <Sparkles className="h-4 w-4" />
          {language === "sr"
            ? `${activeStep + 1} od ${configuratorSteps.length} koraka`
            : `${activeStep + 1} of ${configuratorSteps.length} steps`}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {configuratorSteps.map((step, index) => {
          const status =
            index < activeStep ? "completed" : index === activeStep ? "active" : "upcoming";
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col gap-2 rounded-2xl border border-border/50 bg-background/80 p-4 transition",
                status === "active" &&
                  "border-foreground/70 shadow-[0_16px_40px_-28px_rgba(15,23,42,.45)]",
                status === "completed" &&
                  "border-foreground/30 bg-foreground/5 text-foreground/80",
              )}
            >
              <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {step.labels[language]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
