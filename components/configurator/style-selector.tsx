import { useMemo, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { useLanguage } from "@/components/language-provider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalizedDressModel } from "@/hooks/use-dress-models";
import type { ConfiguratorInput } from "@/lib/configurator-schema";
import { cn } from "@/lib/utils";

const STYLE_SELECTOR_COPY = {
  en: {
    title: "Choose a palette and add notes",
    description: "Pick curated shades and add any atelier requests.",
    paletteTitle: "Palette",
    paletteDescription: "Choose from curated shades designed for this silhouette.",
    notesLabel: "Special notes",
    notesHelper: "Optional message to the atelier.",
    notesPlaceholder:
      "Add thoughts about sleeve adjustments, lining preferences, or styling requests...",
    rushLabel: "Rush atelier slot",
    rushDescription: "Need it sooner? We will confirm availability within 24 hours.",
    chooseLabel: "Choose",
    selectedLabel: "Selected",
  },
  sr: {
    title: "Izaberi paletu i dodaj napomene",
    description: "Izaberi nijanse i dodaj poruku za atelje.",
    paletteTitle: "Paleta",
    paletteDescription: "Biraj nijanse kurirane baš za ovu siluetu.",
    notesLabel: "Posebne napomene",
    notesHelper: "Opcionalna poruka za atelje.",
    notesPlaceholder:
      "Dodaj ideje o rukavima, postavi, željama za stilizovanje...",
    rushLabel: "Hitni atelje termin",
    rushDescription: "Ako ti je potrebno ranije, potvrdićemo dostupnost u roku od 24 sata.",
    chooseLabel: "Izaberi",
    selectedLabel: "Izabrano",
  },
} as const;

type StyleSelectorProps = {
  modelId: string;
};

type StatusLabels = {
  active: string;
  inactive: string;
};

type OptionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  active: boolean;
  statusLabels: StatusLabels;
  onSelect: () => void;
  children?: ReactNode;
};

function OptionCard({
  eyebrow,
  title,
  description,
  meta,
  active,
  statusLabels,
  onSelect,
  children,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-full flex-col gap-3 rounded-2xl border border-border/50 bg-background/85 p-5 text-left transition hover:border-foreground/40 hover:shadow-[0_18px_45px_-30px_rgba(15,23,42,.55)]",
        active && "border-foreground/60 shadow-[0_20px_45px_-18px_rgba(84,73,187,.35)]",
      )}
      aria-pressed={active}
    >
      {eyebrow ? (
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/50">
          <span>{eyebrow}</span>
          <span>{active ? statusLabels.active : statusLabels.inactive}</span>
        </div>
      ) : (
        <div className="flex items-center justify-end text-xs uppercase tracking-[0.28em] text-foreground/50">
          <span>{active ? statusLabels.active : statusLabels.inactive}</span>
        </div>
      )}
      <div>
        <h4 className="text-base font-semibold text-foreground">{title}</h4>
        {description ? <p className="text-sm text-foreground/65">{description}</p> : null}
      </div>
      {children ? <div className="pt-1">{children}</div> : null}
      {meta ? <span className="text-xs text-foreground/50">{meta}</span> : null}
    </button>
  );
}

export function StyleSelector({ modelId }: StyleSelectorProps) {
  const { language } = useLanguage();
  const copy = STYLE_SELECTOR_COPY[language];
  const model = useLocalizedDressModel(modelId);

  const { control, register, setValue, watch } = useFormContext<ConfiguratorInput>();

  const selectedColorId = watch("colorId");

  const statusLabels = useMemo<StatusLabels>(
    () => ({
      active: copy.selectedLabel,
      inactive: copy.chooseLabel,
    }),
    [copy.selectedLabel, copy.chooseLabel],
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{copy.title}</h2>
        <p className="mt-1 text-sm text-foreground/70">{copy.description}</p>
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-[0.28em] text-foreground/55">
            {copy.paletteTitle}
          </Label>
          <p className="text-sm text-foreground/70">{copy.paletteDescription}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {model.colors.map((color) => (
            <OptionCard
              key={color.id}
              title={color.name}
              active={color.id === selectedColorId}
              statusLabels={statusLabels}
              onSelect={() =>
                setValue("colorId", color.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-10 w-10 rounded-full border border-border/40"
                  style={{
                    background: color.secondary
                      ? `linear-gradient(135deg, ${color.swatch} 0%, ${color.secondary} 100%)`
                      : color.swatch,
                  }}
                  aria-hidden="true"
                />
                <span className="text-xs text-foreground/55">{color.secondary ?? color.swatch}</span>
              </div>
            </OptionCard>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="config-notes" className="text-xs uppercase tracking-[0.28em] text-foreground/55">
            {copy.notesLabel}
          </Label>
          <p className="text-xs text-foreground/50">{copy.notesHelper}</p>
        </div>
        <Textarea
          id="config-notes"
          {...register("notes")}
          placeholder={copy.notesPlaceholder}
          className="min-h-[140px]"
        />
      </section>

      <section className="rounded-2xl border border-border/40 bg-background/85 p-5">
        <Controller
          name="rushOrder"
          control={control}
          render={({ field }) => (
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={field.value ?? false}
                onChange={(event) =>
                  field.onChange(event.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border border-border/50 accent-foreground/70"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{copy.rushLabel}</p>
                <p className="text-xs text-foreground/60">{copy.rushDescription}</p>
              </div>
            </label>
          )}
        />
      </section>
    </div>
  );
}
