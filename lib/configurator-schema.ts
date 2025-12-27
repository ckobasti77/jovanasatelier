import { z } from "zod";

import {
  createBodyProfileSchema,
  createMeasurementSchema,
  type BodyProfileValues,
  type MeasurementLocale,
} from "@/lib/measurements";

const CONFIGURATOR_VALIDATION_COPY: Record<
  MeasurementLocale,
  {
    model: string;
    fabric: string;
    color: string;
    length: string;
    notes: string;
  }
> = {
  en: {
    model: "Select a dress model",
    fabric: "Select a fabric option",
    color: "Select a color",
    length: "Select a length",
    notes: "Notes should stay under 600 characters",
  },
  sr: {
    model: "Izaberi model haljine",
    fabric: "Izaberi tkaninu",
    color: "Izaberi boju",
    length: "Izaberi dužinu",
    notes: "Napomene mogu imati najviše 600 karaktera",
  },
};

const createConfiguratorSchema = (language: MeasurementLocale) => {
  const copy = CONFIGURATOR_VALIDATION_COPY[language];
  return z.object({
    modelId: z.string().min(1, copy.model),
    fabricId: z.string().min(1, copy.fabric),
    colorId: z.string().min(1, copy.color),
    lengthId: z.string().min(1, copy.length),
    rushOrder: z.boolean().default(false),
    notes: z.string().max(600, copy.notes).optional().or(z.literal("")),
    measurements: createMeasurementSchema(language),
    bodyProfile: createBodyProfileSchema(language).partial().optional(),
    saveMeasurementProfile: z.boolean().optional(),
  });
};

export const configuratorSchema = createConfiguratorSchema("en");
export const getConfiguratorSchema = (language: MeasurementLocale) =>
  createConfiguratorSchema(language);

export type ConfiguratorInput = z.input<typeof configuratorSchema>;
export type ConfiguratorOutput = z.infer<typeof configuratorSchema>;

export const configuratorSteps = [
  {
    id: "model",
    labels: {
      en: "Model",
      sr: "Model",
    },
  },
  {
    id: "style",
    labels: {
      en: "Style",
      sr: "Stil",
    },
  },
  {
    id: "measure",
    labels: {
      en: "Measurements",
      sr: "Mere",
    },
  },
  {
    id: "review",
    labels: {
      en: "Review",
      sr: "Pregled",
    },
  },
] as const;

export type ConfiguratorStepId =
  (typeof configuratorSteps)[number]["id"];

export const measurementOrder: Array<
  keyof ConfiguratorInput["measurements"]
> = [
  "bust",
  "underbust",
  "waist",
  "hips",
  "hollowToFloor",
  "height",
  "preferredHeel",
];

export type MeasurementFieldPath =
  `measurements.${typeof measurementOrder[number]}`;

type BodyProfileKeys = keyof BodyProfileValues;
export type BodyProfileFieldPath = `bodyProfile.${BodyProfileKeys}`;

export type ConfiguratorFieldPath =
  | "modelId"
  | "fabricId"
  | "colorId"
  | "lengthId"
  | "rushOrder"
  | "notes"
  | "saveMeasurementProfile"
  | MeasurementFieldPath
  | BodyProfileFieldPath;

export function computeFitConfidence(
  values: ConfiguratorInput | ConfiguratorOutput,
) {
  const { measurements, bodyProfile } = values;
  const provided = measurementOrder.filter(
    (key) => Number(measurements?.[key]) > 0,
  );

  let score = (provided.length / measurementOrder.length) * 70;

  if (bodyProfile?.height && bodyProfile?.weight) {
    score += 20;
  }
  if (bodyProfile?.braCup) {
    score += 10;
  }

  const percentage = Math.min(100, Math.round(score));

  return {
    percentage,
    level: percentage >= 80 ? "high" : percentage >= 60 ? "medium" : "low",
    label: percentage >= 80 ? "High" : percentage >= 60 ? "Good" : "Needs details",
    description:
      percentage >= 80
        ? "Fit confidence is high. Atelier will review and confirm within 24 hours."
        : percentage >= 60
        ? "Add optional profile info or double-check measurements for even better accuracy."
        : "Complete all measurements and add profile info to reach atelier-grade precision.",
  };
}

export function getFieldsForStep(stepId: ConfiguratorStepId): ConfiguratorFieldPath[] {
  switch (stepId) {
    case "model":
      return ["modelId"];
    case "style":
      return ["fabricId", "colorId", "lengthId", "notes"];
    case "measure":
      return measurementOrder.map(
        (key) => `measurements.${key}` as MeasurementFieldPath,
      );
    case "review":
    default:
      return [];
  }
}
