"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getErrorMessage, type Language } from "@/lib/error";
import "./globals.css";

const STORAGE_KEY = "jeveux-language";

const COPY = {
  en: {
    title: "Something went wrong",
    description:
      "We hit an unexpected issue. Please try again, or return to the homepage.",
    retry: "Try again",
    home: "Go to homepage",
    fallback: "Something went wrong. Please try again.",
  },
  sr: {
    title: "Doslo je do greske",
    description:
      "Doslo je do neocekivanog problema. Pokusajte ponovo ili se vratite na pocetnu.",
    retry: "Pokusaj ponovo",
    home: "Nazad na pocetnu",
    fallback: "Doslo je do greske. Pokusajte ponovo.",
  },
} as const;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [language] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored === "en" || stored === "sr" ? stored : "en";
    } catch {
      return "en";
    }
  });
  const copy = COPY[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
  }, [language]);

  const message = useMemo(
    () => getErrorMessage(error, copy.fallback, language),
    [error, copy.fallback, language],
  );

  useEffect(() => {
    console.error("Global error", error);
  }, [error]);

  return (
    <html lang={language} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {copy.title}
            </h1>
            <p className="text-sm text-foreground/70">{copy.description}</p>
            <p className="text-sm text-rose-700">{message}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button onClick={reset} className="w-full sm:w-auto">
              <RefreshCcw className="mr-2 h-4 w-4" />
              {copy.retry}
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">{copy.home}</Link>
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
