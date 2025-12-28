"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Shuffle } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { DRESS_MODELS } from "@/lib/dress-data";
import { MODEL_GALLERY } from "@/lib/model-gallery";

type LookbookEntry = {
  id: string;
  src: string;
  alt: string;
  model: {
    name: string;
    slug: string;
    accentGradient: string;
  };
  color: {
    id: string;
    name: string;
    swatch: string;
    secondary?: string;
  };
};

const LOOKBOOK_ITEMS: LookbookEntry[] = DRESS_MODELS.flatMap((model) =>
  model.colors.flatMap((color) => {
    const gallery = MODEL_GALLERY[model.id]?.[color.id] ?? [];
    const sources = [
      ...gallery,
      color.image,
      ...(gallery.length ? [] : model.heroImage ? [model.heroImage] : []),
    ].filter((item): item is string => Boolean(item));
    const uniqueSources = Array.from(new Set(sources));
    return uniqueSources.map((src, index) => ({
      id: `${model.id}-${color.id}-${index}`,
      src,
      alt: `${model.name} in ${color.name}`,
      model: {
        name: model.name,
        slug: model.slug,
        accentGradient: model.accentGradient,
      },
      color: {
        id: color.id,
        name: color.name,
        swatch: color.swatch,
        secondary: color.secondary,
      },
    }));
  }),
);

const LOOKBOOK_COPY = {
  en: {
    badge: "lookbook",
    title: "Every color, every silhouette. Completely randomized.",
    description:
      "Tap any image to open the model page with the selected color preloaded.",
    cta: "Design your dress",
    hoverTitle: "View model",
    hoverAction: "Open details",
    gridLabel: "All looks",
    shuffleLabel: "Random order",
    countLabel: "looks",
  },
  sr: {
    badge: "lookbook",
    title: "Sve boje, svi modeli. Potpuno nasumican redosled.",
    description:
      "Klikni na sliku da otvoris model sa vec unapred izabranom bojom.",
    cta: "Konfigurisi haljinu",
    hoverTitle: "Pogledaj model",
    hoverAction: "Otvori detalje",
    gridLabel: "Svi look-ovi",
    shuffleLabel: "Nasumican redosled",
    countLabel: "look-ova",
  },
} as const;

function shuffleItems<T>(items: T[]) {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
}

export default function LookbookPage() {
  const { language } = useLanguage();
  const copy = LOOKBOOK_COPY[language];
  const [items, setItems] = useState(LOOKBOOK_ITEMS);

  useEffect(() => {
    setItems(shuffleItems(LOOKBOOK_ITEMS));
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-6xl flex-col gap-14 px-4 pb-28 pt-14 sm:gap-16 sm:px-6 sm:pb-32 sm:pt-20 lg:gap-20">
        <section
          className="relative overflow-hidden rounded-[32px] border border-border/50 p-6 sm:p-10 lg:p-14"
          style={{ backgroundImage: "var(--hero-surface)" }}
        >
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-foreground/60">
            <Badge variant="outline" className="uppercase tracking-[0.35em]">
              {copy.badge}
            </Badge>
            <span className="inline-flex items-center gap-2">
              <Shuffle className="h-3.5 w-3.5" />
              {copy.shuffleLabel}
            </span>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {copy.title}
              </h1>
              <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
                {copy.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button asChild size="md" className="w-full sm:w-auto">
                <Link href="/configurator">{copy.cta}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold uppercase tracking-[0.32em] text-foreground/60">
              {copy.gridLabel}
            </h2>
            <span className="text-xs uppercase tracking-[0.28em] text-foreground/45">
              {items.length} {copy.countLabel}
            </span>
          </div>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/models/${item.model.slug}?color=${item.color.id}`}
                className="group mb-5 block break-inside-avoid"
                aria-label={`${item.model.name} ${item.color.name}`}
              >
                <div className="relative overflow-hidden rounded-[26px] border border-border/40 bg-background/70 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={960}
                    height={1280}
                    className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-70"
                    style={{ background: item.model.accentGradient }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-end justify-between gap-4 p-4 opacity-0 transition duration-500 group-hover:opacity-100 sm:p-5">
                    <div className="space-y-2">
                      <span className="rounded-full text-nowrap border border-white/40 bg-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-white">
                        {copy.hoverTitle}
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {item.model.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <span
                            className="h-3 w-3 rounded-full border border-white/60"
                            style={{
                              background: item.color.secondary
                                ? `linear-gradient(135deg, ${item.color.swatch} 0%, ${item.color.secondary} 100%)`
                                : item.color.swatch,
                            }}
                          />
                          <span>{item.color.name}</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex text-nowrap items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-white">
                      {copy.hoverAction}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
