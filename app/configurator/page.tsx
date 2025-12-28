"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

import { ModelSelector } from "@/components/configurator/model-selector";
import { MeasurementsPanel } from "@/components/configurator/measurements-panel";
import { PRODUCTION_TIMELINE_STEPS, ProductionTimeline } from "@/components/configurator/production-timeline";
import { ReviewPanel } from "@/components/configurator/review-panel";
import { StyleSelector } from "@/components/configurator/style-selector";
import { Stepper } from "@/components/configurator/stepper";
import { SummaryCard } from "@/components/configurator/summary-card";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DRESS_MODELS } from "@/lib/dress-data";
import {
  configuratorSteps,
  getConfiguratorSchema,
  type ConfiguratorInput,
  type ConfiguratorStepId,
  getFieldsForStep,
} from "@/lib/configurator-schema";
import { useConvexMutation, useConvexQuery } from "@/lib/convex-client";
import { getErrorMessage, UserFacingError } from "@/lib/error";
import { useSessionToken } from "@/hooks/use-session-token";

const ORDER_STATUS = "pending";
const ORDER_STAGE = "configuration_submitted";
const CONFIGURATOR_DRAFT_KEY = "jeveux-configurator-draft";
const CONFIGURATOR_DRAFT_VERSION = 1;
const CONFIGURATOR_RETURN_KEY = "jeveux-configurator-return";

type ConfiguratorDraft = {
  version: number;
  updatedAt: number;
  stepId: ConfiguratorStepId;
  values: ConfiguratorInput;
};

function loadConfiguratorDraft() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(CONFIGURATOR_DRAFT_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as ConfiguratorDraft;
    if (!parsed || parsed.version !== CONFIGURATOR_DRAFT_VERSION) {
      return null;
    }
    if (!parsed.values || !parsed.stepId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveConfiguratorDraft(draft: ConfiguratorDraft) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(CONFIGURATOR_DRAFT_KEY, JSON.stringify(draft));
}

function clearConfiguratorDraft() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(CONFIGURATOR_DRAFT_KEY);
}

function getSameOriginPath(referrer: string, origin: string) {
  if (!referrer) {
    return null;
  }
  try {
    const url = new URL(referrer);
    if (url.origin !== origin) {
      return null;
    }
    const path = `${url.pathname}${url.search}${url.hash}`;
    return path || null;
  } catch {
    return null;
  }
}

function isBlockedReturnPath(path: string) {
  return (
    path.startsWith("/configurator") ||
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-up")
  );
}

const CONFIG_COPY = {
  en: {
    backCta: "Back to site",
    badge: "wizard",
    title: "Design your dress",
    description:
      "Follow the guided steps to choose a silhouette and add custom measurements. Save your progress anytime and review the final configuration with your atelier concierge.",
    secureTag: "secure atelier portal",
    previous: "Previous",
    next: "Next step",
    submit: "Place order",
    generating: "Placing order...",
    errors: {
      auth: "You need to sign in before placing an order.",
      generic: "We could not process your order right now. Please try again shortly.",
      profileMissing: "To save a profile, please fill bust, waist, hips, height, and heel height.",
      profileFailed: "We couldn't save the profile. Try again or place the order without saving.",
    },
    success: (code: string) =>
      `Order ${code} has been submitted to the atelier.`,
    backAria: "Return to previous page",
    profileLabel: (model: string, dateLabel: string) =>
      `Profile for ${model} • ${dateLabel}`,
  },
  sr: {
    backCta: "Nazad na sajt",
    badge: "čarobnjak",
    title: "Kreiraj svoju haljinu",
    description:
      "Prodji kroz vodjene korake, izaberi siluetu i unesi mere. Sacuvaj napredak i dovrsi konfiguraciju sa atelje timom.",
    secureTag: "sigurni atelje portal",
    previous: "Prethodno",
    next: "Sledeći korak",
    submit: "Pošalji porudžbinu",
    generating: "Šaljemo porudžbinu...",
    errors: {
      auth: "Prijavi se da bi poslala porudžbinu.",
      generic: "Porudžbina trenutno ne može da se obradi. Pokušaj ponovo uskoro.",
      profileMissing: "Da sačuvaš profil, popuni grudi, struk, kukove, visinu i visinu štikle.",
      profileFailed: "Profil nije sačuvan. Pokušaj ponovo ili pošalji porudžbinu bez čuvanja.",
    },
    success: (code: string) =>
      `Porudžbina ${code} je poslata u atelje.`,
    backAria: "Povratak na prethodnu stranicu",
    profileLabel: (model: string, dateLabel: string) =>
      `Profil za ${model} • ${dateLabel}`,
  },
} as const;

function generateOrderCode(modelSlug: string) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `JO-${modelSlug.toUpperCase()}-${timestamp.slice(-5)}${random}`;
}

function buildTimelinePayload() {
  return PRODUCTION_TIMELINE_STEPS.map((step) => ({
    label: step.label.en,
    completed: step.status === "complete",
    completedAt: step.status === "complete" ? Date.now() : undefined,
  }));
}

function ConfiguratorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const copy = CONFIG_COPY[language];
  const validationSchema = useMemo(() => getConfiguratorSchema(language), [language]);
  const createOrder = useConvexMutation("orders:create");
  const upsertProfile = useConvexMutation("profiles:upsert");
  const sessionToken = useSessionToken();
  const viewer = useConvexQuery(
    "session:viewer",
    sessionToken === null ? { sessionToken: undefined } : { sessionToken },
  ) as { user?: { role?: string | null } } | null | undefined;
  const [hasHydrated, setHasHydrated] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const viewerReady = viewer !== undefined;
  const viewerHasUser = Boolean(viewer?.user);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const modelFromUrl = searchParams.get("model");
  const colorFromUrl = searchParams.get("color");
  const stepFromUrl = searchParams.get("step");
  const resumeFromAuth = searchParams.get("resume") === "1";
  const searchParamString = searchParams.toString();

  const defaultModel =
    DRESS_MODELS.find((model) => model.slug === modelFromUrl) ?? DRESS_MODELS[0];
  const hasValidColorFromUrl =
    Boolean(colorFromUrl) &&
    defaultModel.colors.some((color) => color.id === colorFromUrl);
  const defaultColorId = hasValidColorFromUrl
    ? colorFromUrl!
    : defaultModel.colors[0]?.id ?? "";

  const methods = useForm<ConfiguratorInput>({
    resolver: zodResolver(validationSchema),
    mode: "onBlur",
    defaultValues: {
      modelId: defaultModel.id,
      fabricId: defaultModel.fabrics[0]?.id ?? "",
      colorId: defaultColorId,
      lengthId: defaultModel.lengths[0]?.id ?? "",
      rushOrder: false,
      notes: "",
      saveMeasurementProfile: false,
      measurements: {
        bust: "",
        underbust: "",
        waist: "",
        hips: "",
        hollowToFloor: "",
        height: "",
        preferredHeel: "",
      },
      bodyProfile: {
        height: "",
        weight: "",
        braBand: "",
        braCup: undefined,
      },
    },
  });

  const initialStepIndex = useMemo(() => {
    if (stepFromUrl) {
      const normalized = stepFromUrl.toLowerCase();
      const stepIndex = configuratorSteps.findIndex((step) => step.id === normalized);
      if (stepIndex >= 0) {
        return stepIndex;
      }
      const numericStep = Number(stepFromUrl);
      if (
        Number.isInteger(numericStep) &&
        numericStep > 0 &&
        numericStep <= configuratorSteps.length
      ) {
        return numericStep - 1;
      }
    }
    if (hasValidColorFromUrl) {
      const styleIndex = configuratorSteps.findIndex((step) => step.id === "style");
      return styleIndex >= 0 ? styleIndex : 0;
    }
    return 0;
  }, [stepFromUrl, hasValidColorFromUrl]);

  const [activeStep, setActiveStep] = useState(initialStepIndex);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated || hasRestoredDraft || !resumeFromAuth) {
      return;
    }
    const draft = loadConfiguratorDraft();
    if (!draft) {
      setHasRestoredDraft(true);
      return;
    }
    const draftModel =
      DRESS_MODELS.find((candidate) => candidate.id === draft.values.modelId) ?? null;
    if (!draftModel) {
      clearConfiguratorDraft();
      setHasRestoredDraft(true);
      return;
    }
    methods.reset(draft.values);
    const stepIndex = configuratorSteps.findIndex((step) => step.id === draft.stepId);
    if (stepIndex >= 0) {
      setActiveStep(stepIndex);
    }
    const nextParams = new URLSearchParams(searchParamString);
    nextParams.set("model", draftModel.slug);
    nextParams.set("step", draft.stepId);
    nextParams.set("resume", "1");
    router.replace(`/configurator?${nextParams.toString()}`, { scroll: false });
    setHasRestoredDraft(true);
  }, [
    hasHydrated,
    hasRestoredDraft,
    resumeFromAuth,
    methods,
    router,
    searchParamString,
  ]);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") {
      return;
    }
    const referrerPath = getSameOriginPath(
      document.referrer,
      window.location.origin,
    );
    if (!referrerPath || isBlockedReturnPath(referrerPath)) {
      return;
    }
    window.sessionStorage.setItem(CONFIGURATOR_RETURN_KEY, referrerPath);
  }, [hasHydrated]);

  const modelId = methods.watch("modelId");
  const currentModel = useMemo(
    () => DRESS_MODELS.find((model) => model.id === modelId) ?? DRESS_MODELS[0],
    [modelId],
  );

  useEffect(() => {
    const nextFabric = currentModel.fabrics[0]?.id ?? "";
    const nextColor = currentModel.colors[0]?.id ?? "";
    const nextLength = currentModel.lengths[0]?.id ?? "";

    if (
      !currentModel.fabrics.some(
        (fabric) => fabric.id === methods.getValues("fabricId"),
      )
    ) {
      methods.setValue("fabricId", nextFabric, {
        shouldValidate: true,
        shouldTouch: true,
      });
    }
    if (
      !currentModel.colors.some(
        (color) => color.id === methods.getValues("colorId"),
      )
    ) {
      methods.setValue("colorId", nextColor, {
        shouldValidate: true,
        shouldTouch: true,
      });
    }
    if (
      !currentModel.lengths.some(
        (length) => length.id === methods.getValues("lengthId"),
      )
    ) {
      methods.setValue("lengthId", nextLength, {
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  }, [currentModel, methods]);

  const currentStep = configuratorSteps[activeStep];

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(
      currentStep.id,
    ) as FieldPath<ConfiguratorInput>[];
    const valid = await methods.trigger(fieldsToValidate, {
      shouldFocus: true,
    });
    if (!valid) return;
    setActiveStep((prev) => Math.min(prev + 1, configuratorSteps.length - 1));
    if (currentStep.id === "model") {
      router.replace(`/configurator?model=${currentModel.slug}`, {
        scroll: false,
      });
    }
  };

  const handlePrevious = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleBackToSite = () => {
    if (typeof window === "undefined") {
      return;
    }
    const storedReturn = window.sessionStorage.getItem(CONFIGURATOR_RETURN_KEY);
    if (storedReturn && !isBlockedReturnPath(storedReturn)) {
      router.push(storedReturn);
      return;
    }
    const referrerPath = getSameOriginPath(
      document.referrer,
      window.location.origin,
    );
    if (referrerPath && !isBlockedReturnPath(referrerPath)) {
      router.push(referrerPath);
      return;
    }
    router.push("/");
  };

  const handlePlaceOrder = methods.handleSubmit(async (values) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSuccessCode(null);

    try {
      if (!sessionToken || (viewerReady && !viewerHasUser)) {
        const draft: ConfiguratorDraft = {
          version: CONFIGURATOR_DRAFT_VERSION,
          updatedAt: Date.now(),
          stepId: currentStep.id,
          values: methods.getValues(),
        };
        if (hasHydrated) {
          saveConfiguratorDraft(draft);
        }
        const returnTo = `/configurator?step=${currentStep.id}&resume=1&model=${currentModel.slug}`;
        const authTarget = `/sign-in?intent=order&returnTo=${encodeURIComponent(returnTo)}`;
        router.push(authTarget);
        return;
      }

      const parsed = validationSchema.parse(values);
      const shouldSaveProfile = Boolean(parsed.saveMeasurementProfile);
      const model =
        DRESS_MODELS.find((candidate) => candidate.id === parsed.modelId) ??
        DRESS_MODELS[0];
      const fabric = model.fabrics.find((item) => item.id === parsed.fabricId);
      const color = model.colors.find((item) => item.id === parsed.colorId);

      const orderCode = generateOrderCode(model.slug);
      const timelinePayload = buildTimelinePayload();
      let measurementProfileId: string | undefined;

      if (shouldSaveProfile) {
        const bust = parsed.measurements?.bust;
        const waist = parsed.measurements?.waist;
        const hips = parsed.measurements?.hips;
        const height = parsed.measurements?.height;
        const heel = parsed.measurements?.preferredHeel;

        const hasAllCore =
          typeof bust === "number" &&
          typeof waist === "number" &&
          typeof hips === "number" &&
          typeof height === "number" &&
          typeof heel === "number";

        if (!hasAllCore) {
          throw new UserFacingError(copy.errors.profileMissing);
        }

        const formattedDate = new Intl.DateTimeFormat(
          language === "sr" ? "sr-RS" : "en-US",
          { day: "2-digit", month: "short" },
        ).format(new Date());

        try {
          measurementProfileId = await upsertProfile({
            sessionToken,
            profileId: undefined,
            label: copy.profileLabel(model.name, formattedDate),
            bust,
            waist,
            hips,
            height,
            heel,
            notes: undefined,
          });
        } catch (profileError) {
          throw new Error(
            getErrorMessage(profileError, copy.errors.profileFailed, language),
          );
        }
      }

      const measurementsPayload = {
        bust: typeof parsed.measurements?.bust === "number" ? parsed.measurements.bust : undefined,
        underbust:
          typeof parsed.measurements?.underbust === "number"
            ? parsed.measurements.underbust
            : undefined,
        waist: typeof parsed.measurements?.waist === "number" ? parsed.measurements.waist : undefined,
        hips: typeof parsed.measurements?.hips === "number" ? parsed.measurements.hips : undefined,
        hollowToFloor:
          typeof parsed.measurements?.hollowToFloor === "number"
            ? parsed.measurements.hollowToFloor
            : undefined,
        height:
          typeof parsed.measurements?.height === "number"
            ? parsed.measurements.height
            : undefined,
        preferredHeel:
          typeof parsed.measurements?.preferredHeel === "number"
            ? parsed.measurements.preferredHeel
            : undefined,
      };

      const bodyProfilePayloadRaw = parsed.bodyProfile ?? {};
      const bodyProfilePayload = {
        height:
          typeof bodyProfilePayloadRaw?.height === "number"
            ? bodyProfilePayloadRaw.height
            : undefined,
        weight:
          typeof bodyProfilePayloadRaw?.weight === "number"
            ? bodyProfilePayloadRaw.weight
            : undefined,
        braBand:
          typeof bodyProfilePayloadRaw?.braBand === "number"
            ? bodyProfilePayloadRaw.braBand
            : undefined,
        braCup: bodyProfilePayloadRaw?.braCup ?? undefined,
      };

      const hasBodyProfile = Object.values(bodyProfilePayload).some(
        (value) => value !== undefined,
      );

      await createOrder({
        sessionToken,
        orderCode,
        dressModel: model.name,
        color: color?.name ?? "",
        fabric: fabric?.name ?? "",
        status: ORDER_STATUS,
        stage: ORDER_STAGE,
        eta: undefined,
        measurementProfileId,
        productionTimeline: timelinePayload.map((step) => ({
          label: step.label,
          completed: step.completed,
          completedAt: step.completedAt ?? undefined,
        })),
        measurements: measurementsPayload,
        bodyProfile: hasBodyProfile ? bodyProfilePayload : undefined,
      });

      setSuccessCode(orderCode);
      clearConfiguratorDraft();
    } catch (error) {
      setSubmissionError(getErrorMessage(error, copy.errors.generic, language));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-14 sm:gap-12 sm:px-6 sm:pt-16 sm:pb-24">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleBackToSite}
              aria-label={copy.backAria}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {copy.backCta}
            </Button>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          <div>
            <Badge className="uppercase tracking-[0.35em]">{copy.badge}</Badge>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
              {copy.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-foreground/70">
              {copy.description}
            </p>
          </div>
        </div>

        <Stepper activeStep={activeStep} />

        <form
          onSubmit={(event) => event.preventDefault()}
          className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="space-y-8">
            {currentStep.id === "model" ? (
              <ModelSelector />
            ) : currentStep.id === "style" ? (
              <StyleSelector modelId={currentModel.id} />
            ) : currentStep.id === "measure" ? (
              <MeasurementsPanel />
            ) : (
              <ReviewPanel modelId={currentModel.id} />
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-foreground/45">
                <ShieldCheck className="h-4 w-4" />
                {copy.secureTag}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={activeStep === 0 || isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {copy.previous}
                  </Button>
                  {currentStep.id === "review" ? (
                    <Button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {copy.generating}
                        </>
                      ) : (
                        <>{copy.submit}</>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {copy.next}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
                {successCode ? (
                  <p className="text-xs text-emerald-600">{copy.success(successCode)}</p>
                ) : null}
                {submissionError ? (
                  <p className="text-xs text-rose-600">{submissionError}</p>
                ) : null}
              </div>
            </div>
          </div>

          <motion.aside
            className="space-y-6 rounded-[24px] border border-border/50 bg-background/80 p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <SummaryCard modelId={currentModel.id} />
            <ProductionTimeline />
          </motion.aside>
        </form>
      </div>
    </FormProvider>
  );
}

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-foreground/70">Loading configurator...</div>}>
      <ConfiguratorPageContent />
    </Suspense>
  );
}







