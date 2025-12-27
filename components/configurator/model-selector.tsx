import Image from "next/image";
import { useFormContext } from "react-hook-form";

import { useLanguage } from "@/components/language-provider";
import { useLocalizedDressModels } from "@/hooks/use-dress-models";
import type { ConfiguratorInput } from "@/lib/configurator-schema";
import { cn } from "@/lib/utils";

const MODEL_SELECTOR_COPY = {
  en: {
    title: "Pick your starting silhouette",
    description:
      "Each model adjusts to your measurements. Choose the base that matches the mood and movement you want.",
    statusSelected: "Selected",
    statusChoose: "Choose",
  },
  sr: {
    title: "Izaberi početnu siluetu",
    description:
      "Svaki model se prilagođava tvojim merama. Izaberi osnovu koja prati energiju i pokret koji želiš.",
    statusSelected: "Izabrano",
    statusChoose: "Izaberi",
  },
} as const;

const SILHOUETTE_LABELS = {
  en: {
    "a-line": "A-line",
    mermaid: "Mermaid",
    sheath: "Sheath",
    ballgown: "Ballgown",
  },
  sr: {
    "a-line": "A-linija",
    mermaid: "Sirena",
    sheath: "Kolona",
    ballgown: "Balska",
  },
} as const;

export function ModelSelector() {
  const { register, watch, setValue } = useFormContext<ConfiguratorInput>();
  const { language } = useLanguage();
  const copy = MODEL_SELECTOR_COPY[language];
  const selectedModel = watch("modelId");
  const models = useLocalizedDressModels();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">{copy.title}</h2>
        <p className="mt-1 text-sm text-foreground/70">{copy.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {models.map((model) => {
          const selected = model.id === selectedModel;
          const { name, ref, onBlur, onChange } = register("modelId");
          return (
            <label
              key={model.id}
              className={cn(
                "relative flex cursor-pointer flex-col gap-4 rounded-[28px] border border-border/50 bg-background/85 p-6 transition hover:border-foreground/40 hover:shadow-[0_18px_45px_-30px_rgba(15,23,42,.55)]",
                selected && "border-foreground/60 shadow-[0_20px_45px_-20px_rgba(84,73,187,.35)]",
              )}
            >
              <input
                type="radio"
                value={model.id}
                className="sr-only"
                name={name}
                ref={ref}
                onBlur={onBlur}
                onChange={(event) => {
                  onChange(event);
                  setValue("modelId", event.target.value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
              />
              <div className="absolute inset-x-6 top-6 flex items-center justify-between">
                <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-foreground/70">
                  {SILHOUETTE_LABELS[language][model.silhouette] ?? model.silhouette}
                </span>
              </div>
              <Image
                src={model.heroImage}
                alt={`${model.name} couture dress`}
                width={640}
                height={800}
                className="h-80 w-full object-contain transition duration-500 group-hover:scale-[1.02]"
              />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{model.name}</h3>
                <p className="text-sm text-foreground/65">{model.description}</p>
              </div>
              <ul className="space-y-1 text-xs text-foreground/55">
                {model.highlights.map((highlight) => (
                  <li key={highlight}>- {highlight}</li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                {model.colors.map((color) => (
                  <span
                    key={color.id}
                    role="img"
                    aria-label={color.name}
                    className="h-5 w-5 rounded-full border border-border/50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    style={{
                      background: color.secondary
                        ? `linear-gradient(135deg, ${color.swatch} 0%, ${color.secondary} 100%)`
                        : color.swatch,
                    }}
                  />
                ))}
              </div>
              <span className="sr-only">
                {selected ? copy.statusSelected : copy.statusChoose}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
