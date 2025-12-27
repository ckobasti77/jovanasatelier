"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Loader2,
  Package,
  Share2,
} from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSessionToken } from "@/hooks/use-session-token";
import { useConvexQuery } from "@/lib/convex-client";

const SHARE_COPY = {
  en: {
    badge: "atelier progress",
    title: (name?: string | null) =>
      name ? `${name}'s dress progress` : "Atelier progress tracker",
    subtitle: "Follow every atelier milestone from cutting table to delivery.",
    etaLabel: "Estimated delivery",
    timeline: "Production timeline",
    updates: "Shared updates",
    noUpdates: "Updates will appear here once the atelier publishes them.",
    shareLink: "Share link",
    shareHint: "Copy this link to keep friends and family in the loop.",
    shareMissing: "Ask your concierge to activate sharing for this order.",
    privacyNotice: "This page is private. Only people with the link can view it.",
    ownerActions: "Manage order in portal",
    notFoundTitle: "We couldn't find this progress page.",
    notFoundDescription:
      "The share link may have expired or been disabled. Request a fresh link from your concierge.",
    loading: "Loading progress…",
    copy: "Copy",
    copied: "Copied",
  },
  sr: {
    badge: "napredak ateljea",
    title: (name?: string | null) =>
      name ? `Napredak haljine za ${name}` : "Praćenje napretka u ateljeu",
    subtitle: "Prati svaki korak izrade od kroja do isporuke.",
    etaLabel: "Planirana isporuka",
    timeline: "Proizvodni tok",
    updates: "Podeljene beleške",
    noUpdates: "Beleške će se pojaviti čim ih atelje objavi.",
    shareLink: "Link za deljenje",
    shareHint: "Kopiraj link i pošalji porodici ili prijateljima.",
    shareMissing: "Zatraži od concierge tima da aktivira deljenje za ovu porudžbinu.",
    privacyNotice: "Stranica je privatna. Samo osobe sa linkom mogu da je vide.",
    ownerActions: "Otvori portal",
    notFoundTitle: "Ova stranica napretka nije dostupna.",
    notFoundDescription:
      "Link je možda istekao ili je deaktiviran. Zatraži novi link od concierge tima.",
    loading: "Učitavamo napredak…",
    copy: "Kopiraj",
    copied: "Kopirano",
  },
} as const;

type ShareCopy = (typeof SHARE_COPY)[keyof typeof SHARE_COPY];

const STAGE_OPTIONS = [
  { value: "configuration_submitted", label: { en: "Configuration submitted", sr: "Konfiguracija poslata" } },
  { value: "pattern_drafting", label: { en: "Pattern drafting", sr: "Izrada kroja" } },
  { value: "cutting_prepping", label: { en: "Cutting & prepping", sr: "Kroj i priprema" } },
  { value: "sewing_detailing", label: { en: "Sewing & detailing", sr: "Šivenje i detalji" } },
  { value: "quality_check", label: { en: "Quality check", sr: "Kontrola kvaliteta" } },
  { value: "packaging", label: { en: "Packaging & ship", sr: "Pakovanje i slanje" } },
  { value: "delivered", label: { en: "Delivered", sr: "Isporučeno" } },
] as const;

type TimelineEntry = {
  label: string;
  completed: boolean;
  completedAt?: number;
};

type ProgressUpdate = {
  id: string;
  title: string;
  message: string;
  timelineLabel?: string;
  createdAt: number;
  sharedAt?: number;
};

type ShareSnapshot = {
  orderCode: string;
  dressModel: string;
  color: string;
  fabric: string;
  status: string;
  stage: string;
  eta?: number;
  productionTimeline?: TimelineEntry[];
  progressUpdates?: ProgressUpdate[];
  shareKey?: string | null;
  client?: { name?: string | null };
  updatedAt: number;
};

function SharePageContent() {
  const params = useParams<{ orderCode: string }>();
  const searchParams = useSearchParams();
  const sessionToken = useSessionToken();
  const { language } = useLanguage();
  const copy = SHARE_COPY[language];

  const orderCodeParam = params?.orderCode;
  const orderCode = Array.isArray(orderCodeParam) ? orderCodeParam[0] : orderCodeParam;
  const shareKeyParam = searchParams.get("key") ?? undefined;

  const snapshot = useConvexQuery(
    "orders:shareSnapshot",
    orderCode
      ? {
          orderCode,
          shareKey: shareKeyParam,
          sessionToken: sessionToken ?? undefined,
        }
      : undefined,
  ) as ShareSnapshot | null | undefined;

  const viewingPublic = Boolean(shareKeyParam);
  const shareUrl = useMemo(() => {
    if (!snapshot) return null;
    const key = viewingPublic ? shareKeyParam : snapshot.shareKey;
    if (!key) return null;
    if (typeof window === "undefined") return null;
    return `${window.location.origin}/orders/${snapshot.orderCode}/share?key=${key}`;
  }, [snapshot, shareKeyParam, viewingPublic]);

  if (!orderCode) {
    return <NotFoundState copy={copy} />;
  }

  if (snapshot === undefined) {
    return <LoadingState message={copy.loading} />;
  }

  if (snapshot === null) {
    return <NotFoundState copy={copy} />;
  }

  const sharedUpdates = (snapshot.progressUpdates ?? [])
    .filter((update) => update.sharedAt || !viewingPublic)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Badge variant="outline" className="uppercase tracking-[0.35em]">
          {copy.badge}
        </Badge>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <Card className="border-border/40 bg-background/85">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-foreground/55">
            <Share2 className="h-4 w-4" />
            {snapshot.orderCode}
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              {copy.title(snapshot.client?.name)}
            </h1>
            <p className="text-sm text-foreground/60">{copy.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
            <Package className="h-4 w-4" />
            <span>{stageLabel(snapshot.stage, language)}</span>
            {snapshot.eta ? (
              <>
                <span>•</span>
                <Calendar className="h-4 w-4" />
                <span>
                  {copy.etaLabel}: {new Date(snapshot.eta).toLocaleDateString(language === "sr" ? "sr-RS" : "en-US")}
                </span>
              </>
            ) : null}
          </div>
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">
            {copy.privacyNotice}
          </p>
        </CardHeader>
      </Card>

      <Card className="border-border/40 bg-background/85">
        <CardHeader className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/55">
            {copy.timeline}
          </h2>
        </CardHeader>
        <CardContent className="space-y-3 pb-6">
          {(snapshot.productionTimeline ?? []).map((step) => (
            <TimelineRow key={step.label} step={step} />
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-background/85">
        <CardHeader className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/55">
            {copy.updates}
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {sharedUpdates.length === 0 ? (
            <p className="text-sm text-foreground/60">{copy.noUpdates}</p>
          ) : (
            sharedUpdates.map((update) => (
              <div
                key={update.id}
                className="space-y-2 rounded-2xl border border-border/40 bg-background/75 p-4 text-sm text-foreground/70"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/55">
                  <span>{new Date(update.createdAt).toLocaleDateString(language === "sr" ? "sr-RS" : "en-US")}</span>
                  {update.timelineLabel ? <span>{update.timelineLabel}</span> : null}
                </div>
                <p className="text-base font-semibold text-foreground">{update.title}</p>
                <p>{update.message}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {!viewingPublic ? (
        <ShareOwnerPanel
          shareUrl={shareUrl}
          missingMessage={copy.shareMissing}
          label={copy.shareLink}
          hint={copy.shareHint}
          copyLabel={copy.copy}
          copiedLabel={copy.copied}
          actionLabel={copy.ownerActions}
        />
      ) : null}
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-foreground/70">Loading share...</div>}>
      <SharePageContent />
    </Suspense>
  );
}

function ShareOwnerPanel({
  shareUrl,
  missingMessage,
  label,
  hint,
  copyLabel,
  copiedLabel,
  actionLabel,
}: {
  shareUrl: string | null;
  missingMessage: string;
  label: string;
  hint: string;
  copyLabel: string;
  copiedLabel: string;
  actionLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card className="border-border/40 bg-background/85">
      <CardHeader className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/55">
          {label}
        </h2>
        <p className="text-sm text-foreground/60">{hint}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-6">
        {shareUrl ? (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/40 bg-background/70 p-4 text-sm text-foreground/70">
            <span className="flex-1 break-all">{shareUrl}</span>
            <Button size="sm" variant="ghost" className="rounded-full px-4" onClick={handleCopy}>
              {copied ? copiedLabel : copyLabel}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-foreground/60">{missingMessage}</p>
        )}
        <Button asChild variant="ghost" size="sm" className="w-fit rounded-full border border-border/60">
          <Link href="/portal">{actionLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function TimelineRow({ step }: { step: TimelineEntry }) {
  return (
    <div className="flex items-center gap-3 text-sm text-foreground/70">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
          step.completed
            ? "border-emerald-200 bg-emerald-100/80 text-emerald-700"
            : "border-border/60 text-foreground/50"
        }`}
      >
        {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
      </span>
      <span className="flex-1">{step.label}</span>
      <span className="text-xs text-foreground/50">
        {step.completed && step.completedAt
          ? new Date(step.completedAt).toLocaleDateString()
          : ""}
      </span>
    </div>
  );
}

function stageLabel(stage: string, language: "en" | "sr") {
  const match = STAGE_OPTIONS.find((option) => option.value === stage);
  return match ? match.label[language] : stage;
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-foreground/70" />
      <p className="text-sm text-foreground/60">{message}</p>
    </div>
  );
}

function NotFoundState({ copy }: { copy: ShareCopy }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Badge variant="outline" className="uppercase tracking-[0.35em]">
        {copy.badge}
      </Badge>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{copy.notFoundTitle}</h1>
        <p className="text-sm text-foreground/60">{copy.notFoundDescription}</p>
      </div>
      <Button asChild>
        <Link href="/portal">{copy.ownerActions}</Link>
      </Button>
    </div>
  );
}
