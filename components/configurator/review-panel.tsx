import { useFormContext } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { useLocalizedDressModel } from "@/hooks/use-dress-models";
import type { ConfiguratorInput } from "@/lib/configurator-schema";
import { measurementOrder } from "@/lib/configurator-schema";
import { useMeasurementLabels } from "@/hooks/use-measurement-labels";

const REVIEW_COPY = {
  en: {
    title: "Review & finalize",
    description:
      "Make sure everything looks perfect. Once you place the order, we will send a confirmation and atelier PDF within minutes.",
    configuration: "configuration",
    fabric: "Fabric",
    color: "Color",
    length: "Length",
    rush: "Rush order",
    rushRequested: "Requested",
    rushStandard: "Standard",
    notes: "Notes",
    noNotes: "No special notes",
    measurements: "measurements",
    measurementUnit: "cm",
    missingValue: "-",
    saveProfileTitle: "Save these measurements as a profile",
    saveProfileDescription:
      "We will store bust, waist, hips, height, and heel height so you can reuse them on your next order.",
  },
  sr: {
    title: "Pregled i potvrda",
    description:
      "Proveri da li je sve savršeno. Kada pošalješ porudžbinu, stiže potvrda i atelje PDF za nekoliko minuta.",
    configuration: "konfiguracija",
    fabric: "Tkanina",
    color: "Boja",
    length: "Dužina",
    rush: "Hitna izrada",
    rushRequested: "Zahtevano",
    rushStandard: "Standard",
    notes: "Napomene",
    noNotes: "Bez posebnih napomena",
    measurements: "mere",
    measurementUnit: "cm",
    missingValue: "-",
    saveProfileTitle: "Sačuvaj ove mere kao profil",
    saveProfileDescription:
      "Sačuvaćemo grudi, struk, kukove, visinu i štiklu da ih koristiš za sledeću porudžbinu.",
  },
} as const;

export function ReviewPanel({ modelId }: { modelId: string }) {
  const { getValues, register } = useFormContext<ConfiguratorInput>();
  const { language } = useLanguage();
  const { getLabel } = useMeasurementLabels();
  const copy = REVIEW_COPY[language];

  const values = getValues();

  const model = useLocalizedDressModel(modelId);
  const fabric = model.fabrics.find((item) => item.id === values.fabricId);
  const color = model.colors.find((item) => item.id === values.colorId);
  const length = model.lengths.find((item) => item.id === values.lengthId);

  const measurementEntries = measurementOrder.map((key) => ({
    key,
    value: values.measurements?.[key] ?? "",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{copy.title}</h2>
        <p className="mt-1 text-sm text-foreground/70">{copy.description}</p>
      </div>
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.28em] text-foreground/50">
              {copy.configuration}
            </span>
            <Badge variant="outline" className="text-xs uppercase tracking-[0.28em]">
              {model.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-foreground/75 md:grid-cols-2">
          <ReviewRow label={copy.fabric} value={fabric?.name ?? copy.missingValue} />
          <ReviewRow label={copy.color} value={color?.name ?? copy.missingValue} />
          <ReviewRow label={copy.length} value={length?.name ?? copy.missingValue} />
          <ReviewRow
            label={copy.rush}
            value={values.rushOrder ? copy.rushRequested : copy.rushStandard}
          />
          <ReviewRow label={copy.notes} value={values.notes || copy.noNotes} />
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/50">
            <span>{copy.measurements}</span>
            <span>{copy.measurementUnit}</span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {measurementEntries.map((entry) => (
            <ReviewRow
              key={entry.key}
              label={getLabel(entry.key)}
              value={
                entry.value
                  ? `${entry.value} ${copy.measurementUnit}`
                  : copy.missingValue
              }
            />
          ))}
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-border/45 bg-background/80 p-5">
        <label className="flex items-start gap-3 text-left">
          <input
            type="checkbox"
            {...register("saveMeasurementProfile")}
            className="mt-1 h-4 w-4 rounded border-border/60 bg-background accent-foreground"
          />
          <span className="space-y-1">
            <span className="block text-sm font-semibold text-foreground">
              {copy.saveProfileTitle}
            </span>
            <span className="block text-xs text-foreground/60">
              {copy.saveProfileDescription}
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border/40 bg-background/80 p-4">
      <span className="text-xs uppercase tracking-[0.28em] text-foreground/50">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
