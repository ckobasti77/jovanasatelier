"use client";

import type { ComponentType } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const MODES = ["light", "dark"] as const;

const MODE_DETAILS: Record<
  (typeof MODES)[number],
  { label: string; icon: ComponentType<{ className?: string }> }
> = {
  light: { label: "Day", icon: Sun },
  dark: { label: "Night", icon: Moon },
};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const current = resolvedTheme;
  const nextIndex = (MODES.indexOf(current) + 1) % MODES.length;
  const nextMode = MODES[nextIndex];

  const Icon = MODE_DETAILS[current].icon;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="flex items-center justify-center rounded-full border border-border/60 bg-background/80 p-2 text-foreground hover:bg-foreground/10"
      onClick={() => setTheme(nextMode)}
      aria-label={`Switch theme to ${MODE_DETAILS[nextMode].label}`}
      title={`Next: ${MODE_DETAILS[nextMode].label}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

