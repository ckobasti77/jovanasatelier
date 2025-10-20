import { Ruler } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const PRODUCTION_TIMELINE_STEPS = [
  { label: { en: "Pattern drafting", sr: "Krojenje kroja" }, status: "complete" as const },
  { label: { en: "Cutting & prepping", sr: "Kroj i priprema" }, status: "current" as const },
  { label: { en: "Sewing & detailing", sr: "Šivenje i detalji" }, status: "upcoming" as const },
  { label: { en: "Quality check", sr: "Kontrola kvaliteta" }, status: "upcoming" as const },
  { label: { en: "Packaging & ship", sr: "Pakovanje i slanje" }, status: "upcoming" as const },
] as const;

export function ProductionTimeline() {
  const { language } = useLanguage();

  return (
    <Card className="space-y-4 rounded-[22px] border border-border/40 bg-background/90 p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-foreground/45">
        <Ruler className="h-4 w-4" />
        {language === "sr" ? "produkcioni tok" : "production tracker"}
      </div>
      <ul className="space-y-3 text-sm text-foreground/70">
        {PRODUCTION_TIMELINE_STEPS.map((step) => (
          <li
            key={step.label.en}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border/40 px-4 py-3",
              step.status === "complete" && "border-emerald-200 bg-emerald-50 text-emerald-900",
              step.status === "current" && "border-foreground/50 bg-foreground/5",
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40">
              {step.status === "complete" ? "X" : "o"}
            </span>
            <span>{step.label[language]}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
