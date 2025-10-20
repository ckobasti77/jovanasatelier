"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { Logo } from "@/components/logo";
import { useSessionToken } from "@/hooks/use-session-token";
import { useConvexQuery } from "@/lib/convex-client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = {
  en: [
    { href: "#models", label: "Models" },
    { href: "#process", label: "How it works" },
    { href: "#fit", label: "Fit assistant" },
    { href: "#aftercare", label: "Aftercare" },
  ],
  sr: [
    { href: "#models", label: "Modeli" },
    { href: "#process", label: "Kako funkcioniše" },
    { href: "#fit", label: "Asistent za mere" },
    { href: "#aftercare", label: "Negovanje" },
  ],
} as const;

const SUBTITLE = {
  en: "design-to-fit couture",
  sr: "couture krojeno po meri",
} as const;

const CTAS = {
  en: {
    signIn: "Sign in",
    portal: "Client portal",
    adminPortal: "Admin portal",
    design: "Design your dress",
  },
  sr: {
    signIn: "Prijavi se",
    portal: "Portal za klijente",
    adminPortal: "Admin portal",
    design: "Kreiraj haljinu",
  },
} as const;

export function SiteHeader() {
  const { language } = useLanguage();
  const navItems = NAV_ITEMS[language];
  const subtitle = SUBTITLE[language];
  const ctas = CTAS[language];
  const sessionToken = useSessionToken();
  const viewer = useConvexQuery(
    "session:viewer",
    sessionToken === null ? { sessionToken: undefined } : { sessionToken },
  ) as { user?: { role?: string | null } } | null | undefined;
  const isAdmin = viewer?.user?.role === "admin";
  const isAuthenticated = Boolean(sessionToken && viewer?.user);
  const portalHref = isAdmin ? "/admin" : "/portal";
  const portalLabel = isAdmin ? ctas.adminPortal : ctas.portal;
  const navGapClass = language === "sr" ? "gap-2.5" : "gap-3";
  const navLinkClass = cn(
    "rounded-full py-2 font-semibold uppercase text-foreground/65 transition hover:bg-foreground/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30",
    language === "sr"
      ? "px-3 text-[0.6rem] tracking-[0.18em]"
      : "px-4 text-[0.62rem] tracking-[0.22em]",
  );
  const designButtonClass =
    language === "en"
      ? "whitespace-nowrap px-3 text-sm tracking-[0.06em]"
      : "whitespace-nowrap";

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-b from-background/95 via-background/90 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 md:gap-6 md:py-6">
        <Link href="/" className="group flex items-center gap-3 md:gap-4">
          <Logo className="transition group-hover:scale-[1.02]" />
        </Link>
        <nav
          className={cn(
            "hidden items-center justify-center whitespace-nowrap md:flex",
            navGapClass,
          )}
        >
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-2.5 md:gap-3.5">
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href={isAuthenticated ? portalHref : "/sign-in"}>
              {isAuthenticated ? portalLabel : ctas.signIn}
            </Link>
          </Button>
          <Button asChild size="sm" className={designButtonClass}>
            <Link href="/configurator">{ctas.design}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
