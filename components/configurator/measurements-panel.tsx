import { Controller, useFormContext } from "react-hook-form";

import { useLanguage } from "@/components/language-provider";
import {
  type ConfiguratorInput,
  measurementOrder,
} from "@/lib/configurator-schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMeasurementLabels } from "@/hooks/use-measurement-labels";

const PANEL_COPY = {
  en: {
    title: "Add your measurements",
    description:
      "Follow the prompts and enter values in centimeters. The fit assistant checks tolerances and gives you confidence feedback.",
    coreTitle: "core measurements",
    cmLabel: "cm",
    assistantTitle: "fit assistant",
    assistantOptional: "optional",
    bodyFields: {
      height: {
        label: "Height",
        helper: "Without shoes, stand tall against a wall.",
      },
      weight: {
        label: "Weight",
        helper: "Used only to improve fit confidence.",
      },
      braBand: {
        label: "Bra band",
        helper: "Number from your usual bra band size.",
      },
      braCup: {
        label: "Bra cup",
        helper: "Average cup you wear.",
        select: "Select cup",
      },
    },
    privacyNote:
      "We store profiles securely and only share necessary measurements with the atelier production team.",
    warning:
      "Double-check highlighted fields above -- some measurements need tweaks.",
  },
  sr: {
    title: "Dodaj svoje mere",
    description:
      "Unesi vrednosti u centimetrima prema smernicama. Fit asistent proverava tolerancije i daje povratnu informaciju o sigurnosti uklapanja.",
    coreTitle: "osnovne mere",
    cmLabel: "cm",
    assistantTitle: "fit asistent",
    assistantOptional: "opciono",
    bodyFields: {
      height: {
        label: "Visina",
        helper: "Bez obuće, uspravi se uz zid.",
      },
      weight: {
        label: "Težina",
        helper: "Koristimo je samo za preciznije uklapanje.",
      },
      braBand: {
        label: "Obim grudnjaka",
        helper: "Broj koji nosiš kao obim grudnjaka.",
      },
      braCup: {
        label: "Korpa grudnjaka",
        helper: "Najčešća veličina korpe koju nosiš.",
        select: "Izaberi korpu",
      },
    },
    privacyNote:
      "Profile čuvamo sigurno i delimo samo neophodne mere sa proizvodnim timom.",
    warning:
      "Proveri označena polja -- neke vrednosti treba prilagoditi.",
  },
} as const;

export function MeasurementsPanel() {
  const { control, formState } = useFormContext<ConfiguratorInput>();
  const { language } = useLanguage();
  const copy = PANEL_COPY[language];
  const { getLabel, getHelper } = useMeasurementLabels();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-foreground">{copy.title}</h2>
        <p className="text-sm text-foreground/70">{copy.description}</p>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/50">
            <span>{copy.coreTitle}</span>
            <span>{copy.cmLabel}</span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          {measurementOrder.map((fieldKey) => (
            <Controller
              key={fieldKey}
              control={control}
              name={`measurements.${fieldKey}`}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label
                    htmlFor={`measurement-${fieldKey}`}
                    helper={getHelper(fieldKey)}
                  >
                    {getLabel(fieldKey)}
                  </Label>
                  <Input
                    id={`measurement-${fieldKey}`}
                    placeholder="0"
                    inputMode="decimal"
                    value={
                      field.value === undefined || field.value === null
                        ? ""
                        : String(field.value)
                    }
                    onChange={(event) => field.onChange(event.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  {fieldState.error ? (
                    <p className="text-xs text-rose-500">{fieldState.error.message}</p>
                  ) : null}
                </div>
              )}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/50">
            <span>{copy.assistantTitle}</span>
            <span>{copy.assistantOptional}</span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <Controller
            control={control}
            name="bodyProfile.height"
            render={({ field, fieldState }) => (
              <MeasurementField
                id="profile-height"
                label={copy.bodyFields.height.label}
                helper={copy.bodyFields.height.helper}
                field={field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="bodyProfile.weight"
            render={({ field, fieldState }) => (
              <MeasurementField
                id="profile-weight"
                label={copy.bodyFields.weight.label}
                helper={copy.bodyFields.weight.helper}
                field={field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="bodyProfile.braBand"
            render={({ field, fieldState }) => (
              <MeasurementField
                id="profile-band"
                label={copy.bodyFields.braBand.label}
                helper={copy.bodyFields.braBand.helper}
                field={field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="bodyProfile.braCup"
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <Label
                  htmlFor="profile-cup"
                  helper={copy.bodyFields.braCup.helper}
                >
                  {copy.bodyFields.braCup.label}
                </Label>
                <select
                  id="profile-cup"
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || undefined)}
                  className="h-11 rounded-xl border border-border/60 bg-background/95 px-4 text-sm text-foreground focus:border-foreground/60 focus:outline-none focus:ring-4 focus:ring-foreground/10"
                >
                  <option value="">{copy.bodyFields.braCup.select}</option>
                  {["AA", "A", "B", "C", "D", "DD", "E", "F"].map((cup) => (
                    <option key={cup} value={cup}>
                      {cup}
                    </option>
                  ))}
                </select>
                {fieldState.error ? (
                  <p className="text-xs text-rose-500">{fieldState.error.message}</p>
                ) : null}
              </div>
            )}
          />
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-foreground/55">{copy.privacyNote}</p>
        </CardFooter>
      </Card>

      {formState.errors.measurements ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-100/50 p-4 text-sm text-rose-700">
          {copy.warning}
        </div>
      ) : null}
    </div>
  );
}

type MeasurementFieldProps = {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  field: {
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
    ref: (instance: HTMLInputElement | null) => void;
  };
};

function MeasurementField({
  id,
  label,
  helper,
  field,
  error,
}: MeasurementFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} helper={helper}>
        {label}
      </Label>
      <Input
        id={id}
        value={
          field.value === undefined || field.value === null
            ? ""
            : String(field.value)
        }
        onChange={(event) => field.onChange(event.target.value)}
        onBlur={field.onBlur}
        ref={field.ref}
        inputMode="decimal"
        placeholder="0"
      />
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
