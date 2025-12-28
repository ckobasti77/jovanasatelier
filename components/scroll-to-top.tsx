"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

const LABELS = {
  en: "Scroll to top",
  sr: "Vrati na vrh",
} as const;

export function ScrollToTop() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300 md:bottom-8 md:right-8",
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <Button
        type="button"
        variant="subtle"
        size="icon"
        aria-label={LABELS[language]}
        onClick={handleClick}
        className="rounded-full border border-border/60 bg-background/90 text-foreground shadow-[0_16px_32px_-18px_rgba(0,0,0,0.45)] backdrop-blur hover:bg-foreground/10"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
