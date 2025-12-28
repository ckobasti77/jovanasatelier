"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Ruler, Video } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

const FITTING_GUIDE_COPY = {
  en: {
    hero: {
      badge: "fitting guide",
      title: "Measure with certainty.",
      description:
        "A calm, 10-minute ritual that captures your exact shape. Use a soft tape, a mirror, and a friend if you can.",
      primaryCta: "Start measuring",
      secondaryCta: "Talk to concierge",
    },
    prep: {
      title: "Before you begin",
      items: [
        {
          title: "Set the scene",
          description:
            "Stand tall, feet together, in front of a mirror with natural light.",
        },
        {
          title: "What to wear",
          description:
            "Choose a form-fitting base layer and the bra or shapewear you will wear with the dress.",
        },
        {
          title: "Time & tools",
          description: "Soft tape, a notebook, and 10 quiet minutes.",
        },
      ],
    },
    steps: {
      title: "Measurement flow",
      description:
        "Keep the tape snug, never tight. We validate each number before cutting.",
      items: [
        {
          title: "Bust",
          description: "Measure around the fullest point, parallel to the floor.",
        },
        {
          title: "Waist",
          description:
            "Locate your natural waist (above the belly button) and measure evenly.",
        },
        {
          title: "Hips",
          description:
            "Measure at the widest part of hips and seat for accurate drape.",
        },
        {
          title: "Shoulder to hem",
          description:
            "From shoulder point down to the length you want (midi, tea, full).",
        },
        {
          title: "Heel height",
          description: "Measure the exact heel height you plan to wear.",
        },
      ],
    },
    support: {
      title: "Fitting support",
      description:
        "Need a second set of eyes? The atelier team can review your numbers before production.",
      cards: [
        {
          title: "Live video check",
          description:
            "Book a 15-minute call and we will confirm your tape placement.",
        },
        {
          title: "Profiles for every shoe",
          description:
            "Save separate measurements for heels, flats, and barefoot looks.",
        },
        {
          title: "Alteration buffer",
          description:
            "Every order includes a 60-day alteration pass for peace of mind.",
        },
      ],
    },
    checklist: {
      title: "Quick checklist",
      items: [
        "Tie hair up and remove bulky jewelry.",
        "Keep the tape level and parallel to the floor.",
        "Breathe normally, no pulling in.",
        "Record numbers in centimeters.",
      ],
      timeLabel: "10 min average",
    },
  },
  sr: {
    hero: {
      badge: "vodic za uklapanje",
      title: "Meri sa sigurnoscu.",
      description:
        "Mirna rutina od 10 minuta koja precizno belezi tvoju siluetu. Koristi mekani metar, ogledalo i prijateljicu ako mozes.",
      primaryCta: "Pocni sa merenjem",
      secondaryCta: "Javi se concierge timu",
    },
    prep: {
      title: "Pre pocetka",
      items: [
        {
          title: "Pripremi prostor",
          description:
            "Stani uspravno, stopala zajedno, ispred ogledala sa dobrim svetlom.",
        },
        {
          title: "Sta da obuces",
          description:
            "Biraj uzan sloj i brus ili shapewear koji planiras uz haljinu.",
        },
        {
          title: "Vreme i alat",
          description: "Mekani metar, sveska i 10 mirnih minuta.",
        },
      ],
    },
    steps: {
      title: "Redosled merenja",
      description:
        "Metar treba da lezi uz telo bez stezanja. Svaki broj proveravamo pre kroja.",
      items: [
        {
          title: "Grudi",
          description: "Obim preko najpunijeg dela, paralelno sa podom.",
        },
        {
          title: "Struk",
          description:
            "Pronadji prirodni struk (iznad pupka) i meri ravnomerno.",
        },
        {
          title: "Kukovi",
          description:
            "Obim preko najireg dela kukova i zadnjice za tacan pad.",
        },
        {
          title: "Rame do duzine",
          description:
            "Od tacke ramena do duzine koju zelis (midi, tea, full).",
        },
        {
          title: "Visina stikle",
          description: "Izmeri tacnu visinu stikle koju ces nositi.",
        },
      ],
    },
    support: {
      title: "Podrska za fitting",
      description:
        "Ako ti treba dodatna potvrda, atelier tim pregledava mere pre izrade.",
      cards: [
        {
          title: "Video provera",
          description:
            "Zakazi kratak poziv i potvrdi poziciju metra uz nasu pomoc.",
        },
        {
          title: "Profili za svaku obucu",
          description:
            "Sacuvaj mere za stikle, ravne cipele i bos look.",
        },
        {
          title: "Buffer za prepravke",
          description:
            "Svaka porudzbina ima 60 dana za prilagodjavanje.",
        },
      ],
    },
    checklist: {
      title: "Brza lista",
      items: [
        "Skupi kosu i ukloni krupni nakit.",
        "Drzi metar ravan i paralelan sa podom.",
        "Disi normalno, bez uvlacenja stomaka.",
        "Upisi mere u centimetrima.",
      ],
      timeLabel: "oko 10 min",
    },
  },
} as const;

export default function FittingGuidePage() {
  const { language } = useLanguage();
  const copy = FITTING_GUIDE_COPY[language];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-6xl flex-col gap-14 px-4 pb-28 pt-14 sm:gap-16 sm:px-6 sm:pb-32 sm:pt-20 lg:gap-20">
        <section
          className="relative overflow-hidden rounded-[32px] border border-border/50 p-6 sm:p-10 lg:p-14"
          style={{ backgroundImage: "var(--fit-surface)" }}
        >
          <Badge variant="outline" className="uppercase tracking-[0.35em]">
            {copy.hero.badge}
          </Badge>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {copy.hero.title}
              </h1>
              <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
                {copy.hero.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button asChild size="md" className="w-full sm:w-auto">
                <Link href="/configurator">{copy.hero.primaryCta}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="md"
                className="w-full border border-foreground/15 sm:w-auto"
              >
                <Link href="mailto:hello@jeveuxcouture.com">
                  {copy.hero.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {copy.prep.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {copy.prep.items.map((item) => (
              <Card key={item.title} className="border-border/40 bg-background/85">
              <CardHeader className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-foreground/10 text-foreground">
                  <Ruler className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h2>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-foreground/70">
                {item.description}
              </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
                {copy.steps.title}
              </h2>
              <p className="text-sm text-foreground/70">
                {copy.steps.description}
              </p>
            </div>
            <div className="space-y-4">
              {copy.steps.items.map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-[22px] border border-border/40 bg-background/80 p-4"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/90 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-sm text-foreground/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-[26px] border border-border/40 bg-background/85 p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)]">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">
                {copy.checklist.title}
              </h3>
              <ul className="space-y-3 text-sm text-foreground/70">
                {copy.checklist.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-foreground/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-3 rounded-[18px] border border-border/40 bg-background/80 p-4 text-sm text-foreground/70">
              <Clock className="h-4 w-4 text-foreground/60" />
              <span>{copy.checklist.timeLabel}</span>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {copy.support.title}
            </h2>
            <p className="text-sm text-foreground/70">
              {copy.support.description}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {copy.support.cards.map((item, index) => (
              <Card key={item.title} className="border-border/40 bg-background/85">
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-foreground/10 text-foreground">
                    {index === 0 ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-foreground/70">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
