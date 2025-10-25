"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Package,
  Ruler,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { useLanguage, type Language } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSessionToken } from "@/hooks/use-session-token";
import { clearSessionToken } from "@/lib/auth-storage";
import { useConvexMutation, useConvexQuery } from "@/lib/convex-client";
import { getErrorMessage } from "@/lib/error";

type TimelineEntry = {
  label: string;
  completed: boolean;
  completedAt?: number | null;
};

type ProgressNote = {
  id: string;
  title: string;
  message: string;
  timelineLabel?: string;
  createdAt: number;
  sharedAt?: number;
};

type DashboardOrder = {
  id: string;
  orderCode: string;
  dressModel: string;
  color: string;
  fabric: string;
  stage: string;
  status?: string;
  eta?: number;
  etaLabel?: string;
  productionTimeline?: TimelineEntry[];
  progressUpdates?: ProgressNote[];
  shareKey?: string | null;
};

type DashboardProfile = {
  id: string;
  label: string;
  bust: number;
  waist: number;
  hips: number;
  height: number;
  heel: number;
  notes?: string;
  updatedAt?: number;
  lastUpdatedLabel?: string;
};

type DashboardRequest = {
  id: string;
  message: string;
  status: string;
  preferredContact?: string;
  timeWindow?: string;
  createdAt: number;
};

type DashboardInspiration = {
  id: string;
  title: string;
  description: string;
  url: string;
};

type DashboardData = {
  user: { id: string; name: string; role: string; email: string; phone?: string | null };
  orders: DashboardOrder[];
  measurementProfiles: DashboardProfile[];
  conciergeRequests: DashboardRequest[];
  inspirations: DashboardInspiration[];
};

const PORTAL_DATE_LOCALE: Record<Language, string> = {
  en: "en-US",
  sr: "sr-RS",
};

type PortalCopy = {
  badge: string;
  welcome: (name: string) => string;
  tagline: string;
  nav: {
    home: string;
    signOut: string;
  };
  tracker: {
    label: string;
    heading: string;
    completion: string;
    notify: string;
  };
  orders: {
    latestUpdate: string;
    deliveryEtaPrefix: string;
    awaitingEta: string;
    viewNotes: string;
    shareProgress: string;
    timelineLabels: Record<string, string>;
    stageLabels: Record<string, string>;
  };
  measurements: {
    label: string;
    addNew: string;
    saveFromPortal: string;
    emptyTitle: string;
    emptyBody: string;
    createFirst: string;
    metrics: {
      bust: string;
      waist: string;
      hips: string;
      heel: string;
    };
    viewProfile: string;
    awaitingUse: string;
    updatedPrefix: string;
  };
  inspirations: {
    label: string;
    heading: string;
    explore: string;
  };
  concierge: {
    label: string;
    heading: string;
    messageLabel: string;
    messageHelper: string;
    messagePlaceholder: string;
    responseTime: string;
    contactLabel: string;
    contactHelper: string;
    contactPlaceholder: string;
    timeframeLabel: string;
    timeframeHelper: string;
    timeframePlaceholder: string;
    submitting: string;
    submit: string;
    supportTag: string;
    recentRequests: string;
    windowPrefix: string;
    contactPrefix: string;
    validationMessage: string;
    successMessage: string;
    errorFallback: string;
  };
};

const PORTAL_COPY: Record<Language, PortalCopy> = {
  en: {
    badge: "portal",
    welcome: (name) => `Welcome back, ${name}.`,
    tagline: "Tailored insights, live production updates, and the atelier at your fingertips.",
    nav: {
      home: "Home",
      signOut: "Sign out",
    },
    tracker: {
      label: "production tracker",
      heading: "Atelier crafting in progress.",
      completion: "production completion",
      notify: "We will notify you once your dress enters quality control.",
    },
    orders: {
      latestUpdate: "Latest update",
      deliveryEtaPrefix: "Delivery ETA",
      awaitingEta: "Awaiting ETA",
      viewNotes: "View atelier notes",
      shareProgress: "Share progress",
      timelineLabels: {
        "Pattern drafting": "Pattern drafting",
        "Cutting & prepping": "Cutting & prepping",
        "Sewing & detailing": "Sewing & detailing",
        "Quality check": "Quality check",
        Packaging: "Packaging",
      },
      stageLabels: {
        "Pattern drafting": "Pattern drafting",
        "Cutting & prepping": "Cutting & prepping",
        "Sewing & detailing": "Sewing & detailing",
        "Quality check": "Quality check",
        Packaging: "Packaging",
      },
    },
    measurements: {
      label: "measurement profiles",
      addNew: "Add new profile",
      saveFromPortal: "Save portal form as profile",
      emptyTitle: "No profiles yet",
      emptyBody: "Capture measurements once and reuse them for every order.",
      createFirst: "Create your first profile",
      metrics: {
        bust: "Bust",
        waist: "Waist",
        hips: "Hips",
        heel: "Heel",
      },
      viewProfile: "View profile",
      awaitingUse: "Awaiting use",
      updatedPrefix: "Updated",
    },
    inspirations: {
      label: "atelier perks",
      heading: "Stay inspired between fittings.",
      explore: "Explore",
    },
    concierge: {
      label: "atelier concierge",
      heading: "Ask a stylist or request an alteration slot.",
      messageLabel: "Message",
      messageHelper: "Share the occasion, the fit concern, or the styling guidance you need.",
      messagePlaceholder:
        "Need advice on styling Solenne for a winter ceremony or request a rush hem adjustment.",
      responseTime: "Our stylists respond within one business day.",
      contactLabel: "Preferred contact",
      contactHelper: "Where should we follow up? WhatsApp, email, or phone all work.",
      contactPlaceholder: "WhatsApp +381 XX XXX",
      timeframeLabel: "Ideal timeframe",
      timeframeHelper: "Let us know the best moment to reach you.",
      timeframePlaceholder: "This weekend / After 6pm",
      submitting: "Sending",
      submit: "Send request",
      supportTag: "concierge support",
      recentRequests: "Recent requests",
      windowPrefix: "Window",
      contactPrefix: "Contact",
      validationMessage: "Please add a short message for your concierge team.",
      successMessage: "Request sent. A stylist will reach out shortly.",
      errorFallback: "We couldn't send your request. Try again.",
    },
  },
  sr: {
    badge: "portal",
    welcome: (name) => `Dobrodošli nazad, ${name}.`,
    tagline: "Personalizovani uvidi, praćenje proizvodnje uživo i atelje na dohvat ruke.",
    nav: {
      home: "Početna",
      signOut: "Odjavi se",
    },
    tracker: {
      label: "praćenje proizvodnje",
      heading: "Atelje trenutno radi na vašoj haljini.",
      completion: "završetak proizvodnje",
      notify: "Obavestićemo vas kada vaša haljina uđe u kontrolu kvaliteta.",
    },
    orders: {
      latestUpdate: "Poslednje ažuriranje",
      deliveryEtaPrefix: "Planirana isporuka",
      awaitingEta: "Čekamo potvrdu datuma",
      viewNotes: "Atelje beleške",
      shareProgress: "Podeli napredak",
      timelineLabels: {
        "Pattern drafting": "Izrada kroja",
        "Cutting & prepping": "Krojenje i priprema",
        "Sewing & detailing": "Šivenje i detalji",
        "Quality check": "Kontrola kvaliteta",
        Packaging: "Pakovanje",
      },
      stageLabels: {
        "Pattern drafting": "Izrada kroja",
        "Cutting & prepping": "Krojenje i priprema",
        "Sewing & detailing": "Šivenje i detalji",
        "Quality check": "Kontrola kvaliteta",
        Packaging: "Pakovanje",
      },
    },
    measurements: {
      label: "profili mera",
      addNew: "Dodaj novi profil",
      saveFromPortal: "Sacuvaj portal formu kao profil",
      emptyTitle: "Jos nema profila",
      emptyBody: "Unesi mere jednom i koristi ih za svaku buducu porudzbinu.",
      createFirst: "Kreiraj prvi profil",
      metrics: {
        bust: "Grudi",
        waist: "Struk",
        hips: "Kukovi",
        heel: "Štikla",
      },
      viewProfile: "Prikaži profil",
      awaitingUse: "Čeka prvu upotrebu",
      updatedPrefix: "Ažurirano",
    },
    inspirations: {
      label: "atelje pogodnosti",
      heading: "Ostanite inspirisani između proba.",
      explore: "Istraži",
    },
    concierge: {
      label: "atelje concierge",
      heading: "Postavite pitanje stilisti ili rezervišite termin za prepravke.",
      messageLabel: "Poruka",
      messageHelper: "Podelite priliku, fit izazov ili smernice koje su vam potrebne.",
      messagePlaceholder: "Treba vam savet za Solenne zimi ili hitno skraćivanje poruba?",
      responseTime: "Naši stilisti odgovaraju u roku od jednog radnog dana.",
      contactLabel: "Preferirani kontakt",
      contactHelper: "Kako da vas kontaktiramo? WhatsApp, email ili telefon.",
      contactPlaceholder: "WhatsApp +381 XX XXX",
      timeframeLabel: "Idealno vreme",
      timeframeHelper: "Navedite kada vam najviše odgovara da vas pozovemo.",
      timeframePlaceholder: "Ovaj vikend / Posle 18h",
      submitting: "Slanje",
      submit: "Pošalji zahtev",
      supportTag: "atelje podrška",
      recentRequests: "Skorašnji zahtevi",
      windowPrefix: "Termin",
      contactPrefix: "Kontakt",
      validationMessage: "Dodajte kratku poruku za concierge tim.",
      successMessage: "Zahtev je poslat. Stilista će vam se uskoro javiti.",
      errorFallback: "Nismo uspeli da pošaljemo zahtev. Pokušajte ponovo.",
    },
  },
};

const PORTAL_FALLBACKS: Record<Language, { orders: DashboardOrder[]; profiles: DashboardProfile[]; inspirations: DashboardInspiration[] }> =
  {
    en: {
      orders: [
        {
          id: "OR-1027",
          orderCode: "OR-1027",
          dressModel: "Noor",
          color: "Slate Grey",
          fabric: "Stretch Crepe",
          stage: "Sewing & detailing",
          etaLabel: "Delivery ETA - 12 Dec",
          productionTimeline: [
            { label: "Pattern drafting", completed: true },
            { label: "Cutting & prepping", completed: true },
            { label: "Sewing & detailing", completed: false },
            { label: "Quality check", completed: false },
            { label: "Packaging", completed: false },
          ],
        },
        {
          id: "OR-1028",
          orderCode: "OR-1028",
          dressModel: "Solenne",
          color: "Opal",
          fabric: "Illusion Tulle",
          stage: "Cutting & prepping",
          etaLabel: "Delivery ETA - 18 Dec",
          productionTimeline: [
            { label: "Pattern drafting", completed: true },
            { label: "Cutting & prepping", completed: false },
            { label: "Sewing & detailing", completed: false },
            { label: "Quality check", completed: false },
            { label: "Packaging", completed: false },
          ],
        },
      ],
      profiles: [],
      inspirations: [
        {
          id: "insp-1",
          title: "Holiday Capsule - Vara",
          description: "Ruby duchesse satin with detachable overskirt.",
          url: "/lookbook",
        },
        {
          id: "insp-2",
          title: "Fabric spotlight - Luma",
          description: "Pair silk chiffon with pearl palette for airy motion.",
          url: "/lookbook",
        },
        {
          id: "insp-3",
          title: "Care studio - Noor",
          description: "How to steam stretch crepe and keep lines sharp.",
          url: "/guides/care",
        },
      ],
    },
    sr: {
      orders: [
        {
          id: "OR-1027",
          orderCode: "OR-1027",
          dressModel: "Noor",
          color: "Sivo-plava",
          fabric: "Elastični krep",
          stage: "Sewing & detailing",
          etaLabel: "Planirana isporuka - 12. dec",
          productionTimeline: [
            { label: "Pattern drafting", completed: true },
            { label: "Cutting & prepping", completed: true },
            { label: "Sewing & detailing", completed: false },
            { label: "Quality check", completed: false },
            { label: "Packaging", completed: false },
          ],
        },
        {
          id: "OR-1028",
          orderCode: "OR-1028",
          dressModel: "Solenne",
          color: "Opal",
          fabric: "Iluzija tila",
          stage: "Cutting & prepping",
          etaLabel: "Planirana isporuka - 18. dec",
          productionTimeline: [
            { label: "Pattern drafting", completed: true },
            { label: "Cutting & prepping", completed: false },
            { label: "Sewing & detailing", completed: false },
            { label: "Quality check", completed: false },
            { label: "Packaging", completed: false },
          ],
        },
      ],
      profiles: [],
      inspirations: [
        {
          id: "insp-1",
          title: "Praznična kapsula - Vara",
          description: "Rubin saten dušes sa odvojivom suknjom.",
          url: "/lookbook",
        },
        {
          id: "insp-2",
          title: "U fokusu tkanina - Luma",
          description: "Upari svilu šifon sa bisernom paletom za vazdušasti pokret.",
          url: "/lookbook",
        },
        {
          id: "insp-3",
          title: "Studio nege - Noor",
          description: "Kako da parom obradiš elastični krep i zadržiš čiste linije.",
          url: "/guides/care",
        },
      ],
    },
  };

const CONCIERGE_STATUS_LABELS: Record<Language, Record<string, string>> = {
  en: {
    open: "Received",
    in_progress: "In progress",
    closed: "Completed",
  },
  sr: {
    open: "Primljeno",
    in_progress: "U toku",
    closed: "Završeno",
  },
};

const CONCIERGE_STATUS_STYLES: Record<string, string> = {
  open: "border-amber-200 bg-amber-50 text-amber-800",
  in_progress: "border-blue-200 bg-blue-50 text-blue-800",
  closed: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export default function PortalPage() {
  const router = useRouter();
  const sessionToken = useSessionToken();
  const dashboard = useConvexQuery(
    "portal:dashboard",
    sessionToken === null ? { sessionToken: undefined } : { sessionToken },
  ) as DashboardData | null | undefined;
  const signOut = useConvexMutation("auth:signOut");
  const submitConcierge = useConvexMutation("concierge:submit");

  const [conciergeMessage, setConciergeMessage] = useState("");
  const [conciergeContact, setConciergeContact] = useState("");
  const [conciergeWindow, setConciergeWindow] = useState("");
  const [conciergeFeedback, setConciergeFeedback] = useState<string | null>(null);
  const [conciergeFeedbackType, setConciergeFeedbackType] = useState<"success" | "error" | null>(null);
  const [conciergeSubmitting, setConciergeSubmitting] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const { language } = useLanguage();
  const copy = PORTAL_COPY[language];
  const locale = PORTAL_DATE_LOCALE[language];
  const fallbacks = PORTAL_FALLBACKS[language];
  const statusLabels = CONCIERGE_STATUS_LABELS[language];

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!sessionToken) {
      router.replace("/sign-in");
    }
  }, [hasHydrated, sessionToken, router]);

  useEffect(() => {
    if (!dashboard?.user?.phone) return;
    setConciergeContact((current) => current || dashboard.user.phone || "");
  }, [dashboard?.user?.phone]);

  useEffect(() => {
    if (conciergeFeedbackType !== "success") return;
    const timer = window.setTimeout(() => {
      setConciergeFeedback(null);
      setConciergeFeedbackType(null);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [conciergeFeedbackType]);

  const mappedOrders = (dashboard?.orders ?? []).map((order) => ({
    id: order.id,
    orderCode: order.orderCode,
    dressModel: order.dressModel,
    color: order.color,
    fabric: order.fabric,
    stage: order.stage,
    status: order.status,
    etaLabel: order.eta
      ? `${copy.orders.deliveryEtaPrefix} - ${new Date(order.eta).toLocaleDateString(locale, {
          day: "2-digit",
          month: "short",
        })}`
      : copy.orders.awaitingEta,
    productionTimeline: order.productionTimeline ?? [],
    progressUpdates: order.progressUpdates ?? [],
    shareKey: order.shareKey ?? null,
  }));
  const ordersBase = mappedOrders.length > 0 ? mappedOrders : fallbacks.orders;
  const orders = ordersBase.map((order) => ({
    ...order,
    stage: copy.orders.stageLabels[order.stage] ?? order.stage,
    productionTimeline: (order.productionTimeline ?? []).map((step) => ({
      ...step,
      label: copy.orders.timelineLabels[step.label] ?? step.label,
    })),
  }));

  const mappedProfiles = (dashboard?.measurementProfiles ?? []).map((profile) => ({
    id: profile.id,
    label: profile.label,
    bust: profile.bust,
    waist: profile.waist,
    hips: profile.hips,
    height: profile.height,
    heel: profile.heel,
    notes: profile.notes,
    lastUpdatedLabel: profile.updatedAt
      ? `${copy.measurements.updatedPrefix} ${new Date(profile.updatedAt).toLocaleDateString(locale)}`
      : copy.measurements.awaitingUse,
  }));
  const measurementProfiles = mappedProfiles;
  const hasMeasurementProfiles = measurementProfiles.length > 0;

  const inspirations = (dashboard?.inspirations ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    url: item.url,
  }));
  const inspirationsToShow = inspirations.length > 0 ? inspirations : fallbacks.inspirations;

  const conciergeRequests = dashboard?.conciergeRequests ?? [];
  const conciergeRequestsDisplay = conciergeRequests.map((request) => ({
    ...request,
    statusLabel: statusLabels[request.status] ?? request.status,
    statusTone:
      CONCIERGE_STATUS_STYLES[request.status] ??
      "border-border/40 bg-background/80 text-foreground/70",
    createdAtLabel: new Date(request.createdAt).toLocaleDateString(locale),
  }));
  const conciergeMessageLimit = 480;

  useEffect(() => {
    if (dashboard?.user?.role === "admin") {
      router.replace("/admin");
    }
  }, [dashboard?.user?.role, router]);

  const progress = useMemo(() => {
    const steps = orders.flatMap((order) => order.productionTimeline);
    if (steps.length === 0) return 0;
    const completed = steps.filter((step) => step.completed).length;
    return Math.round((completed / steps.length) * 100);
  }, [orders]);

  const userName = dashboard?.user?.name ?? "Jovana";

  async function handleSignOut() {
    try {
      if (sessionToken) {
        await signOut({ sessionToken });
      }
    } catch (error) {
      console.error("Sign out error", error);
    } finally {
      clearSessionToken();
      window.location.href = "/sign-in";
    }
  }

  function handlePortalProfileSave() {
    router.push("/profiles/new?source=portal");
  }

  async function handleConciergeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConciergeFeedback(null);
    setConciergeFeedbackType(null);
    if (!conciergeMessage.trim()) {
      setConciergeFeedback(copy.concierge.validationMessage);
      setConciergeFeedbackType("error");
      return;
    }
    setConciergeSubmitting(true);
    try {
      await submitConcierge({
        sessionToken: sessionToken ?? undefined,
        message: conciergeMessage.trim(),
        preferredContact: conciergeContact || undefined,
        timeWindow: conciergeWindow || undefined,
      });
      setConciergeMessage("");
      setConciergeWindow("");
      setConciergeFeedback(copy.concierge.successMessage);
      setConciergeFeedbackType("success");
    } catch (error) {
      setConciergeFeedback(getErrorMessage(error, copy.concierge.errorFallback));
      setConciergeFeedbackType("error");
    } finally {
      setConciergeSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-14 sm:gap-12 sm:px-6 sm:pt-16 sm:pb-24">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Badge className="uppercase tracking-[0.35em]">{copy.badge}</Badge>
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {copy.welcome(userName)}
            </h1>
            <p className="text-sm text-foreground/70">
              {copy.tagline}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-full rounded-full border border-border/60 sm:w-auto"
            >
              <Link href="/">{copy.nav.home}</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full rounded-full border border-border/60 sm:w-auto"
              onClick={handleSignOut}
            >
              {copy.nav.signOut}
            </Button>
          </div>
        </div>
      </header>

      <motion.section
        className="grid gap-6 rounded-[24px] border border-border/40 bg-background/80 p-6 sm:gap-8 sm:p-8 md:grid-cols-[1fr_0.8fr]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-foreground/50">
              <ClipboardList className="h-4 w-4" />
              {copy.tracker.label}
            </div>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {copy.tracker.heading}
            </h2>
            <div className="space-y-2 rounded-[20px] border border-border/40 bg-background/80 p-5 text-sm text-foreground/70">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.28em] text-foreground/55">
                  {copy.tracker.completion}
                </span>
                <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-foreground">
                  {progress}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-foreground/80 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p>{copy.tracker.notify}</p>
            </div>
          </div>

          <div className="space-y-6">
            {orders.map((order) => {
              const sharedUpdates = (order.progressUpdates ?? [])
                .filter((update) => update.sharedAt)
                .sort((a, b) => b.createdAt - a.createdAt);
              const latestSharedUpdate = sharedUpdates[0];

              return (
                <Card key={order.id} className="border-border/40 bg-background/85">
                <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">{order.orderCode}</p>
                    <h3 className="text-lg font-semibold text-foreground">
                      {order.dressModel} - {order.color}
                    </h3>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Package className="h-4 w-4" />
                    {order.stage}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
                    <Truck className="h-4 w-4" />
                    {order.etaLabel}
                  </div>
                  {latestSharedUpdate ? (
                    <div className="space-y-1 rounded-2xl border border-border/40 bg-background/75 p-4 text-sm text-foreground/70">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/55">
                        <span>{copy.orders.latestUpdate}</span>
                        <span>
                          {new Date(latestSharedUpdate.createdAt).toLocaleDateString(locale)}
                        </span>
                      </div>
                      <p className="text-base font-semibold text-foreground">{latestSharedUpdate.title}</p>
                      <p>{latestSharedUpdate.message}</p>
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    {order.productionTimeline.map((step) => (
                      <div key={step.label} className="flex items-center gap-3 text-sm">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                            step.completed
                              ? "border-emerald-200 bg-emerald-100/80 text-emerald-700"
                              : "border-border/60 text-foreground/50"
                          }`}
                        >
                          {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <BadgeCheck className="h-4 w-4" />}
                        </span>
                        <span className={`tracking-wide ${step.completed ? "text-foreground/80" : "text-foreground/55"}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 pt-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                  <Button asChild size="sm" variant="ghost" className="w-full sm:w-auto">
                    <Link href={`/orders/${order.orderCode}`}>{copy.orders.viewNotes}</Link>
                  </Button>
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href={`/orders/${order.orderCode}/share`}>
                      {copy.orders.shareProgress}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border/40 bg-background/85">
            <CardHeader>
              <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.3em] text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
                <span>{copy.measurements.label}</span>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full rounded-full px-3 py-1 sm:w-auto"
                    onClick={handlePortalProfileSave}
                  >
                    {copy.measurements.saveFromPortal}
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="w-full rounded-full px-3 py-1 sm:w-auto">
                    <Link href="/profiles/new">{copy.measurements.addNew}</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasMeasurementProfiles ? (
                measurementProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-background/80 p-4 text-sm text-foreground/70"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-semibold text-foreground">{profile.label}</h4>
                        <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">
                          {profile.lastUpdatedLabel}
                        </p>
                      </div>
                      <Ruler className="h-4 w-4 text-foreground/60" />
                    </div>
                    <div className="grid gap-3 text-xs uppercase tracking-[0.22em] text-foreground/55 sm:grid-cols-2">
                      <span>
                        {copy.measurements.metrics.bust} - <strong className="ml-1 text-foreground/80">{profile.bust} cm</strong>
                      </span>
                      <span>
                        {copy.measurements.metrics.waist} -{" "}
                        <strong className="ml-1 text-foreground/80">{profile.waist} cm</strong>
                      </span>
                      <span>
                        {copy.measurements.metrics.hips} -{" "}
                        <strong className="ml-1 text-foreground/80">{profile.hips} cm</strong>
                      </span>
                      <span>
                        {copy.measurements.metrics.heel} -{" "}
                        <strong className="ml-1 text-foreground/80">{profile.heel} cm</strong>
                      </span>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                      <Link href={`/profiles/${profile.id}`}>{copy.measurements.viewProfile}</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-background/80 p-6 text-center text-sm text-foreground/70">
                  <div className="space-y-2">
                    <h4 className="text-base font-semibold text-foreground">{copy.measurements.emptyTitle}</h4>
                    <p>{copy.measurements.emptyBody}</p>
                  </div>
                  <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href="/profiles/new">{copy.measurements.createFirst}</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* <Card className="border-border/40 bg-background/85">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/55">
                <Sparkles className="h-4 w-4" />
                {copy.inspirations.label}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{copy.inspirations.heading}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {inspirationsToShow.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/40 bg-background/80 p-4 text-sm text-foreground/70"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-foreground">{item.title}</h4>
                    <Star className="h-4 w-4 text-foreground/60" />
                  </div>
                  <p className="mt-2">{item.description}</p>
                  <Button asChild variant="ghost" size="sm" className="mt-3 w-full sm:w-auto">
                    <Link href={item.url}>
                      {copy.inspirations.explore}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card> */}

          <Card className="border-border/40 bg-background/85">
            <CardHeader>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/55">
                <Sparkles className="h-4 w-4" />
                {copy.concierge.label}
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {copy.concierge.heading}
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-5" onSubmit={handleConciergeSubmit}>
                <div className="grid gap-3">
                  <Label
                    htmlFor="concierge-message"
                    helper={copy.concierge.messageHelper}
                  >
                    {copy.concierge.messageLabel}
                  </Label>
                  <Textarea
                    id="concierge-message"
                    value={conciergeMessage}
                    onChange={(event) => setConciergeMessage(event.target.value)}
                    placeholder={copy.concierge.messagePlaceholder}
                    maxLength={conciergeMessageLimit}
                    className="min-h-[120px]"
                  />
                  <div className="flex items-center justify-between text-xs text-foreground/55">
                    <span>{copy.concierge.responseTime}</span>
                    <span>
                      {conciergeMessage.length}/{conciergeMessageLimit}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="concierge-contact"
                      helper={copy.concierge.contactHelper}
                    >
                      {copy.concierge.contactLabel}
                    </Label>
                    <Input
                      id="concierge-contact"
                      value={conciergeContact}
                      onChange={(event) => setConciergeContact(event.target.value)}
                      placeholder={copy.concierge.contactPlaceholder}
                      autoComplete="tel"
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="concierge-window"
                      helper={copy.concierge.timeframeHelper}
                    >
                      {copy.concierge.timeframeLabel}
                    </Label>
                    <Input
                      id="concierge-window"
                      value={conciergeWindow}
                      onChange={(event) => setConciergeWindow(event.target.value)}
                      placeholder={copy.concierge.timeframePlaceholder}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                {conciergeFeedback ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-xs ${
                      conciergeFeedbackType === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {conciergeFeedback}
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Button
                    type="submit"
                    disabled={conciergeSubmitting || conciergeMessage.trim().length === 0}
                    className="rounded-full px-6"
                  >
                    {conciergeSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {copy.concierge.submitting}
                      </>
                    ) : (
                      <>
                        {copy.concierge.submit}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <span className="text-xs uppercase tracking-[0.28em] text-foreground/50">
                    {copy.concierge.supportTag}
                  </span>
                </div>
              </form>

              {conciergeRequestsDisplay.length > 0 ? (
                <div className="space-y-3 rounded-2xl border border-border/40 bg-background/70 p-4 text-xs text-foreground/60">
                  <p className="uppercase tracking-[0.28em] text-foreground/50">
                    {copy.concierge.recentRequests}
                  </p>
                  <ul className="space-y-3">
                    {conciergeRequestsDisplay.slice(0, 3).map((request) => (
                      <li
                        key={request.id}
                        className="space-y-2 rounded-2xl border border-border/35 bg-background/90 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="line-clamp-2 text-left text-foreground/70">{request.message}</span>
                          <span
                            className={`whitespace-nowrap rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] ${request.statusTone}`}
                          >
                            {request.statusLabel}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.65rem] uppercase tracking-[0.25em] text-foreground/50">
                          <span>{request.createdAtLabel}</span>
                          {request.timeWindow ? (
                            <span>
                              {copy.concierge.windowPrefix}: {request.timeWindow}
                            </span>
                          ) : null}
                          {request.preferredContact ? (
                            <span>
                              {copy.concierge.contactPrefix}: {request.preferredContact}
                            </span>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}




