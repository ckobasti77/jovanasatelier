"use client";

import Link from "next/link";

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const COPY = {
  en: {
    brand: "JeVeux Couture",
    heading: "Couture portal access",
    themeLabel: "Theme",
    home: "Home",
  },
  sr: {
    brand: "JeVeux Couture",
    heading: "Pristup couture portalu",
    themeLabel: "Tema",
    home: "Početna",
  },
} as const;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,232,252,0.55),_transparent_52%),linear-gradient(180deg,_rgba(248,246,255,0.7),_transparent_45%)] px-6 py-16 transition-colors duration-500">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.32em] text-foreground/50">
              {copy.brand}
            </p>
            <h1 className="text-2xl font-semibold text-foreground">{copy.heading}</h1>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-foreground/55">
            <span>{copy.themeLabel}</span>
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[0.65rem] font-semibold text-foreground transition hover:bg-foreground hover:text-background"
            >
              {copy.home}
            </Link>
          </div>
        </div>
        <div className="rounded-[32px] border border-border/40 bg-background/85 p-10 shadow-[0_40px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  );
}
