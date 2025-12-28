"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

const ABOUT_COPY = {
  en: {
    badge: "about",
    title: "About JeVeux",
    lead:
      "JeVeux is a Belgrade couture studio built around calm confidence, precise tailoring, and personal storytelling.",
    storyTitle: "The JeVeux studio",
    storyBody:
      "We design with a single goal: each dress should feel like it already belongs to you. Every pattern is adapted, every measurement is verified, and every finishing detail is checked by hand.",
    pillarsTitle: "What defines JeVeux",
    pillars: [
      {
        title: "Made-to-measure precision",
        description:
          "We combine a guided digital configurator with in-studio tailoring so the final piece matches your body exactly.",
      },
      {
        title: "Quiet luxury materials",
        description:
          "Silk crepe, satin, and airy tulles are curated in small runs to keep the hand feel and drape uncompromised.",
      },
      {
        title: "Styling partnership",
        description:
          "Our stylists help align the silhouette, color, and details with the mood of your event and your personal style.",
      },
    ],
    experienceTitle: "Your atelier experience",
    experienceSteps: [
      "Select a base silhouette and dial in length, fabric, and color.",
      "Submit measurements or save profiles for future orders.",
      "Receive updates as the atelier cuts, assembles, and finishes your dress.",
    ],
    ctaTitle: "Ready to begin?",
    ctaBody:
      "Start configuring your dress now or review the most common questions before booking.",
    ctaPrimary: "Start configuration",
    ctaSecondary: "Read FAQ",
  },
  sr: {
    badge: "o jeveux",
    title: "O JeVeux",
    lead:
      "JeVeux je beogradski couture studio zasnovan na preciznom kroju, mirnoj eleganciji i licnoj prici.",
    storyTitle: "JeVeux studio",
    storyBody:
      "Dizajniramo sa jednim ciljem: da haljina deluje kao da je oduvek tvoja. Svaki kroj prilagodjavamo, mere proveravamo, a zavrsne detalje radimo rucno.",
    pillarsTitle: "Sta definise JeVeux",
    pillars: [
      {
        title: "Precizno krojenje po meri",
        description:
          "Spoj digitalnog konfiguratora i atelje proba obezbedjuje savrseno uklapanje.",
      },
      {
        title: "Diskretno luksuzne tkanine",
        description:
          "Svileni krep, saten i lagani til biramo u malim serijama radi kvaliteta i pada.",
      },
      {
        title: "Styling partnerstvo",
        description:
          "Stilisti pomazu da silueta, boja i detalji prate raspolozenje dogadjaja i tvoj stil.",
      },
    ],
    experienceTitle: "Atelje iskustvo",
    experienceSteps: [
      "Izaberi osnovnu siluetu i podesi duzinu, tkaninu i boju.",
      "Unesi mere ili sacuvaj profile za sledece porudzbine.",
      "Prati tok izrade dok atelje kroji, sastavlja i zavrsava haljinu.",
    ],
    ctaTitle: "Spremna da pocnes?",
    ctaBody:
      "Pokreni konfigurator ili pregledaj najcesca pitanja pre rezervacije.",
    ctaPrimary: "Pokreni konfigurator",
    ctaSecondary: "FAQ",
  },
} as const;

export default function AboutPage() {
  const { language } = useLanguage();
  const copy = ABOUT_COPY[language];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl flex-col gap-12 px-4 pb-24 pt-14 sm:gap-16 sm:px-6 sm:pb-28 sm:pt-20">
        <section className="space-y-4">
          <Badge variant="outline" className="w-fit uppercase tracking-[0.35em]">
            {copy.badge}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
            {copy.lead}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {copy.storyTitle}
          </h2>
          <p className="max-w-3xl text-sm text-foreground/70 sm:text-base">
            {copy.storyBody}
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/55">
            <Sparkles className="h-4 w-4" />
            {copy.pillarsTitle}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {copy.pillars.map((pillar) => (
              <Card key={pillar.title} className="border-border/40 bg-background/80">
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                </CardHeader>
                <CardContent className="text-sm text-foreground/70">
                  {pillar.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            {copy.experienceTitle}
          </h2>
          <ul className="space-y-3 text-sm text-foreground/70">
            {copy.experienceSteps.map((step) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-foreground/60" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-[24px] border border-border/40 bg-background/80 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {copy.ctaTitle}
            </h3>
            <p className="text-sm text-foreground/70">
              {copy.ctaBody}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/configurator">{copy.ctaPrimary}</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full border border-foreground/15 sm:w-auto">
              <Link href="/faq">{copy.ctaSecondary}</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
