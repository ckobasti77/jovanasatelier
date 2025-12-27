"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Lock, Mail, Phone, Sparkles, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";
import { useSessionToken } from "@/hooks/use-session-token";
import { saveSessionToken } from "@/lib/auth-storage";
import { useConvexMutation, useConvexQuery } from "@/lib/convex-client";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";

const COPY = {
  en: {
    badge: "new muse",
    heading: "Create your atelier profile.",
    subheading:
      "A single place to manage measurements, track bespoke orders, and reach your stylist team.",
    highlights: [
      "Craft multiple measurement profiles for different occasions",
      "Save configuration drafts and share with friends",
      "Unlock concierge styling sessions & alteration tokens",
    ],
    already: "Already part of the atelier?",
    signIn: "Sign in instead",
    orderNotice:
      "Create an account to place your order. We saved your configuration and will return you to the final step.",
    nameLabel: "Full name",
    namePlaceholder: "Jovana Novak",
    emailLabel: "Email address",
    emailPlaceholder: "jovana@example.com",
    phoneLabel: "Phone / WhatsApp",
    phoneHelper: "Optional. Concierge will use this for fittings.",
    phonePlaceholder: "+381 XX XXX",
    passwordLabel: "Password",
    passwordPlaceholder: "Create a strong password",
    confirmLabel: "Confirm password",
    confirmPlaceholder: "Repeat password",
    terms: "I agree with atelier terms and privacy policy.",
    errorMissing: "Please complete all required fields to continue.",
    errorMismatch: "Passwords need to match.",
    errorFallback: "Unable to create account. Please try again.",
    submit: "Create account",
    submitLoading: "Creating account",
  },
  sr: {
    badge: "nova muza",
    heading: "Kreiraj svoj atelier profil.",
    subheading:
      "Jedno mesto za upravljanje merama, pracenje bespoke porudzbina i kontakt sa stilistima.",
    highlights: [
      "Napravi vise profila mera za razlicite prilike",
      "Sacuvaj nacrte konfiguracija i podeli sa prijateljima",
      "Otkljucaj concierge sesije i tokene za korekcije",
    ],
    already: "Vec si deo ateljea?",
    signIn: "Prijavi se",
    orderNotice:
      "Napravi nalog da biste porucili. Sacuvali smo konfiguraciju i vraticemo vas na poslednji korak.",
    nameLabel: "Ime i prezime",
    namePlaceholder: "Jovana Novak",
    emailLabel: "Email adresa",
    emailPlaceholder: "jovana@example.com",
    phoneLabel: "Telefon / WhatsApp",
    phoneHelper: "Opcionalno. Concierge tim koristi ovo za probe.",
    phonePlaceholder: "+381 XX XXX",
    passwordLabel: "Lozinka",
    passwordPlaceholder: "Kreiraj jaku lozinku",
    confirmLabel: "Potvrdi lozinku",
    confirmPlaceholder: "Ponovi lozinku",
    terms: "Slazem se sa uslovima ateljea i politikom privatnosti.",
    errorMissing: "Popunite sva obavezna polja da biste nastavili.",
    errorMismatch: "Lozinke moraju da se podudaraju.",
    errorFallback: "Ne mozemo da napravimo nalog. Pokusajte ponovo.",
    submit: "Kreiraj nalog",
    submitLoading: "Kreiranje naloga",
  },
} as const;

const getSafeReturnTo = (value: string | null) => {
  if (!value) {
    return null;
  }
  if (!value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
};

const buildAuthHref = (
  base: string,
  intent: string | null,
  returnTo: string | null,
) => {
  const params = new URLSearchParams();
  if (intent) {
    params.set("intent", intent);
  }
  if (returnTo) {
    params.set("returnTo", returnTo);
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
};

function SignUpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const copy = COPY[language];
  const signUp = useConvexMutation("auth:signUp");
  const sessionToken = useSessionToken();
  const viewer = useConvexQuery(
    "session:viewer",
    sessionToken === null ? { sessionToken: undefined } : { sessionToken },
  ) as { user?: { role?: string | null } } | null | undefined;
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewerReady = viewer !== undefined;
  const viewerHasUser = Boolean(viewer?.user);
  const viewerRole = viewer?.user?.role ?? null;
  const intent = searchParams.get("intent");
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
  const showOrderNotice = intent === "order";
  const signInHref = buildAuthHref(
    "/sign-in",
    showOrderNotice ? "order" : null,
    returnTo,
  );

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!sessionToken) return;
    if (!viewerReady) return;
    if (!viewerHasUser) return;

    const target = returnTo ?? (viewerRole === "admin" ? "/admin" : "/portal");
    router.replace(target);
  }, [
    hasHydrated,
    sessionToken,
    viewerReady,
    viewerHasUser,
    viewerRole,
    returnTo,
    router,
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = (form.get("name") as string) ?? "";
    const email = (form.get("email") as string) ?? "";
    const phone = (form.get("phone") as string) ?? "";
    const password = (form.get("password") as string) ?? "";
    const confirm = (form.get("confirmPassword") as string) ?? "";

    if (!name || !email || !password) {
      setError(copy.errorMissing);
      return;
    }
    if (password !== confirm) {
      setError(copy.errorMismatch);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const result = await signUp({
        name,
        email,
        password,
        phone: phone || undefined,
      });
      if (!result?.sessionToken) {
        throw new Error(copy.errorFallback);
      }
      saveSessionToken(result.sessionToken);
      window.location.href = returnTo ?? "/portal";
    } catch (error) {
      setError(getErrorMessage(error, copy.errorFallback));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_0.9fr]">
      <div className="space-y-6">
        <Badge className="uppercase tracking-[0.35em]">{copy.badge}</Badge>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="text-sm text-foreground/70">
            {copy.subheading}
          </p>
        </div>
        <ul className="space-y-3 text-sm text-foreground/70">
          {copy.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <Sparkles className="mt-1 h-4 w-4 text-foreground/60" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <div className="text-xs uppercase tracking-[0.28em] text-foreground/50">
          {copy.already}{" "}
          <Link href={signInHref} className="text-foreground underline-offset-4 hover:underline">
            {copy.signIn}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[28px] border border-border/50 bg-background/80 p-8">
        {showOrderNotice ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-100/50 px-4 py-3 text-sm text-amber-800">
            {copy.orderNotice}
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">{copy.nameLabel}</Label>
            <Input
              id="name"
              name="name"
              placeholder={copy.namePlaceholder}
              className="rounded-2xl pl-10"
              icon={<UserRound className="h-4 w-4 text-foreground/50" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{copy.emailLabel}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={copy.emailPlaceholder}
              className="rounded-2xl pl-10"
              icon={<Mail className="h-4 w-4 text-foreground/50" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" helper={copy.phoneHelper}>
              {copy.phoneLabel}
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder={copy.phonePlaceholder}
              className="rounded-2xl pl-10"
              icon={<Phone className="h-4 w-4 text-foreground/50" />}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">{copy.passwordLabel}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={copy.passwordPlaceholder}
              className="rounded-2xl pl-10"
              icon={<Lock className="h-4 w-4 text-foreground/50" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{copy.confirmLabel}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={copy.confirmPlaceholder}
              className="rounded-2xl pl-10"
              icon={<Lock className="h-4 w-4 text-foreground/50" />}
            />
          </div>
        </div>

        <label className="flex items-start gap-3 text-xs text-foreground/60">
          <input
            type="checkbox"
            name="terms"
            required
            className="mt-1 h-4 w-4 rounded border border-border/60 accent-foreground"
          />
          <span className="uppercase tracking-[0.28em]">
            {copy.terms}
          </span>
        </label>

        {error ? (
          <div className={cn("rounded-2xl border border-rose-200 bg-rose-100/45 px-4 py-3 text-sm text-rose-700")}>
            {error}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full rounded-full py-6 text-sm font-semibold uppercase tracking-[0.32em]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {copy.submitLoading}
            </>
          ) : (
            <>
              {copy.submit}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-foreground/70">Loading sign-up...</div>}>
      <SignUpPageContent />
    </Suspense>
  );
}
