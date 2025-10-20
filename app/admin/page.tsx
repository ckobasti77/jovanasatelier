"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Share2,
  Users,
} from "lucide-react";

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSessionToken } from "@/hooks/use-session-token";
import { clearSessionToken } from "@/lib/auth-storage";
import { useConvexMutation, useConvexQuery } from "@/lib/convex-client";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";

const ADMIN_COPY = {
  en: {
    badge: "admin console",
    title: "Atelier operations overview.",
    description:
      "Monitor clients, orders, concierge requests, and inspiration content at a glance.",
    metrics: {
      clients: {
        title: "Clients",
        rows: {
          total: "Registered users",
          admins: "Admins",
        },
      },
      orders: {
        title: "Orders",
        rows: {
          total: "Total orders",
          active: "Active orders",
          completed: "Completed orders",
        },
      },
      concierge: {
        title: "Concierge",
        rows: {
          open: "Open requests",
        },
      },
      inspirations: {
        title: "Inspirations",
        rows: {
          published: "Published drafts",
        },
      },
    },
    sections: {
      concierge: {
        title: "Concierge desk",
        description: "Triage white-glove requests and confirm next touchpoints.",
        empty: "No concierge requests yet.",
        statuses: {
          open: "Open",
          in_progress: "In progress",
          closed: "Closed",
        },
        moveTo: "Set status",
      },
      production: {
        title: "Production tracker",
        description: "Update atelier stages and publish progress notes for clients.",
        statusLabel: "Order status",
        stageLabel: "Production stage",
        etaLabel: "Delivery ETA",
        save: "Save production",
        saving: "Saving",
        timelineLabel: "Production timeline",
        shareTitle: "Share progress",
        shareDescription:
          "Compose an update for the client. Mark as published to surface it on the share page.",
        sharePublish: "Publish to client share page",
        shareCta: "Send update",
        shareSending: "Sending",
        shareLinkCta: "Generate share link",
        shareLinkLabel: "Share link",
        shareEmpty: "No public updates yet.",
      },
      updates: {
        title: "Recent progress notes",
        empty: "There are no progress notes yet.",
      },
    },
    guard: {
      signInTitle: "Sign in to access the admin console.",
      signInDescription: "Only atelier staff can work inside this workspace.",
      signInCta: "Go to sign in",
      noAccessTitle: "You need admin permission.",
      noAccessDescription: "Ask your lead to upgrade your account.",
      backHome: "Back to portal",
    },
  },
  sr: {
    badge: "admin konzola",
    title: "Pregled rada ateljea.",
    description:
      "Prati klijente, porudžbine, concierge zahteve i inspiracije iz jednog mesta.",
    metrics: {
      clients: {
        title: "Klijenti",
        rows: {
          total: "Registrovani korisnici",
          admins: "Administratori",
        },
      },
      orders: {
        title: "Porudžbine",
        rows: {
          total: "Ukupno porudžbina",
          active: "Aktivne porudžbine",
          completed: "Završene porudžbine",
        },
      },
      concierge: {
        title: "Concierge",
        rows: {
          open: "Otvoreni zahtevi",
        },
      },
      inspirations: {
        title: "Inspiracije",
        rows: {
          published: "Objavljeni koncepti",
        },
      },
    },
    sections: {
      concierge: {
        title: "Concierge zahtevi",
        description: "Presloži poruke i potvrdi naredne korake sa klijentom.",
        empty: "Nema concierge zahteva.",
        statuses: {
          open: "Otvoreno",
          in_progress: "U radu",
          closed: "Zatvoreno",
        },
        moveTo: "Promeni status",
      },
      production: {
        title: "Proizvodnja",
        description: "Ažuriraj faze izrade i objavi beleške za klijenta.",
        statusLabel: "Status porudžbine",
        stageLabel: "Faza izrade",
        etaLabel: "Planirana isporuka",
        save: "Sačuvaj izmene",
        saving: "Čuvamo",
        timelineLabel: "Proizvodni tok",
        shareTitle: "Podeli napredak",
        shareDescription:
          "Napiši belešku za klijenta. Objavljena beleška će biti vidljiva na share stranici.",
        sharePublish: "Objavi na share stranici",
        shareCta: "Pošalji belešku",
        shareSending: "Šaljemo",
        shareLinkCta: "Generiši link",
        shareLinkLabel: "Link za deljenje",
        shareEmpty: "Još nema javnih beleški.",
      },
      updates: {
        title: "Beleške o napretku",
        empty: "Još nema zabeleženih beleški.",
      },
    },
    guard: {
      signInTitle: "Prijavi se da bi otvorila admin konzolu.",
      signInDescription: "Samo tim ateljea ima pristup ovoj sekciji.",
      signInCta: "Otvori prijavu",
      noAccessTitle: "Potrebna je admin dozvola.",
      noAccessDescription: "Kontaktiraj lead člana tima kako bi dobila pristup.",
      backHome: "Nazad u portal",
    },
  },
} as const;

type AdminCopy = (typeof ADMIN_COPY)[keyof typeof ADMIN_COPY];

const ORDER_STATUS_OPTIONS = [
  {
    value: "pending",
    label: { en: "Pending", sr: "Na čekanju" },
  },
  {
    value: "in_production",
    label: { en: "In production", sr: "U izradi" },
  },
  {
    value: "completed",
    label: { en: "Completed", sr: "Završeno" },
  },
] as const;

const ORDER_STAGE_OPTIONS = [
  {
    value: "configuration_submitted",
    label: { en: "Configuration submitted", sr: "Konfiguracija poslata" },
  },
  {
    value: "pattern_drafting",
    label: { en: "Pattern drafting", sr: "Izrada kroja" },
  },
  {
    value: "cutting_prepping",
    label: { en: "Cutting & prepping", sr: "Kroj i priprema" },
  },
  {
    value: "sewing_detailing",
    label: { en: "Sewing & detailing", sr: "Šivenje i detalji" },
  },
  {
    value: "quality_check",
    label: { en: "Quality check", sr: "Kontrola kvaliteta" },
  },
  {
    value: "packaging",
    label: { en: "Packaging & ship", sr: "Pakovanje i slanje" },
  },
  {
    value: "delivered",
    label: { en: "Delivered", sr: "Isporučeno" },
  },
] as const;

type ViewerData = {
  user: { id: string; role: string; name: string; email: string };
};

type AdminOverview = {
  users: number;
  admins: number;
  orders: { total: number; active: number; completed: number };
  conciergeOpen: number;
  inspirationsPublished: number;
};

type TimelineEntry = { label: string; completed: boolean; completedAt?: number };

type ProgressUpdate = {
  id: string;
  title: string;
  message: string;
  timelineLabel?: string;
  createdAt: number;
  sharedAt?: number;
};

type AdminOrder = {
  id: string;
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
  createdAt: number;
  updatedAt: number;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
};

type ConciergeRequest = {
  id: string;
  message: string;
  preferredContact?: string | null;
  timeWindow?: string | null;
  status: "open" | "in_progress" | "closed";
  createdAt: number;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
};

type ShareMutationResult = {
  progressUpdates: ProgressUpdate[];
  shareKey?: string | null;
};

export default function AdminPage() {
  const router = useRouter();
  const sessionToken = useSessionToken();
  const { language } = useLanguage();
  const copy = ADMIN_COPY[language];

  const args = useMemo(
    () => (sessionToken ? { sessionToken } : undefined),
    [sessionToken],
  );

  const viewer = useConvexQuery("session:viewer", args) as ViewerData | null | undefined;
  const overview = useConvexQuery("admin:overview", args) as AdminOverview | undefined;
  const orders = useConvexQuery("admin:orders", args) as AdminOrder[] | undefined;
  const conciergeBoard = useConvexQuery("admin:concierge", args) as ConciergeRequest[] | undefined;

  const signOut = useConvexMutation("auth:signOut");
  const updateProduction = useConvexMutation("admin:updateProduction");
  const ensureShareKey = useConvexMutation("admin:ensureShareKey");
  const recordProgressUpdate = useConvexMutation("admin:recordProgressUpdate");
  const updateConciergeStatus = useConvexMutation("concierge:updateStatus");
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!sessionToken) {
      router.replace("/sign-in");
    }
  }, [hasHydrated, sessionToken, router]);

  if (!sessionToken) {
    return <GuardState copy={copy.guard} variant="sign-in" />;
  }

  if (viewer === undefined) {
    return <LoadingState />;
  }

  if (viewer === null) {
    return <GuardState copy={copy.guard} variant="sign-in" />;
  }

  if (viewer.user.role !== "admin") {
    return <GuardState copy={copy.guard} variant="no-access" />;
  }

  if (!overview || !orders || !conciergeBoard) {
    return <LoadingState />;
  }

  const handleUpdateConcierge = async (requestId: string, status: ConciergeRequest["status"]) => {
    await updateConciergeStatus({
      sessionToken,
      requestId,
      status,
    });
  };

  const handleUpdateProduction = async (
    orderId: string,
    payload: { status: string; stage: string; eta?: number; productionTimeline: TimelineEntry[] },
  ) => {
    await updateProduction({
      sessionToken,
      orderId,
      status: payload.status,
      stage: payload.stage,
      eta: payload.eta,
      productionTimeline: payload.productionTimeline.map((step) => ({
        label: step.label,
        completed: step.completed,
        completedAt: step.completedAt,
      })),
    });
  };

  const handleRecordProgress = async (
    orderId: string,
    payload: { title: string; message: string; timelineLabel?: string; publish: boolean },
  ) => {
    const result = (await recordProgressUpdate({
      sessionToken,
      orderId,
      title: payload.title,
      message: payload.message,
      timelineLabel: payload.timelineLabel,
      publish: payload.publish,
    })) as ShareMutationResult;
    return result;
  };

  const handleEnsureShare = async (orderId: string) => {
    const shareKey = (await ensureShareKey({ sessionToken, orderId })) as string;
    return shareKey;
  };

  const handleSignOut = async () => {
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
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <Badge variant="outline" className="uppercase tracking-[0.35em]">
            {copy.badge}
          </Badge>
          <div className="space-y-1">
            <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">{copy.title}</h1>
            <p className="text-sm text-foreground/70">{copy.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full border border-border/60"
          >
            <Link href="/">{language === "sr" ? "Nazad na početnu" : "Back to home"}</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-border/60"
            onClick={handleSignOut}
          >
            {language === "sr" ? "Odjavi se" : "Sign out"}
          </Button>
        </div>
      </header>

      <MetricsRow overview={overview} language={language} />

      <ConciergeSection
        requests={conciergeBoard}
        language={language}
        copy={copy.sections.concierge}
        onUpdateStatus={handleUpdateConcierge}
      />

      <ProductionSection
        orders={orders}
        language={language}
        copy={copy.sections.production}
        updatesCopy={copy.sections.updates}
        onUpdateProduction={handleUpdateProduction}
        onRecordProgress={handleRecordProgress}
        onEnsureShare={handleEnsureShare}
      />
    </div>
  );
}

function GuardState({
  copy,
  variant,
}: {
  copy: AdminCopy["guard"];
  variant: "sign-in" | "no-access";
}) {
  const message =
    variant === "sign-in"
      ? {
          title: copy.signInTitle,
          description: copy.signInDescription,
          cta: copy.signInCta,
          href: "/sign-in",
        }
      : {
          title: copy.noAccessTitle,
          description: copy.noAccessDescription,
          cta: copy.backHome,
          href: "/portal",
        };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Badge variant="outline" className="uppercase tracking-[0.35em]">
        admin
      </Badge>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{message.title}</h2>
        <p className="text-sm text-foreground/70">{message.description}</p>
      </div>
      <Button asChild>
        <Link href={message.href}>{message.cta}</Link>
      </Button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-foreground/70" />
      <p className="text-sm text-foreground/60">Loading atelier data…</p>
    </div>
  );
}

function MetricsRow({ overview, language }: { overview: AdminOverview; language: "en" | "sr" }) {
  const copy = ADMIN_COPY[language].metrics;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <MetricCard
        icon={<Users className="h-5 w-5" />}
        title={copy.clients.title}
        rows={[
          { label: copy.clients.rows.total, value: overview.users },
          { label: copy.clients.rows.admins, value: overview.admins },
        ]}
      />

      <MetricCard
        icon={<ClipboardList className="h-5 w-5" />}
        title={copy.orders.title}
        rows={[
          { label: copy.orders.rows.total, value: overview.orders.total },
          { label: copy.orders.rows.active, value: overview.orders.active },
          { label: copy.orders.rows.completed, value: overview.orders.completed },
        ]}
      />

      <MetricCard
        icon={<ClipboardCheck className="h-5 w-5" />}
        title={copy.concierge.title}
        rows={[{ label: copy.concierge.rows.open, value: overview.conciergeOpen }]}
      />

      <MetricCard
        icon={<BarChart3 className="h-5 w-5" />}
        title={copy.inspirations.title}
        rows={[{ label: copy.inspirations.rows.published, value: overview.inspirationsPublished }]}
      />
    </div>
  );
}

function ConciergeSection({
  requests,
  language,
  copy,
  onUpdateStatus,
}: {
  requests: ConciergeRequest[];
  language: "en" | "sr";
  copy: AdminCopy["sections"]["concierge"];
  onUpdateStatus: (id: string, status: ConciergeRequest["status"]) => Promise<void>;
}) {
  const sorted = useMemo(
    () =>
      [...requests].sort((a, b) => {
        if (a.status === b.status) {
          return b.createdAt - a.createdAt;
        }
        const order: ConciergeRequest["status"][] = ["open", "in_progress", "closed"];
        return order.indexOf(a.status) - order.indexOf(b.status);
      }),
    [requests],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{copy.title}</h2>
          <p className="text-sm text-foreground/60">{copy.description}</p>
        </div>
      </div>
      {sorted.length === 0 ? (
        <Card className="border-border/40 bg-background/85">
          <CardContent className="py-8 text-center text-sm text-foreground/60">
            {copy.empty}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sorted.map((request) => (
            <ConciergeCard
              key={request.id}
              request={request}
              language={language}
              copy={copy}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ConciergeCard({
  request,
  language,
  copy,
  onUpdateStatus,
}: {
  request: ConciergeRequest;
  language: "en" | "sr";
  copy: AdminCopy["sections"]["concierge"];
  onUpdateStatus: (id: string, status: ConciergeRequest["status"]) => Promise<void>;
}) {
  const [updating, setUpdating] = useState<ConciergeRequest["status"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const format = (value: number) =>
    new Date(value).toLocaleString(language === "sr" ? "sr-RS" : "en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  const statusTone: Record<ConciergeRequest["status"], string> = {
    open: "border-amber-200 bg-amber-50 text-amber-800",
    in_progress: "border-blue-200 bg-blue-50 text-blue-800",
    closed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };
  const contactLabel = language === "sr" ? "Preferirani kontakt" : "Preferred contact";
  const windowLabel = language === "sr" ? "Termin" : "Time window";

  const handleClick = async (status: ConciergeRequest["status"]) => {
    if (status === request.status) return;
    try {
      setError(null);
      setUpdating(status);
      await onUpdateStatus(request.id, status);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          language === "sr"
            ? "Promena statusa nije uspela."
            : "Unable to update status.",
        ),
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Card className="border-border/40 bg-background/85">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-foreground/55">
            <MessageCircle className="h-4 w-4" />
            {language === "sr" ? "Concierge zahtev" : "Concierge request"}
          </div>
          <Badge
            variant="outline"
            className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.28em] ${statusTone[request.status]}`}
          >
            {copy.statuses[request.status]}
          </Badge>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            {request.client?.name ?? request.client?.email ?? "Client"}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/60">
            {request.client?.email ? <span>{request.client.email}</span> : null}
            {request.client?.phone ? <span>{request.client.phone}</span> : null}
          </div>
        </div>
        <p className="text-xs text-foreground/55">{format(request.createdAt)}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-foreground/70">
        <p className="rounded-2xl border border-border/40 bg-background/80 p-4 text-left leading-relaxed">
          {request.message}
        </p>
        <div className="space-y-2 text-xs text-foreground/60">
          {request.preferredContact ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-foreground/10 p-1 text-foreground/60">
                {request.preferredContact.includes("@") ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <Phone className="h-4 w-4" />
                )}
              </span>
              <span className="uppercase tracking-[0.28em] text-foreground/55">{contactLabel}</span>
              <span className="font-semibold tracking-normal text-foreground">
                {request.preferredContact}
              </span>
            </div>
          ) : null}
          {request.timeWindow ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-foreground/10 p-1 text-foreground/60">
                <Clock className="h-4 w-4" />
              </span>
              <span className="uppercase tracking-[0.28em] text-foreground/55">{windowLabel}</span>
              <span className="font-semibold tracking-normal text-foreground">
                {request.timeWindow}
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.28em] text-foreground/55">{copy.moveTo}</span>
          <div className="flex flex-wrap gap-2">
            {(
              ["open", "in_progress", "closed"] as readonly ConciergeRequest["status"][]
            ).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={request.status === status ? "primary" : "ghost"}
                className="rounded-full px-4"
                disabled={updating !== null || status === request.status}
                onClick={() => handleClick(status)}
              >
                {updating === status ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  copy.statuses[status]
                )}
              </Button>
            ))}
          </div>
        </div>
        {error ? (
          <p className="text-xs text-rose-600" role="alert">
            {error}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}

function ProductionSection({
  orders,
  language,
  copy,
  updatesCopy,
  onUpdateProduction,
  onRecordProgress,
  onEnsureShare,
}: {
  orders: AdminOrder[];
  language: "en" | "sr";
  copy: AdminCopy["sections"]["production"];
  updatesCopy: AdminCopy["sections"]["updates"];
  onUpdateProduction: (
    orderId: string,
    payload: { status: string; stage: string; eta?: number; productionTimeline: TimelineEntry[] },
  ) => Promise<void>;
  onRecordProgress: (
    orderId: string,
    payload: { title: string; message: string; timelineLabel?: string; publish: boolean },
  ) => Promise<ShareMutationResult>;
  onEnsureShare: (orderId: string) => Promise<string>;
}) {
  const sorted = useMemo(
    () => [...orders].sort((a, b) => b.updatedAt - a.updatedAt),
    [orders],
  );

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{copy.title}</h2>
        <p className="text-sm text-foreground/60">{copy.description}</p>
      </div>
      <div className="space-y-6">
        {sorted.map((order) => (
          <AdminOrderCard
            key={order.id}
            order={order}
            language={language}
            copy={copy}
            updatesCopy={updatesCopy}
            onUpdateProduction={onUpdateProduction}
            onRecordProgress={onRecordProgress}
            onEnsureShare={onEnsureShare}
          />
        ))}
      </div>
    </section>
  );
}

function AdminOrderCard({
  order,
  language,
  copy,
  updatesCopy,
  onUpdateProduction,
  onRecordProgress,
  onEnsureShare,
}: {
  order: AdminOrder;
  language: "en" | "sr";
  copy: AdminCopy["sections"]["production"];
  updatesCopy: AdminCopy["sections"]["updates"];
  onUpdateProduction: (
    orderId: string,
    payload: { status: string; stage: string; eta?: number; productionTimeline: TimelineEntry[] },
  ) => Promise<void>;
  onRecordProgress: (
    orderId: string,
    payload: { title: string; message: string; timelineLabel?: string; publish: boolean },
  ) => Promise<ShareMutationResult>;
  onEnsureShare: (orderId: string) => Promise<string>;
}) {
  const [status, setStatus] = useState(order.status ?? ORDER_STATUS_OPTIONS[0].value);
  const [stage, setStage] = useState(order.stage ?? ORDER_STAGE_OPTIONS[0].value);
  const [etaInput, setEtaInput] = useState(() =>
    order.eta ? new Date(order.eta).toISOString().slice(0, 10) : "",
  );
  const [timeline, setTimeline] = useState<TimelineEntry[]>(
    order.productionTimeline ?? ORDER_STAGE_OPTIONS.slice(1, -1).map((option) => ({
      label: option.label.en,
      completed: false,
    })),
  );
  const [progressTitle, setProgressTitle] = useState("");
  const [progressMessage, setProgressMessage] = useState("");
  const [progressStep, setProgressStep] = useState<string>("");
  const [publishToShare, setPublishToShare] = useState(true);
  const [savingProduction, setSavingProduction] = useState(false);
  const [sendingShare, setSendingShare] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shareKey, setShareKey] = useState<string | null>(order.shareKey ?? null);
  const [generatingLink, setGeneratingLink] = useState(false);

  useEffect(() => {
    setStatus(order.status ?? ORDER_STATUS_OPTIONS[0].value);
  }, [order.status]);

  useEffect(() => {
    setStage(order.stage ?? ORDER_STAGE_OPTIONS[0].value);
  }, [order.stage]);

  useEffect(() => {
    setEtaInput(order.eta ? new Date(order.eta).toISOString().slice(0, 10) : "");
  }, [order.eta]);

  useEffect(() => {
    setTimeline(
      order.productionTimeline && order.productionTimeline.length > 0
        ? order.productionTimeline
        : ORDER_STAGE_OPTIONS.slice(1, -1).map((option) => ({
            label: option.label.en,
            completed: false,
          })),
    );
  }, [order.productionTimeline]);

  useEffect(() => {
    setShareKey(order.shareKey ?? null);
  }, [order.shareKey]);

  const handleToggleStep = (label: string) => {
    setTimeline((prev) => {
      const targetIndex = prev.findIndex((step) => step.label === label);
      if (targetIndex === -1) return prev;

      const shouldComplete = !prev[targetIndex].completed;
      const now = Date.now();

      return prev.map((step, index) => {
        if (index < targetIndex && shouldComplete) {
          return {
            ...step,
            completed: true,
            completedAt: step.completedAt ?? now,
          };
        }

        if (index === targetIndex) {
          return {
            ...step,
            completed: shouldComplete,
            completedAt: shouldComplete ? step.completedAt ?? now : undefined,
          };
        }

        if (!shouldComplete && index > targetIndex) {
          if (!step.completed && !step.completedAt) return step;
          return { ...step, completed: false, completedAt: undefined };
        }

        return step;
      });
    });
  };

  const handleSaveProduction = async () => {
    try {
      setSavingProduction(true);
      const eta = etaInput ? new Date(etaInput).getTime() : undefined;
      await onUpdateProduction(order.id, {
        status,
        stage,
        eta: Number.isNaN(eta) ? undefined : eta,
        productionTimeline: timeline,
      });
      setFeedback(language === "sr" ? "Sačuvano." : "Changes saved.");
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      setFeedback(getErrorMessage(error, language === "sr" ? "Greška pri čuvanju." : "Unable to save changes."));
    } finally {
      setSavingProduction(false);
    }
  };

  const handleShareProgress = async () => {
    if (!progressTitle.trim() || !progressMessage.trim()) {
      setFeedback(language === "sr" ? "Dodaj naslov i poruku." : "Add a title and message first.");
      return;
    }
    try {
      setSendingShare(true);
      const result = await onRecordProgress(order.id, {
        title: progressTitle.trim(),
        message: progressMessage.trim(),
        timelineLabel: progressStep || undefined,
        publish: publishToShare,
      });
      if (result.shareKey) {
        setShareKey(result.shareKey);
      }
      setProgressTitle("");
      setProgressMessage("");
      setProgressStep("");
      setFeedback(language === "sr" ? "Beleška poslata." : "Progress note sent.");
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      setFeedback(
        getErrorMessage(error, language === "sr" ? "Greška pri slanju beleške." : "Unable to send update."),
      );
    } finally {
      setSendingShare(false);
    }
  };

  const handleEnsureShare = async () => {
    try {
      setGeneratingLink(true);
      const key = await onEnsureShare(order.id);
      setShareKey(key);
    } finally {
      setGeneratingLink(false);
    }
  };

  const shareUrl = useMemo(() => {
    if (!shareKey) return null;
    if (typeof window === "undefined") return null;
    return `${window.location.origin}/orders/${order.orderCode}/share?key=${shareKey}`;
  }, [order.orderCode, shareKey]);

  const recentUpdates = (order.progressUpdates ?? [])
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  return (
    <Card className="border-border/40 bg-background/85">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/55">
              <Share2 className="h-4 w-4" />
              {order.orderCode}
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {order.dressModel} · {order.color}
            </h3>
            <p className="text-xs text-foreground/60">
              {order.client?.name ?? order.client?.email ?? "Atelier client"}
            </p>
          </div>
          <Badge variant="outline" className="uppercase tracking-[0.25em]">
            {stageLabel(stage, language)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-3xl border border-border/40 bg-background/80 p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <FieldGroup label={copy.statusLabel}>
                <select
                  className="admin-select w-full rounded-2xl border border-border/40 p-2 text-sm"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {ORDER_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label[language]}
                    </option>
                  ))}
                </select>
              </FieldGroup>
              <FieldGroup label={copy.stageLabel}>
                <select
                  className="admin-select w-full rounded-2xl border border-border/40 p-2 text-sm"
                  value={stage}
                  onChange={(event) => setStage(event.target.value)}
                >
                  {ORDER_STAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label[language]}
                    </option>
                  ))}
                </select>
              </FieldGroup>
              <FieldGroup label={copy.etaLabel}>
                <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-background/60 px-3">
                  <Calendar className="h-4 w-4 text-foreground/50" />
                  <Input
                    type="date"
                    className="border-none bg-transparent p-0 text-sm focus-visible:ring-0"
                    value={etaInput}
                    onChange={(event) => setEtaInput(event.target.value)}
                  />
                </div>
              </FieldGroup>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/55">
                {copy.timelineLabel}
              </p>
              <div className="space-y-2">
                {timeline.map((step) => (
                  <button
                    key={step.label}
                    type="button"
                    onClick={() => handleToggleStep(step.label)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl border border-border/40 px-4 py-3 text-left text-sm transition",
                      step.completed
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "bg-background/70 text-foreground/70 hover:bg-background/90",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border",
                          step.completed
                            ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                            : "border-border/50 text-foreground/50",
                        )}
                      >
                        {step.completed ? <CheckCircle2 className="h-4 w-4" /> : "•"}
                      </span>
                      {step.label}
                    </span>
                    <span className="text-xs text-foreground/50">
                      {step.completed && step.completedAt
                        ? new Date(step.completedAt).toLocaleDateString(
                            language === "sr" ? "sr-RS" : "en-US",
                          )
                        : language === "sr"
                          ? "U toku"
                          : "In progress"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Button
                onClick={handleSaveProduction}
                disabled={savingProduction}
                className="rounded-full px-6"
              >
                {savingProduction ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {copy.saving}
                  </>
                ) : (
                  copy.save
                )}
              </Button>
              {feedback ? (
                <span className="text-xs text-foreground/60">{feedback}</span>
              ) : null}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-border/40 bg-background/80 p-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">{copy.shareTitle}</h4>
              <p className="text-xs text-foreground/60">{copy.shareDescription}</p>
            </div>
            <div className="grid gap-3">
              <FieldGroup label={language === "sr" ? "Naslov" : "Title"}>
                <Input
                  value={progressTitle}
                  onChange={(event) => setProgressTitle(event.target.value)}
                  placeholder={language === "sr" ? "Haljina je spremna za probu" : "Dress ready for fitting"}
                  className="rounded-2xl"
                />
              </FieldGroup>
              <FieldGroup label={language === "sr" ? "Poruka" : "Message"}>
                <Textarea
                  value={progressMessage}
                  onChange={(event) => setProgressMessage(event.target.value)}
                  placeholder={
                    language === "sr"
                      ? "Tim je završio ručno ušivanje detalja, sledeća proba je spremna."
                      : "Team finished hand sewing details and the next fitting slot is ready."
                  }
                  className="min-h-[120px] rounded-2xl"
                />
              </FieldGroup>
              <FieldGroup label={language === "sr" ? "Poveži sa korakom" : "Tie to step"}>
                <select
                  className="admin-select w-full rounded-2xl border border-border/40 p-2 text-sm"
                  value={progressStep}
                  onChange={(event) => setProgressStep(event.target.value)}
                >
                  <option value="">{language === "sr" ? "Bez povezivanja" : "No link"}</option>
                  {timeline.map((step) => (
                    <option key={step.label} value={step.label}>
                      {step.label}
                    </option>
                  ))}
                </select>
              </FieldGroup>
              <label className="flex items-center gap-2 text-xs text-foreground/65">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border border-border/60 accent-foreground"
                  checked={publishToShare}
                  onChange={(event) => setPublishToShare(event.target.checked)}
                />
                {copy.sharePublish}
              </label>
            </div>
            <Button
              onClick={handleShareProgress}
              disabled={sendingShare}
              className="w-full rounded-full"
            >
              {sendingShare ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {copy.shareSending}
                </>
              ) : (
                copy.shareCta
              )}
            </Button>
            <div className="space-y-2 rounded-2xl border border-border/40 bg-background/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.28em] text-foreground/55">
                  {copy.shareLinkLabel}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full px-4"
                  onClick={handleEnsureShare}
                  disabled={generatingLink}
                >
                  {generatingLink ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    copy.shareLinkCta
                  )}
                </Button>
              </div>
              <ShareLinkDisplay shareUrl={shareUrl} language={language} />
            </div>
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-[0.28em] text-foreground/55">
                {updatesCopy.title}
              </h4>
              {recentUpdates.length === 0 ? (
                <p className="text-xs text-foreground/60">{updatesCopy.empty}</p>
              ) : (
                <div className="space-y-2">
                  {recentUpdates.map((update) => (
                    <div
                      key={update.id}
                      className={cn(
                        "space-y-1 rounded-2xl border border-border/35 bg-background/70 p-3 text-xs text-foreground/70",
                        update.sharedAt && "border-emerald-200 bg-emerald-50 text-emerald-800",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">{update.title}</span>
                        <span className="text-[0.7rem] uppercase tracking-[0.28em] text-foreground/50">
                          {new Date(update.createdAt).toLocaleDateString(
                            language === "sr" ? "sr-RS" : "en-US",
                          )}
                        </span>
                      </div>
                      <p>{update.message}</p>
                      {update.timelineLabel ? (
                        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-foreground/50">
                          {update.timelineLabel}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ShareLinkDisplay({
  shareUrl,
  language,
}: {
  shareUrl: string | null;
  language: "en" | "sr";
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

  return shareUrl ? (
    <div className="flex items-center gap-2 text-xs text-foreground/60">
      <div className="line-clamp-2 break-all text-left">{shareUrl}</div>
      <Button
        size="sm"
        variant="ghost"
        className="rounded-full px-3"
        onClick={handleCopy}
      >
        {copied ? (language === "sr" ? "Kopirano" : "Copied") : "Copy"}
      </Button>
    </div>
  ) : (
    <p className="text-xs text-foreground/60">
      {language === "sr"
        ? "Generiši link kako bi ga klijent mogao podeliti."
        : "Generate a share link when you are ready to share externally."}
    </p>
  );
}

function FieldGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.28em] text-foreground/55">
      <span>{label}</span>
      {children}
    </label>
  );
}

function MetricCard({
  icon,
  title,
  rows,
}: {
  icon: ReactNode;
  title: string;
  rows: Array<{ label: string; value: number | string }>;
}) {
  return (
    <Card className="border-border/40 bg-background/85">
      <CardHeader className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.28em] text-foreground/55">
        {icon}
        {title}
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-foreground/70">
        {rows.map((row) => (
          <SummaryRow key={row.label} label={row.label} value={row.value} />
        ))}
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/35 bg-background/80 px-4 py-3">
      <span className="uppercase tracking-[0.28em] text-foreground/50">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}

function stageLabel(stage: string, language: "en" | "sr") {
  const match = ORDER_STAGE_OPTIONS.find((option) => option.value === stage);
  return match ? match.label[language] : stage;
}



