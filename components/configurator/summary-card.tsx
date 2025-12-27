import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Card } from "@/components/ui/card";
import { useLocalizedDressModel } from "@/hooks/use-dress-models";
import {
  type ConfiguratorInput,
  computeFitConfidence,
} from "@/lib/configurator-schema";
import { MODEL_GALLERY } from "@/lib/model-gallery";
import { cn } from "@/lib/utils";

const SUMMARY_COPY = {
  en: {
    currentModel: "current model",
    pricePrefix: "from EUR ",
    fitConfidence: "fit confidence",
    previousImage: "Previous image",
    nextImage: "Next image",
  },
  sr: {
    currentModel: "trenutni model",
    pricePrefix: "od EUR ",
    fitConfidence: "sigurnost uklapanja",
    previousImage: "Prethodna slika",
    nextImage: "Sledeca slika",
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
  const color = model.colors.find((item) => item.id === values.colorId);
  const imageSources = useMemo(() => {
    const gallery = MODEL_GALLERY[model.id]?.[color?.id ?? ""] ?? [];
    if (gallery.length) {
      return gallery;
    }
    const fallback = color?.image ?? model.heroImage;
    return fallback ? [fallback] : [];
  }, [model.id, color?.id, color?.image, model.heroImage]);

  const imageEntries = useMemo(() => {
    const alt = color?.name
      ? `${model.name} in ${color.name}`
      : `${model.name} couture dress`;
    return imageSources.map((src) => ({ src, alt }));
  }, [imageSources, color?.name, model.name]);

  const preferredSrc =
    color?.image ?? model.heroImage ?? imageEntries[0]?.src ?? "";
  const defaultIndex = useMemo(() => {
    if (!preferredSrc) {
      return 0;
    }
    const index = imageEntries.findIndex((entry) => entry.src === preferredSrc);
    return index >= 0 ? index : 0;
  }, [imageEntries, preferredSrc]);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  useEffect(() => {
    if (!imageEntries.length) {
      return;
    }
    setActiveIndex(defaultIndex);
  }, [defaultIndex, imageEntries.length]);

  const activeImage =
    imageEntries[activeIndex] ?? imageEntries[0] ?? {
      src: model.heroImage,
      alt: `${model.name} couture dress`,
    };
  const canCycle = imageEntries.length > 1;
  const handlePrev = () => {
    if (!canCycle) {
      return;
    }
    setActiveIndex(
      (prev) => (prev - 1 + imageEntries.length) % imageEntries.length,
    );
  };
  const handleNext = () => {
    if (!canCycle) {
      return;
    }
    setActiveIndex((prev) => (prev + 1) % imageEntries.length);
  };

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
      <div className="relative">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          width={640}
          height={800}
          className="h-80 w-full object-contain transition duration-500 group-hover:scale-[1.02]"
        />
        {canCycle ? (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label={copy.previousImage}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground/70 shadow-sm backdrop-blur transition hover:bg-foreground/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={copy.nextImage}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground/70 shadow-sm backdrop-blur transition hover:bg-foreground/10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full border border-border/50 bg-background/85 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.24em] text-foreground/60">
              {activeIndex + 1}/{imageEntries.length}
            </span>
          </>
        ) : null}
      </div>
      <div className="space-y-3 text-sm text-foreground/70">

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





