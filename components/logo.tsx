"use client";

import { Cormorant_Garamond, Great_Vibes } from "next/font/google";

import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const brandScript = Great_Vibes({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const brandSerif = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: "500",
});

type LogoProps = {
  className?: string;
  subtitle?: string;
};

export function Logo({ className, subtitle }: LogoProps) {
  const { language } = useLanguage();
  const primaryLabel = language === "sr" ? "Jovanin" : "Jovana's";
  const secondaryLabel = language === "sr" ? "Atelje" : "atelier";

  return (
    <div className={cn("flex flex-col leading-tight", className)}>
      <span
        className={cn(
          "text-3xl text-foreground transition-colors md:text-[2.5rem]",
          brandScript.className,
        )}
      >
        {primaryLabel}
      </span>
      <span
        className={cn(
          "text-sm uppercase tracking-[0.65em] text-foreground/80 transition-colors md:text-lg",
          "dark:text-foreground/70",
          brandSerif.className,
        )}
      >
        {secondaryLabel}
      </span>
      {subtitle ? (
        <span className="mt-2 text-[0.55rem] uppercase tracking-[0.32em] text-foreground/60 transition-colors md:text-xs">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
