"use client";

import Link from "next/link";
import { BadgeCheck, FileText, Mail, Palette } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

const PRESS_KIT_COPY = {
  en: {
    hero: {
      badge: "press kit",
      title: "Everything editors need to tell the JeVeux story.",
      description:
        "Brand facts, press-ready messaging, and asset guidance in one place.",
      primaryCta: "Request assets",
    },
    snapshot: {
      title: "Brand snapshot",
      items: [
        "Design-to-fit couture made in Belgrade.",
        "Four signature silhouettes with modular customization.",
        "Worldwide shipping with guided fitting support.",
      ],
    },
    facts: {
      title: "Fast facts",
      items: [
        "Founded: 2024",
        "Production time: 7-15 business days",
        "Price range: EUR 240-440",
        "Made-to-measure with alteration pass",
      ],
    },
    usage: {
      title: "Usage guidelines",
      items: [
        "Credit line: JeVeux Couture",
        "Link to: jeveuxcouture.com",
        "Editorial use approved on request",
      ],
    },
    contact: {
      title: "Press contact",
      description:
        "For interviews, look requests, or press loan inquiries, reach out to the atelier team.",
      email: "hello@jeveuxcouture.com",
    },
  },
  sr: {
    hero: {
      badge: "press kit",
      title: "Sve sto je urednicima potrebno za JeVeux pricu.",
      description:
        "Brze cinjenice, press poruke i smernice za assete na jednom mestu.",
      primaryCta: "Zatrazi materijal",
    },
    snapshot: {
      title: "Kratak pregled",
      items: [
        "Design-to-fit couture iz Beograda.",
        "Cetiri potpisna modela sa modularnim izborima.",
        "Globalna isporuka uz vodjeni fitting.",
      ],
    },
    facts: {
      title: "Brze cinjenice",
      items: [
        "Osnovano: 2024",
        "Izrada: 7-15 radnih dana",
        "Cene: EUR 240-440",
        "Krojeno po meri uz paket prepravki",
      ],
    },
    usage: {
      title: "Smernice koriscenja",
      items: [
        "Credit line: JeVeux Couture",
        "Link: jeveuxcouture.com",
        "Editorial upotreba uz dogovor",
      ],
    },
    contact: {
      title: "Press kontakt",
      description:
        "Za intervjue, look zahteve ili pozajmice za snimanja, javi se atelier timu.",
      email: "hello@jeveuxcouture.com",
    },
  },
} as const;

export default function PressKitPage() {
  const { language } = useLanguage();
  const copy = PRESS_KIT_COPY[language];

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
            <div className="flex justify-start lg:justify-end">
              <Button asChild size="md">
                <Link href="mailto:hello@jeveuxcouture.com">
                  {copy.hero.primaryCta}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/40 bg-background/85">
            <CardHeader className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-foreground/10 text-foreground">
                <FileText className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {copy.snapshot.title}
              </h2>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-foreground/70">
              <ul className="space-y-2">
                {copy.snapshot.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-foreground/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-background/85">
            <CardHeader className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-foreground/10 text-foreground">
                <Palette className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {copy.facts.title}
              </h2>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-foreground/70">
              <ul className="space-y-2">
                {copy.facts.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-foreground/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-border/40 bg-background/85">
            <CardHeader className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                {copy.usage.title}
              </h2>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-foreground/70">
              <ul className="space-y-2">
                {copy.usage.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-foreground/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col justify-between gap-6 rounded-[26px] border border-border/40 bg-background/85 p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)]">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-foreground/10 text-foreground">
                <Mail className="h-4 w-4" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {copy.contact.title}
              </h3>
              <p className="text-sm text-foreground/70">
                {copy.contact.description}
              </p>
            </div>
            <Button asChild size="sm" className="w-full sm:w-fit">
              <Link href={`mailto:${copy.contact.email}`}>
                {copy.contact.email}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
