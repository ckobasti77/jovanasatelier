"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

const LANGUAGE_LABELS: Record<string, string> = {
  en: "EN",
  sr: "SR",
};

const LANGUAGE_TITLES: Record<string, string> = {
  en: "Switch to Serbian",
  sr: "Prebaci na engleski",
};

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const title = useMemo(() => LANGUAGE_TITLES[language] ?? LANGUAGE_TITLES.en, [language]);
  const label = useMemo(() => LANGUAGE_LABELS[language] ?? LANGUAGE_LABELS.en, [language]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="flex items-center justify-center rounded-full border border-border/60 bg-background/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.36em] text-foreground hover:bg-foreground/10"
      onClick={toggleLanguage}
      aria-label={title}
      title={title}
    >
      {label}
    </Button>
  );
}
