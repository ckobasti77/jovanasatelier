import { z } from "zod";

export type MeasurementLocale = "en" | "sr";

type MeasurementKey =
  | "bust"
  | "underbust"
  | "waist"
  | "hips"
  | "hollowToFloor"
  | "height"
  | "preferredHeel";

type BodyProfileKey = "height" | "weight" | "braBand" | "braCup";

type MeasurementMessageTemplates = {
  required: (label: string) => string;
  invalid: (label: string) => string;
  min: (label: string, min: number) => string;
  max: (label: string, max: number) => string;
};

const MEASUREMENT_MESSAGE_TEMPLATES: Record<
  MeasurementLocale,
  MeasurementMessageTemplates
> = {
  en: {
    required: (label) => `${label} is required`,
    invalid: (label) => `${label} must be a number`,
    min: (label, min) => `${label} must be at least ${min} cm`,
    max: (label, max) => `${label} must be below ${max} cm`,
  },
  sr: {
    required: (label) => `${label} je obavezno`,
    invalid: (label) => `${label} mora biti broj`,
    min: (label, min) => `${label} mora biti najmanje ${min} cm`,
    max: (label, max) => `${label} mora biti najviše ${max} cm`,
  },
};

const MEASUREMENT_VALIDATION_LABELS: Record<
  MeasurementLocale,
  Record<MeasurementKey, string>
> = {
  en: {
    bust: "Bust",
    underbust: "Underbust",
    waist: "Waist",
    hips: "Hips",
    hollowToFloor: "Hollow-to-floor",
    height: "Height",
    preferredHeel: "Heel height",
  },
  sr: {
    bust: "Obim grudi",
    underbust: "Ispod grudi",
    waist: "Struk",
    hips: "Kukovi",
    hollowToFloor: "Od kljucne kosti do poda",
    height: "Visina",
    preferredHeel: "Visina štikle",
  },
};

const BODY_PROFILE_VALIDATION_LABELS: Record<
  MeasurementLocale,
  Record<BodyProfileKey, string>
> = {
  en: {
    height: "Height",
    weight: "Weight",
    braBand: "Bra band",
    braCup: "Bra cup",
  },
  sr: {
    height: "Visina",
    weight: "Težina",
    braBand: "Obim grudnjaka",
    braCup: "Korpa grudnjaka",
  },
};

export const measurementNumber = (
  label: string,
  min: number,
  max: number,
  messages: MeasurementMessageTemplates = MEASUREMENT_MESSAGE_TEMPLATES.en,
) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || typeof value === "undefined") {
        return undefined;
      }
      if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        return Number.isNaN(parsed) ? value : parsed;
      }
      return value;
    },
    z
      .number(messages.invalid(label))
      .min(min, messages.min(label, min))
      .max(max, messages.max(label, max))
      .optional()
      .refine((value): value is number => typeof value === "number", {
        message: messages.required(label),
      })
      .transform((value) => value as number),
  );

export const createMeasurementSchema = (language: MeasurementLocale) => {
  const labels = MEASUREMENT_VALIDATION_LABELS[language];
  const messages = MEASUREMENT_MESSAGE_TEMPLATES[language];
  return z.object({
    bust: measurementNumber(labels.bust, 70, 130, messages),
    underbust: measurementNumber(labels.underbust, 60, 120, messages),
    waist: measurementNumber(labels.waist, 50, 115, messages),
    hips: measurementNumber(labels.hips, 75, 140, messages),
    hollowToFloor: measurementNumber(labels.hollowToFloor, 120, 170, messages),
    height: measurementNumber(labels.height, 150, 190, messages),
    preferredHeel: measurementNumber(labels.preferredHeel, 0, 15, messages),
  });
};

export const measurementSchema = createMeasurementSchema("en");

export type MeasurementValues = z.infer<typeof measurementSchema>;

export const createBodyProfileSchema = (language: MeasurementLocale) => {
  const labels = BODY_PROFILE_VALIDATION_LABELS[language];
  const messages = MEASUREMENT_MESSAGE_TEMPLATES[language];
  return z.object({
    height: measurementNumber(labels.height, 145, 200, messages),
    weight: measurementNumber(labels.weight, 38, 130, messages),
    braBand: measurementNumber(labels.braBand, 60, 110, messages),
    braCup: z.enum(["AA", "A", "B", "C", "D", "DD", "E", "F"]),
  });
};

export const bodyProfileSchema = createBodyProfileSchema("en");

export type BodyProfileValues = z.infer<typeof bodyProfileSchema>;

const PROFILE_VALIDATION_COPY: Record<
  MeasurementLocale,
  { labelMin: string; labelMax: string; notesMax: string }
> = {
  en: {
    labelMin: "Label must have at least 2 characters",
    labelMax: "Label should be under 60 characters",
    notesMax: "Notes should stay under 400 characters",
  },
  sr: {
    labelMin: "Naziv mora imati najmanje 2 karaktera",
    labelMax: "Naziv treba da bude kraci od 60 karaktera",
    notesMax: "Beleske treba da budu krace od 400 karaktera",
  },
};

export const createMeasurementProfileSchema = (language: MeasurementLocale) => {
  const labels = MEASUREMENT_VALIDATION_LABELS[language];
  const messages = MEASUREMENT_MESSAGE_TEMPLATES[language];
  const copy = PROFILE_VALIDATION_COPY[language];

  return z.object({
    label: z.string().min(2, copy.labelMin).max(60, copy.labelMax),
    bust: measurementNumber(labels.bust, 70, 130, messages),
    waist: measurementNumber(labels.waist, 50, 115, messages),
    hips: measurementNumber(labels.hips, 75, 140, messages),
    height: measurementNumber(labels.height, 150, 190, messages),
    heel: measurementNumber(labels.preferredHeel, 0, 15, messages),
    notes: z
      .string()
      .max(400, copy.notesMax)
      .optional()
      .or(z.literal(""))
      .transform((value) => (value === "" ? undefined : value)),
  });
};

export const measurementProfileSchema = createMeasurementProfileSchema("en");

export type MeasurementProfileInput = z.input<typeof measurementProfileSchema>;
export type MeasurementProfileValues = z.infer<typeof measurementProfileSchema>;

export const measurementTips: Record<keyof MeasurementValues, string> = {
  bust: "Wrap the tape around the fullest part of your bust, keeping it parallel to the floor.",
  underbust: "Measure directly under the bust, ensuring the tape stays level.",
  waist:
    "Locate your natural waistline by bending side to side; measure where the fold appears.",
  hips: "Stand with feet together and measure around the fullest part of your hips and seat.",
  hollowToFloor:
    "Measure from the hollow at the base of your neck straight down to the floor, barefoot.",
  height:
    "Stand against a wall without shoes; measure from the top of your head to the floor.",
  preferredHeel:
    "Enter the heel height you plan to wear, measured from the back of the heel.",
};
