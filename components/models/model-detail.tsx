"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLocalizedDressModel } from "@/hooks/use-dress-models";
import { MODEL_GALLERY } from "@/lib/model-gallery";
import { cn } from "@/lib/utils";

const MODEL_PAGE_COPY = {
  en: {
    badge: "silhouette profile",
    backLabel: "Back to models",
    configureLabel: "Configure this model",
    pricePrefix: "from EUR",
    productionLabel: "production time",
    silhouetteLabel: "silhouette",
    paletteTitle: "Palette",
    fabricsTitle: "Fabrics",
    lengthsTitle: "Lengths",
    careLabel: "Care",
    upchargeLabel: "Upcharge",
    highlightsTitle: "Highlights",
    previousImage: "Previous image",
    nextImage: "Next image",
  },
  sr: {
    badge: "profil siluete",
    backLabel: "Nazad na modele",
    configureLabel: "Konfigurisi model",
    pricePrefix: "od EUR",
    productionLabel: "vreme izrade",
    silhouetteLabel: "silueta",
    paletteTitle: "Paleta",
    fabricsTitle: "Tkanine",
    lengthsTitle: "Duzine",
    careLabel: "Nega",
    upchargeLabel: "Doplata",
    highlightsTitle: "Istaknuto",
    previousImage: "Prethodna slika",
    nextImage: "Sledeca slika",
  },
} as const;

const SILHOUETTE_LABELS = {
  en: {
    "a-line": "A-line",
    mermaid: "Mermaid",
    sheath: "Sheath",
    ballgown: "Ballgown",
  },
  sr: {
    "a-line": "A-linija",
    mermaid: "Sirena",
    sheath: "Kolona",
    ballgown: "Balska",
  },
} as const;

export function ModelDetail({ modelId }: { modelId: string }) {
  const { language } = useLanguage();
  const copy = MODEL_PAGE_COPY[language];
  const model = useLocalizedDressModel(modelId);
  const silhouetteLabel =
    SILHOUETTE_LABELS[language][model.silhouette] ?? model.silhouette;
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedColorId(null);
  }, [model.id]);

  const selectedColor = useMemo(
    () => model.colors.find((color) => color.id === selectedColorId) ?? null,
    [model.colors, selectedColorId],
  );

  const imageSources = useMemo(() => {
    if (!selectedColor) {
      return model.heroImage ? [model.heroImage] : [];
    }
    const gallery = MODEL_GALLERY[model.id]?.[selectedColor.id] ?? [];
    if (gallery.length) {
      return gallery;
    }
    const fallback = selectedColor.image ?? model.heroImage;
    return fallback ? [fallback] : [];
  }, [model.id, model.heroImage, selectedColor?.id, selectedColor?.image]);

  const imageEntries = useMemo(() => {
    const alt = selectedColor?.name
      ? `${model.name} in ${selectedColor.name}`
      : `${model.name} couture dress`;
    return imageSources.map((src) => ({ src, alt }));
  }, [imageSources, selectedColor?.name, model.name]);

  const preferredSrc =
    selectedColor?.image ?? model.heroImage ?? imageEntries[0]?.src ?? "";
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

  const configuratorHref = selectedColorId
    ? `/configurator?model=${model.slug}&color=${selectedColorId}&step=style`
    : `/configurator?model=${model.slug}`;

  return (
    <div className="space-y-12">
      <Link
        href="/#models"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-foreground/60 transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {copy.backLabel}
      </Link>

      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <Badge variant="outline" className="w-fit uppercase tracking-[0.35em]">
            {copy.badge}
          </Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {model.name}
            </h1>
            <p className="text-base text-foreground/70">{model.tagLine}</p>
            <p className="text-sm text-foreground/65">{model.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-foreground/55">
            <span className="rounded-full border border-border/50 bg-background/80 px-3 py-1">
              {copy.pricePrefix} {model.basePrice}
            </span>
            <span className="flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-3 py-1">
              <Clock className="h-3.5 w-3.5" />
              {copy.productionLabel} {model.productionTime}
            </span>
            <span className="rounded-full border border-border/50 bg-background/80 px-3 py-1">
              {copy.silhouetteLabel} {silhouetteLabel}
            </span>
          </div>
          <Button asChild size="md" className="w-full sm:w-auto">
            <Link href={configuratorHref}>
              {copy.configureLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">
              {copy.highlightsTitle}
            </p>
            <ul className="grid gap-2 text-sm text-foreground/70">
              {model.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground/60" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-background/80 p-4 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)]">
          <div className="relative h-[420px] w-full overflow-hidden rounded-[22px] border border-border/40 bg-background/70">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              className="object-contain"
              priority
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay"
              style={{ background: model.accentGradient }}
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
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              {copy.paletteTitle}
            </h2>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {model.colors.map((color) => {
              const isSelected = color.id === selectedColorId;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() =>
                    setSelectedColorId((prev) =>
                      prev === color.id ? null : color.id,
                    )
                  }
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border border-border/40 bg-background/80 p-3 text-left transition hover:border-foreground/40",
                    isSelected &&
                      "border-foreground/60 shadow-[0_18px_45px_-30px_rgba(15,23,42,.55)]",
                  )}
                  aria-pressed={isSelected}
                >
                  <span
                    className="h-9 w-9 rounded-full border border-border/50"
                    style={{
                      background: color.secondary
                        ? `linear-gradient(135deg, ${color.swatch} 0%, ${color.secondary} 100%)`
                        : color.swatch,
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {color.name}
                    </p>
                    <p className="text-xs text-foreground/55">
                      {color.secondary ?? color.swatch}
                    </p>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              {copy.fabricsTitle}
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-sm text-foreground/70">
            {model.fabrics.map((fabric) => (
              <div key={fabric.id} className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {fabric.name}
                </p>
                <p className="text-xs text-foreground/60">
                  {fabric.description}
                </p>
                <p className="text-xs text-foreground/55">
                  {copy.careLabel}: {fabric.care}
                  {fabric.upcharge
                    ? ` | ${copy.upchargeLabel}: +EUR ${fabric.upcharge}`
                    : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <h2 className="text-lg font-semibold text-foreground">
              {copy.lengthsTitle}
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-sm text-foreground/70">
            {model.lengths.map((length) => (
              <div key={length.id} className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {length.name}
                </p>
                <p className="text-xs text-foreground/60">
                  {length.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
