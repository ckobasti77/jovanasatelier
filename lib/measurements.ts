import { z } from "zod";

const measurementNumber = (label: string, min: number, max: number) =>
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
      .number()
      .min(min, `${label} must be at least ${min} cm`)
      .max(max, `${label} must be below ${max} cm`),
  );

export const measurementSchema = z.object({
  bust: measurementNumber("Bust", 70, 130),
  underbust: measurementNumber("Underbust", 60, 120),
  waist: measurementNumber("Waist", 50, 115),
  hips: measurementNumber("Hips", 75, 140),
  hollowToFloor: measurementNumber("Hollow-to-floor", 120, 170),
  height: measurementNumber("Height", 150, 190),
  preferredHeel: measurementNumber("Heel height", 0, 15),
});

export type MeasurementValues = z.infer<typeof measurementSchema>;

export const bodyProfileSchema = z.object({
  height: measurementNumber("Height", 145, 200),
  weight: measurementNumber("Weight", 38, 130),
  braBand: measurementNumber("Bra band", 60, 110),
  braCup: z.enum(["AA", "A", "B", "C", "D", "DD", "E", "F"]),
});

export type BodyProfileValues = z.infer<typeof bodyProfileSchema>;

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
