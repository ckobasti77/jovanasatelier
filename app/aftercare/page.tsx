"use client";

import Link from "next/link";
import { Sparkles, Store, ThermometerSnowflake, Wrench } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

const AFTERCARE_COPY = {
  en: {
    hero: {
      badge: "aftercare",
      title: "Care that lasts beyond the celebration.",
      description:
        "Every JeVeux piece is built to be worn again. These rituals keep the silhouette crisp, the fabric luminous, and the fit impeccable.",
      primaryCta: "Open your profile",
      secondaryCta: "Book a fitting check",
    },
    rituals: {
      title: "Signature care rituals",
      items: [
        {
          title: "Cleaning + pressing",
          description:
            "Follow the fabric guide included with your order. Steam from a distance and avoid direct heat.",
        },
        {
          title: "Storage + travel",
          description:
            "Hang on a padded hanger, store in a breathable garment bag, and avoid folding the bodice.",
        },
        {
          title: "Refresh + repairs",
          description:
            "Use the 60-day alteration pass to tweak fit, replace buttons, or refresh seams.",
        },
      ],
    },
    notes: {
      title: "Fabric notes",
      items: [
        "Silk chiffon: dry clean only, steam lightly from 20 cm away.",
        "Crepe blends: cold hand wash, lay flat to dry.",
        "Sateen + satin: press inside out with a low-heat cloth barrier.",
        "Tulle + organza: steam only, never iron directly.",
      ],
    },
    support: {
      title: "Still need help?",
      description:
        "Our atelier can review wear photos, recommend specialists, or schedule a fitting refresh.",
      primaryCta: "Contact atelier",
      secondaryCta: "View fitting guide",
    },
  },
  sr: {
    hero: {
      badge: "nega",
      title: "Nega koja traje i posle proslave.",
      description:
        "Svaka JeVeux haljina je stvorena da se nosi vise puta. Ovi rituali cuvaju liniju, sjaj i savrsen fit.",
      primaryCta: "Otvori svoj profil",
      secondaryCta: "Zakazi proveru",
    },
    rituals: {
      title: "Rituali nege",
      items: [
        {
          title: "Pranje + peglanje",
          description:
            "Prati uputstva za tkaninu iz paketa. Para sa distance, bez direktne toplote.",
        },
        {
          title: "Cuvanje + putovanja",
          description:
            "Kaci na mekani ofinger, koristi propusnu futrolu i ne savijaj gornji deo.",
        },
        {
          title: "Osvezavanje + popravke",
          description:
            "Iskoristi 60-dnevni paket prepravki za korekcije i osvezenje.",
        },
      ],
    },
    notes: {
      title: "Napomene za tkanine",
      items: [
        "Silk chiffon: hemijsko ciscenje, blaga para sa 20 cm.",
        "Crepe: hladno rucno pranje, susenje na ravnom.",
        "Sateen + satin: peglanje iznutra uz zastitnu tkaninu.",
        "Tulle + organza: samo para, bez direktnog peglanja.",
      ],
    },
    support: {
      title: "Treba ti dodatna pomoc?",
      description:
        "Atelier tim moze proceniti fotografije nosenja ili zakazati fit refresh.",
      primaryCta: "Kontaktiraj atelier",
      secondaryCta: "Pogledaj vodic za mere",
    },
  },
} as const;

export default function AftercarePage() {
  const { language } = useLanguage();
  const copy = AFTERCARE_COPY[language];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-6xl flex-col gap-14 px-4 pb-28 pt-14 sm:gap-16 sm:px-6 sm:pb-32 sm:pt-20 lg:gap-20">
        <section
          className="relative overflow-hidden rounded-[32px] border border-border/50 p-6 sm:p-10 lg:p-14"
          style={{ backgroundImage: "var(--hero-surface)" }}
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
                <Link href="/portal">{copy.hero.primaryCta}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="md"
                className="w-full border border-foreground/15 sm:w-auto"
              >
                <Link href="/fitting-guide">{copy.hero.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {copy.rituals.title}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {copy.rituals.items.map((item, index) => (
              <Card key={item.title} className="border-border/40 bg-background/85">
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-foreground/10 text-foreground">
                    {index === 0 ? (
                      <ThermometerSnowflake className="h-4 w-4" />
                    ) : index === 1 ? (
                      <Store className="h-4 w-4" />
                    ) : (
                      <Wrench className="h-4 w-4" />
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

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-4 rounded-[26px] border border-border/40 bg-background/85 p-6">
            <h3 className="text-xl font-semibold text-foreground">
              {copy.notes.title}
            </h3>
            <ul className="space-y-3 text-sm text-foreground/70">
              {copy.notes.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-foreground/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 rounded-[26px] border border-border/40 bg-background/85 p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)]">
            <h3 className="text-xl font-semibold text-foreground">
              {copy.support.title}
            </h3>
            <p className="text-sm text-foreground/70">
              {copy.support.description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href="mailto:hello@jeveuxcouture.com">
                  {copy.support.primaryCta}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="w-full border border-foreground/15 sm:w-auto"
              >
                <Link href="/fitting-guide">{copy.support.secondaryCta}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
