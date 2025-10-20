import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Clock, Palette } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Card } from "@/components/ui/card";
import { useLocalizedDressModel } from "@/hooks/use-dress-models";
import {
  type ConfiguratorInput,
  computeFitConfidence,
} from "@/lib/configurator-schema";
import { cn } from "@/lib/utils";

const SUMMARY_COPY = {
  en: {
    currentModel: "current model",
    pricePrefix: "from EUR ",
    selectFabric: "Select fabric",
    fitConfidence: "fit confidence",
  },
  sr: {
    currentModel: "trenutni model",
    pricePrefix: "od EUR ",
    selectFabric: "Izaberi tkaninu",
    fitConfidence: "sigurnost uklapanja",
  },
} as const;

const FIT_CONFIDENCE_COPY = {
  en: {
    high: {
      label: "High",
      description: "Fit confidence is high. Atelier will review within 24 hours.",
    },
    medium: {
      label: "Good",
      description: "Add optional profile details for even more precision.",
    },
    low: {
      label: "Needs details",
      description: "Complete measurements and profile info to reach atelier accuracy.",
    },
  },
  sr: {
    high: {
      label: "Visoka",
      description: "Sigurnost uklapanja je visoka. Atelje potvrđuje u roku od 24 sata.",
    },
    medium: {
      label: "Dobra",
      description: "Dodaj nekoliko dodatnih informacija za još precizniji fit.",
    },
    low: {
      label: "Potrebno više",
      description: "Popuni sve mere i profil da bismo dostigli atelje preciznost.",
    },
  },
} as const;

type ConfidenceLevel = keyof typeof FIT_CONFIDENCE_COPY.en;

export function SummaryCard({ modelId }: { modelId: string }) {
  const { watch } = useFormContext<ConfiguratorInput>();
  const { language } = useLanguage();
  const copy = SUMMARY_COPY[language];

  const values = watch();

  const model = useLocalizedDressModel(modelId);
  const fabric = model.fabrics.find((item) => item.id === values.fabricId);

  const fitConfidence = computeFitConfidence(values);
  const levelCopy =
    FIT_CONFIDENCE_COPY[language][fitConfidence.level as ConfidenceLevel];

  return (
    <Card className="space-y-4 rounded-[22px] border border-border/40 bg-background/90 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">
            {copy.currentModel}
          </p>
          <p className="text-lg font-semibold text-foreground">{model.name}</p>
        </div>
        <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-medium text-foreground/70">
          {copy.pricePrefix}
          {model.basePrice}
        </span>
      </div>
      <Image
        src={model.heroImage}
        alt={`${model.name} couture dress`}
        width={640}
        height={800}
        className="h-80 w-full object-contain transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="space-y-3 text-sm text-foreground/70">
        <p className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-foreground/60" />
          {fabric ? fabric.name : copy.selectFabric}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-foreground/60" />
          {model.productionTime}
        </p>
        <div className="rounded-xl border border-border/50 bg-background/80 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/45">
            <span>{copy.fitConfidence}</span>
            <span>{levelCopy.label}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10">
            <div
              className={cn(
                "h-full rounded-full",
                fitConfidence.level === "high"
                  ? "bg-emerald-400"
                  : fitConfidence.level === "medium"
                    ? "bg-amber-400"
                    : "bg-rose-400",
              )}
              style={{ width: `${fitConfidence.percentage}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-foreground/55">{levelCopy.description}</p>
        </div>
      </div>
    </Card>
  );
}




