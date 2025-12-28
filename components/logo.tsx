"use client";

import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";

import { cn } from "@/lib/utils";

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
  const secondaryLabel = "Couture";

  return (
    <div className={cn("flex items-center gap-3 leading-tight", className)}>
      <Image
        src="/logo.png"
        alt="JeVeux Couture logo"
        width={128}
        height={128}
        className="h-12 w-12 md:h-20 md:w-20 shrink-0 object-contain [filter:drop-shadow(0_0_0.75px_rgba(0,0,0,0.9))] dark:[filter:drop-shadow(0_0_0.75px_rgba(255,255,255,0.95))]"
        priority
      />
      <div className="hidden md:flex flex-col">
        <Image
          src="/logo-text.png"
          alt="JeVeux"
          width={260}
          height={80}
          className="h-10 w-auto object-contain md:h-12 [filter:drop-shadow(0_0_0.75px_rgba(0,0,0,0.9))] dark:[filter:drop-shadow(0_0_0.75px_rgba(255,255,255,0.95))]"
          priority
        />
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
    </div>
  );
}
