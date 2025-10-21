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
import { Stepper } from "@/components/configurator/stepper";
import { StyleSelector } from "@/components/configurator/style-selector";
import { SummaryCard } from "@/components/configurator/summary-card";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DRESS_MODELS } from "@/lib/dress-data";
import {
  configuratorSchema,
  configuratorSteps,
  type ConfiguratorInput,
  getFieldsForStep,
} from "@/lib/configurator-schema";
import { useConvexMutation } from "@/lib/convex-client";
import { getErrorMessage } from "@/lib/error";
import { useSessionToken } from "@/hooks/use-session-token";

const ORDER_STATUS = "pending";
const ORDER_STAGE = "configuration_submitted";

const CONFIG_COPY = {
  en: {
    backCta: "Back to site",
    badge: "wizard",
    title: "Design your dress",
    description:
      "Follow the guided steps to configure silhouette, materials, and custom measurements. Save your progress anytime and share the finished configuration with your atelier concierge.",
    secureTag: "secure atelier portal",
    previous: "Previous",
    next: "Next step",
    submit: "Place order",
    generating: "Placing order...",
    errors: {
      auth: "You need to sign in before placing an order.",
      generic: "We could not process your order right now. Please try again shortly.",
    },
    success: (code: string) =>
      `Order ${code} has been submitted to the atelier.`,
    backAria: "Return to previous page",
  },
  sr: {
    backCta: "Nazad na sajt",
    badge: "čarobnjak",
    title: "Kreiraj svoju haljinu",
    description:
      "Prođi kroz vođene korake i prilagodi siluetu, materijale i mere. Sačuvaj napredak i podeli finalnu konfiguraciju sa atelje timom.",
    secureTag: "sigurni atelje portal",
    previous: "Prethodno",
    next: "Sledeći korak",
    submit: "Pošalji porudžbinu",
    generating: "Šaljemo porudžbinu...",
    errors: {
      auth: "Prijavi se da bi poslala porudžbinu.",
      generic: "Porudžbina trenutno ne može da se obradi. Pokušaj ponovo uskoro.",
    },
    success: (code: string) =>
      `Porudžbina ${code} je poslata u atelje.`,
    backAria: "Povratak na prethodnu stranicu",
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
  const createOrder = useConvexMutation("orders:create");
  const sessionToken = useSessionToken();
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

  const modelFromUrl = searchParams.get("model");

  const defaultModel =
    DRESS_MODELS.find((model) => model.slug === modelFromUrl) ?? DRESS_MODELS[0];

  const methods = useForm<ConfiguratorInput>({
    resolver: zodResolver(configuratorSchema),
    mode: "onBlur",
    defaultValues: {
      modelId: defaultModel.id,
      fabricId: defaultModel.fabrics[0]?.id ?? "",
      colorId: defaultModel.colors[0]?.id ?? "",
      lengthId: defaultModel.lengths[0]?.id ?? "",
      rushOrder: false,
      notes: "",
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

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

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

  const handlePlaceOrder = methods.handleSubmit(async (values) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    setSuccessCode(null);

    try {
      if (!sessionToken) {
        throw new Error(copy.errors.auth);
      }

      const parsed = configuratorSchema.parse(values);
      const model =
        DRESS_MODELS.find((candidate) => candidate.id === parsed.modelId) ??
        DRESS_MODELS[0];
      const fabric = model.fabrics.find((item) => item.id === parsed.fabricId);
      const color = model.colors.find((item) => item.id === parsed.colorId);

      const orderCode = generateOrderCode(model.slug);
      const timelinePayload = buildTimelinePayload();

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
        measurementProfileId: undefined,
        productionTimeline: timelinePayload.map((step) => ({
          label: step.label,
          completed: step.completed,
          completedAt: step.completedAt ?? undefined,
        })),
        measurements: measurementsPayload,
        bodyProfile: hasBodyProfile ? bodyProfilePayload : undefined,
      });

      setSuccessCode(orderCode);
    } catch (error) {
      setSubmissionError(getErrorMessage(error, copy.errors.generic));
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={() => router.back()}
              aria-label={copy.backAria}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {copy.backCta}
            </Button>
            <div className="flex items-center gap-2">
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

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-foreground/45">
                <ShieldCheck className="h-4 w-4" />
                {copy.secureTag}
              </div>
              <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={activeStep === 0 || isSubmitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {copy.previous}
                  </Button>
                  {currentStep.id === "review" ? (
                    <Button type="button" onClick={handlePlaceOrder} disabled={isSubmitting}>
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
                    <Button type="button" onClick={handleNext} disabled={isSubmitting}>
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
            className="space-y-6 rounded-[28px] border border-border/50 bg-background/80 p-8"
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

