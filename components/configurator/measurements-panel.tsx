import { useMemo, useState } from "react";
import Link from "next/link";
import { Controller, useFormContext } from "react-hook-form";

import { useLanguage } from "@/components/language-provider";
import {
  type ConfiguratorInput,
  measurementOrder,
  computeFitConfidence,
} from "@/lib/configurator-schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMeasurementLabels } from "@/hooks/use-measurement-labels";
import { useSessionToken } from "@/hooks/use-session-token";
import { useConvexQuery } from "@/lib/convex-client";

const PANEL_COPY = {
  en: {
    title: "Add your measurements",
    description:
      "Follow the prompts and enter values in centimeters. The fit assistant checks tolerances and gives you confidence feedback.",
    coreTitle: "core measurements",
    cmLabel: "cm",
    assistantTitle: "fit assistant",
    assistantOptional: "optional",
    profilesTitle: "saved profiles",
    profilesDescription: "Apply a saved profile to pre-fill core measurements.",
    profilesPlaceholder: "Select a profile",
    profilesEmpty: "Create a profile to speed up future fittings.",
    profilesManage: "Manage profiles",
    profilesNew: "New profile",
    profilesApplied: "Profile applied to the form.",
    fitTitle: "fit confidence",
    fitLevels: {
      high: {
        label: "High",
        description: "Fit confidence is high. Atelier will review within 24 hours.",
      },
      medium: {
        label: "Good",
        description: "Add optional profile info for even more precision.",
      },
      low: {
        label: "Needs details",
        description: "Complete core measurements and profile info for atelier accuracy.",
      },
    },
    fitMissingHeading: "Complete these next measurements for atelier accuracy:",
    fitAllSet: "All core measurements captured.",
    fitTipLabel: "Tip",
    fitLoading: "Calculating fit confidence...",
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
    profilesTitle: "sacuvani profili",
    profilesDescription: "Primeni sacuvan profil da unapred popunis osnovne mere.",
    profilesPlaceholder: "Izaberi profil",
    profilesEmpty: "Kreiraj profil da ubrzas buduce probe.",
    profilesManage: "Upravljaj profilima",
    profilesNew: "Novi profil",
    profilesApplied: "Profil je primenjen na formu.",
    fitTitle: "sigurnost uklapanja",
    fitLevels: {
      high: {
        label: "Visoka",
        description: "Sigurnost uklapanja je visoka. Atelje potvrđuje u roku od 24 sata.",
      },
      medium: {
        label: "Dobra",
        description: "Dodaj opcione informacije profila za još precizniji fit.",
      },
      low: {
        label: "Potrebno više",
        description: "Popuni osnovne mere i dodatni profil za preciznost na nivou ateljea.",
      },
    },
    fitMissingHeading: "Završi sledeće mere za atelje preciznost:",
    fitAllSet: "Sve osnovne mere su zabeležene.",
    fitTipLabel: "Savet",
    fitLoading: "Računamo sigurnost uklapanja...",
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

type MeasurementProfileRecord = {
  id: string;
  _id?: string;
  label: string;
  bust: number;
  waist: number;
  hips: number;
  height: number;
  heel: number;
  notes?: string;
};

export function MeasurementsPanel() {
  const { control, formState, setValue, watch } = useFormContext<ConfiguratorInput>();
  const { language } = useLanguage();
  const copy = PANEL_COPY[language];
  const { getLabel, getHelper } = useMeasurementLabels();
  const sessionToken = useSessionToken();
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  const profiles = useConvexQuery("profiles:list", {
    sessionToken: sessionToken ?? undefined,
  }) as MeasurementProfileRecord[] | undefined;

  const isLoadingProfiles = profiles === undefined;
  const hasProfiles = !!profiles && profiles.length > 0;

  const sortedProfiles = useMemo(
    () => (profiles ?? []).slice().sort((a, b) => a.label.localeCompare(b.label)),
    [profiles],
  );

  function handleProfileSelect(profileId: string) {
    setSelectedProfileId(profileId);
    const profile = sortedProfiles.find((item) => item.id === profileId);
    if (!profile) return;

    const options = { shouldValidate: true, shouldDirty: true };
    setValue("measurements.bust", profile.bust, options);
    setValue("measurements.waist", profile.waist, options);
    setValue("measurements.hips", profile.hips, options);
    setValue("measurements.height", profile.height, options);
    setValue("measurements.preferredHeel", profile.heel, options);
    setValue("bodyProfile.height", profile.height, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }

  const values = watch();
  const fitConfidence = useMemo(() => computeFitConfidence(values), [values]);
  const missingMeasurements = useMemo(() => {
    const currentMeasurements = (values?.measurements ?? {}) as Record<string, unknown>;
    return measurementOrder.filter((key) => {
      const current = currentMeasurements[key];
      return current === undefined || current === null || current === "";
    });
  }, [values]);
  const fitLevelCopy =
    copy.fitLevels[fitConfidence.level as keyof typeof copy.fitLevels];
  const highlightedKey = missingMeasurements[0];
  const highlightedTip = highlightedKey ? getHelper(highlightedKey) : undefined;
  const meterColor =
    fitConfidence.level === "high"
      ? "bg-emerald-400"
      : fitConfidence.level === "medium"
        ? "bg-amber-400"
        : "bg-rose-400";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-foreground">{copy.title}</h2>
        <p className="text-sm text-foreground/70">{copy.description}</p>
      </div>

      <Card className="border-border/50 bg-background/85">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">
                {copy.profilesTitle}
              </p>
              <p className="text-xs text-foreground/60">{copy.profilesDescription}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
              >
                <Link href="/profiles">{copy.profilesManage}</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]"
              >
                <Link href="/profiles/new">{copy.profilesNew}</Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoadingProfiles ? (
            <p className="text-sm text-foreground/60">Loading profiles...</p>
          ) : hasProfiles ? (
            <>
              <select
                value={selectedProfileId}
                onChange={(event) => handleProfileSelect(event.target.value)}
                disabled={isLoadingProfiles}
                className="h-11 w-full rounded-2xl border border-border/60 bg-background/90 px-4 text-sm text-foreground focus:border-foreground/60 focus:outline-none focus:ring-4 focus:ring-foreground/10"
              >
                <option value="">{copy.profilesPlaceholder}</option>
                {sortedProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.label}
                  </option>
                ))}
              </select>
              {selectedProfileId ? (
                <p className="text-xs text-emerald-500">{copy.profilesApplied}</p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-foreground/60">{copy.profilesEmpty}</p>
          )}
        </CardContent>
      </Card>

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
                    className="min-h-[3.5rem]"
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
        <CardContent className="space-y-6">
          <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/45">
              <span>{copy.fitTitle}</span>
              <span>{fitLevelCopy.label}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10">
              <div
                className={`h-full rounded-full ${meterColor}`}
                style={{ width: `${fitConfidence.percentage}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-foreground/55">{fitLevelCopy.description}</p>
            {missingMeasurements.length > 0 ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-foreground/50">
                  {copy.fitMissingHeading}
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingMeasurements.slice(0, 3).map((key) => (
                    <span
                      key={key}
                      className="rounded-full bg-foreground/10 px-3 py-1 text-xs text-foreground/70"
                    >
                      {getLabel(key)}
                    </span>
                  ))}
                </div>
                {highlightedKey && highlightedTip ? (
                  <p className="text-xs text-foreground/55">
                    <span className="font-semibold text-foreground/70">{copy.fitTipLabel}:</span>{" "}
                    {highlightedTip}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-4 text-xs text-emerald-500">{copy.fitAllSet}</p>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
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
                  className="min-h-[3.5rem]"
                >
                  {copy.bodyFields.braCup.label}
                </Label>
                <select
                  id="profile-cup"
                  value={field.value ?? ""}
                  onChange={(event) => field.onChange(event.target.value || undefined)}
                  className="h-11 w-full rounded-xl border border-border/60 bg-background/95 px-4 text-sm text-foreground focus:border-foreground/60 focus:outline-none focus:ring-4 focus:ring-foreground/10"
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
          </div>
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
      <Label htmlFor={id} helper={helper} className="min-h-[3.5rem]">
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




