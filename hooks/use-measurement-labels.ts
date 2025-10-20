import { useMemo } from "react";

import { useLanguage } from "@/components/language-provider";
import type { ConfiguratorInput } from "@/lib/configurator-schema";
import { measurementTips } from "@/lib/measurements";
import { useConvexQuery } from "@/lib/convex-client";

type MeasurementKey = keyof ConfiguratorInput["measurements"];

type MeasurementLabelRecord = {
  key: string;
  label: string;
  helper?: string;
};

const FALLBACK_LABELS: Record<
  "en" | "sr",
  Record<MeasurementKey, string>
> = {
  en: {
    bust: "Bust",
    underbust: "Underbust",
    waist: "Waist",
    hips: "Hips",
    hollowToFloor: "Hollow to floor",
    height: "Height",
    preferredHeel: "Preferred heel height",
  },
  sr: {
    bust: "Obim grudi",
    underbust: "Ispod grudi",
    waist: "Struk",
    hips: "Kukovi",
    hollowToFloor: "Od ključne kosti do poda",
    height: "Visina",
    preferredHeel: "Visina štikle",
  },
};

const FALLBACK_HELPERS_SR: Record<MeasurementKey, string> = {
  bust: "Postavi traku preko naj šireg dela grudi, paralelno sa podom.",
  underbust: "Izmeri direktno ispod grudi i drži traku u ravni.",
  waist: "Savij se ulevo i udesno da pronađeš prirodni struk pa izmeri na tom mestu.",
  hips: "Stani spojeno i izmeri oko naj šireg dela kukova i zadnjice.",
  hollowToFloor: "Izmeri od udubljenja na bazi vrata pravo do poda, bosonoga.",
  height: "Stani uz zid bez obuće i izmeri od temena do poda.",
  preferredHeel: "Unesi visinu štikle koju planiraš da nosiš, merenu sa poleđine pete.",
};

export function useMeasurementLabels() {
  const { language } = useLanguage();

  const remoteLabels = useConvexQuery("measurementLabels:list", {
    locale: language,
  }) as MeasurementLabelRecord[] | undefined;

  const remoteMap = useMemo(() => {
    if (!remoteLabels?.length) {
      return new Map<string, MeasurementLabelRecord>();
    }
    return new Map(remoteLabels.map((entry) => [entry.key, entry]));
  }, [remoteLabels]);

  const fallbackLabels = FALLBACK_LABELS[language];
  const fallbackHelpers =
    language === "sr" ? FALLBACK_HELPERS_SR : measurementTips;

  const getLabel = (key: MeasurementKey) =>
    remoteMap.get(key)?.label ?? fallbackLabels[key];

  const getHelper = (key: MeasurementKey) =>
    remoteMap.get(key)?.helper ?? fallbackHelpers[key];

  return { getLabel, getHelper };
}
