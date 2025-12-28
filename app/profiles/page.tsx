"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft, Plus, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useConvexQuery } from "@/lib/convex-client";
import { useSessionToken } from "@/hooks/use-session-token";

const PAGE_COPY = {
  en: {
    badge: "atelier profiles",
    title: "Measurement profiles",
    description:
      "Create profiles for different heel heights or silhouettes. Apply them in the configurator or during fittings.",
    add: "New profile",
    emptyTitle: "No profiles yet",
    emptyBody: "Start by creating a profile with your go-to measurements.",
    backCta: "Back to portal",
    metrics: {
      bust: "Bust",
      waist: "Waist",
      hips: "Hips",
      height: "Height",
      heel: "Heel",
    },
    lastUpdated: (date: string) => `Updated ${date}`,
    view: "Open profile",
  },
  sr: {
    badge: "atelje profili",
    title: "Profili mera",
    description:
      "Napravi profile za razlicite visine potpetica ili modele. Primeni ih u konfiguratoru ili tokom proba.",
    add: "Novi profil",
    emptyTitle: "Jos nema profila",
    emptyBody: "Kreni tako sto ces kreirati profil sa svojim standardnim merama.",
    backCta: "Nazad u portal",
    metrics: {
      bust: "Grudi",
      waist: "Struk",
      hips: "Kukovi",
      height: "Visina",
      heel: "Stikla",
    },
    lastUpdated: (date: string) => `Azurirano ${date}`,
    view: "Otvori profil",
  },
} as const;

type MeasurementProfile = {
  id: string;
  _id?: string;
  label: string;
  bust: number;
  waist: number;
  hips: number;
  height: number;
  heel: number;
  notes?: string;
  updatedAt?: number;
};

export default function ProfilesPage() {
  const sessionToken = useSessionToken();
  const { language } = useLanguage();
  const copy = PAGE_COPY[language];

  const profiles = useConvexQuery("profiles:list", {
    sessionToken: sessionToken ?? undefined,
  }) as MeasurementProfile[] | undefined;

  const formattedProfiles = useMemo(() => {
    return (profiles ?? [])
      .map((profile) => {
        const id = profile.id ?? profile._id ?? "";
        if (!id) return null;
        const updatedLabel = profile.updatedAt
          ? copy.lastUpdated(
              new Date(profile.updatedAt).toLocaleDateString(language === "en" ? "en-US" : "sr-RS"),
            )
          : "";
        return {
          ...profile,
          id,
          updatedLabel,
        };
      })
      .filter((profile): profile is MeasurementProfile & { updatedLabel: string } => Boolean(profile));
  }, [copy, language, profiles]);

  const hasProfiles = formattedProfiles.length > 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-12 sm:gap-12 sm:px-6 sm:pb-24">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Badge variant="outline" className="uppercase tracking-[0.28em] text-xs text-foreground/60">
            {copy.badge}
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{copy.title}</h1>
            <p className="text-sm text-foreground/65 sm:text-base">{copy.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm" className="w-full gap-2 sm:w-auto">
              <Link href="/portal">
                <ArrowLeft className="h-4 w-4" />
                {copy.backCta}
              </Link>
            </Button>
            <Button asChild size="sm" className="w-full gap-2 sm:w-auto">
              <Link href="/profiles/new">
                <Plus className="h-4 w-4" />
                {copy.add}
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {profiles === undefined ? (
        <Card className="border-border/40 bg-background/80">
          <CardContent className="flex items-center justify-center py-24 text-sm text-foreground/60">
            Loading profiles...
          </CardContent>
        </Card>
      ) : hasProfiles ? (
        <div className="grid gap-6 md:grid-cols-2">
          {formattedProfiles.map((profile) => (
            <Card key={profile.id} className="border-border/40 bg-background/85">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{profile.label}</h2>
                    {profile.updatedLabel ? (
                      <p className="text-xs uppercase tracking-[0.24em] text-foreground/50">
                        {profile.updatedLabel}
                      </p>
                    ) : null}
                  </div>
                  <Ruler className="h-5 w-5 text-foreground/55" />
                </div>
                {profile.notes ? (
                  <p className="text-sm text-foreground/70">{profile.notes}</p>
                ) : null}
              </CardHeader>
              <CardContent className="grid gap-3 text-xs uppercase tracking-[0.24em] text-foreground/55">
                <MetricRow label={copy.metrics.bust} value={profile.bust} />
                <MetricRow label={copy.metrics.waist} value={profile.waist} />
                <MetricRow label={copy.metrics.hips} value={profile.hips} />
                <MetricRow label={copy.metrics.height} value={profile.height} />
                <MetricRow label={copy.metrics.heel} value={profile.heel} />
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                  <Link href={`/profiles/${profile.id}`}>{copy.view}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/40 bg-background/80">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <Ruler className="h-8 w-8 text-foreground/50" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">{copy.emptyTitle}</h2>
              <p className="text-sm text-foreground/65">{copy.emptyBody}</p>
            </div>
            <Button asChild size="sm" className="gap-2">
              <Link href="/profiles/new">
                <Plus className="h-4 w-4" />
                {copy.add}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <span className="flex items-center justify-between gap-2 rounded-2xl border border-border/40 px-4 py-3 text-foreground/70">
      {label}
      <strong className="text-foreground/85">{value} cm</strong>
    </span>
  );
}
