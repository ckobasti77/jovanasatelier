"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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
    { href: "/#models", label: "Models" },
    { href: "/#process", label: "How it works" },
    { href: "/#fit", label: "Fit assistant" },
    { href: "/#aftercare", label: "Aftercare" },
  ],
  sr: [
    { href: "/#models", label: "Modeli" },
    { href: "/#process", label: "Kako funkcionise" },
    { href: "/#fit", label: "Asistent za mere" },
    { href: "/#aftercare", label: "Negovanje" },
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
  const mobileNavLinkClass = cn(
    "w-full rounded-2xl border border-border/40 bg-background/95 px-6 py-3 text-sm font-semibold uppercase text-foreground/80 shadow-sm transition hover:bg-foreground/10",
    language === "sr" ? "tracking-[0.18em]" : "tracking-[0.22em]",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-b from-background/95 via-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-4 sm:px-6 md:py-6">
        <div className="flex flex-1 items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            className="border border-border/60 bg-background/80 text-foreground hover:bg-foreground/10 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="group flex items-center gap-3 md:gap-4">
            <Logo className="transition group-hover:scale-[1.02]" />
          </Link>
        </div>
        <nav
          className={cn(
            "hidden flex-1 items-center justify-center whitespace-nowrap md:flex",
            navGapClass,
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center justify-end gap-1 md:flex">
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href={isAuthenticated ? portalHref : "/sign-in"}>
              {isAuthenticated ? portalLabel : ctas.signIn}
            </Link>
          </Button>
          <Button asChild size="sm" className={designButtonClass}>
            <Link href="/configurator">{ctas.design}</Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="whitespace-nowrap px-3 text-sm tracking-[0.08em]"
          >
            <Link href="/configurator">{ctas.design}</Link>
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm md:hidden"
            role="presentation"
            onClick={closeMobileMenu}
          />
          <div
            className="fixed inset-x-0 top-0 z-50 flex h-full flex-col gap-6 bg-background/98 px-4 pb-10 pt-5 shadow-2xl transition md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="group flex items-center gap-3"
                onClick={closeMobileMenu}
              >
                <Logo className="h-10 w-auto transition group-hover:scale-[1.02]" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close navigation"
                className="border border-border/70 bg-background/80 text-foreground hover:bg-foreground/10"
                onClick={closeMobileMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-3 rounded-3xl border border-border/40 bg-background/95 p-3 shadow-lg backdrop-blur">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <Button
                asChild
                size="md"
                className="w-full justify-center px-6 text-base tracking-[0.08em]"
              >
                <Link href="/configurator" onClick={closeMobileMenu}>
                  {ctas.design}
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="md"
                className="w-full justify-center border border-border/50 bg-background/80 px-6 text-base"
              >
                <Link
                  href={isAuthenticated ? portalHref : "/sign-in"}
                  onClick={closeMobileMenu}
                >
                  {isAuthenticated ? portalLabel : ctas.signIn}
                </Link>
              </Button>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-background/60 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.26em] text-foreground/50">
                  {SUBTITLE[language]}
                </span>
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
