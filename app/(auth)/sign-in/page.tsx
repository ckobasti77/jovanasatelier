"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Lock, Mail, Sparkles } from "lucide-react";

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
    badge: "returning client",
    heading: "Sign in to your atelier portal.",
    subheading:
      "Continue configuring dresses, review production status, and chat with your concierge.",
    benefits: [
      "Track atelier production in real time",
      "Manage measurement profiles & adjustments",
      "Save inspiration boards for upcoming events",
    ],
    newTo: "New to JeVeux Couture?",
    createAccount: "Create account",
    orderNotice:
      "Please sign in to place your order. We saved your configuration and will return you to the final step.",
    emailLabel: "Email address",
    emailHelper: "We will send order updates and fittings to this email.",
    emailPlaceholder: "jovana@example.com",
    passwordLabel: "Password",
    passwordHelper: "Minimum 10 characters.",
    passwordPlaceholder: "Your secure password",
    remember: "Remember me",
    forgotPassword: "Forgot password?",
    errorMissing: "Please enter both email and password to continue.",
    errorFallback: "Unable to sign in. Please try again.",
    submit: "Sign in",
    submitLoading: "Signing in",
  },
  sr: {
    badge: "povratni klijent",
    heading: "Prijavi se na atelier portal.",
    subheading:
      "Nastavi konfiguraciju haljina, prati status izrade i dopisuj se sa concierge timom.",
    benefits: [
      "Prati izradu u atelieru u realnom vremenu",
      "Upravljaj profilima mera i korekcijama",
      "Sacuva inspiracione table za naredne dogadjaje",
    ],
    newTo: "Prvi put u JeVeux Couture?",
    createAccount: "Napravi nalog",
    orderNotice:
      "Prijavite se da biste porucili. Sacuvali smo konfiguraciju i vraticemo vas na poslednji korak.",
    emailLabel: "Email adresa",
    emailHelper: "Na ovaj email saljemo novosti o porudzbini i termine za probu.",
    emailPlaceholder: "jovana@example.com",
    passwordLabel: "Lozinka",
    passwordHelper: "Najmanje 10 karaktera.",
    passwordPlaceholder: "Vasa sigurna lozinka",
    remember: "Zapamti me",
    forgotPassword: "Zaboravljena lozinka?",
    errorMissing: "Unesite email i lozinku da biste nastavili.",
    errorFallback: "Ne mozemo da vas prijavimo. Pokusajte ponovo.",
    submit: "Prijavi se",
    submitLoading: "Prijavljivanje",
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

function SignInPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const copy = COPY[language];
  const signIn = useConvexMutation("auth:signIn");
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
  const signUpHref = buildAuthHref(
    "/sign-up",
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
    const email = (form.get("email") as string) ?? "";
    const password = (form.get("password") as string) ?? "";

    if (!email || !password) {
      setError(copy.errorMissing);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const result = await signIn({ email, password });
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
        <Badge variant="outline" className="uppercase tracking-[0.35em]">
          {copy.badge}
        </Badge>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            {copy.heading}
          </h2>
          <p className="text-sm text-foreground/70">
            {copy.subheading}
          </p>
        </div>
        <ul className="space-y-3 text-sm text-foreground/70">
          {copy.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <Sparkles className="mt-1 h-4 w-4 text-foreground/60" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <div className="text-xs uppercase tracking-[0.28em] text-foreground/50">
          {copy.newTo}{" "}
          <Link href={signUpHref} className="text-foreground underline-offset-4 hover:underline">
            {copy.createAccount}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[28px] border border-border/50 bg-background/80 p-8">
        {showOrderNotice ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-100/50 px-4 py-3 text-sm text-amber-800">
            {copy.orderNotice}
          </div>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="email" helper={copy.emailHelper}>
            {copy.emailLabel}
          </Label>
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
          <Label htmlFor="password" helper={copy.passwordHelper}>
            {copy.passwordLabel}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={copy.passwordPlaceholder}
            className="rounded-2xl pl-10"
            icon={<Lock className="h-4 w-4 text-foreground/50" />}
          />
        </div>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/55">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border border-border/60 accent-foreground"
            />
            {copy.remember}
          </label>
            <Link href="/forgot-password" className="text-foreground underline-offset-4 hover:underline">
            {copy.forgotPassword}
          </Link>
        </div>

        {error ? (
          <div className={cn("rounded-2xl border border-rose-200 bg-rose-100/50 px-4 py-3 text-sm text-rose-700")}>
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

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-foreground/70">Loading sign-in...</div>}>
      <SignInPageContent />
    </Suspense>
  );
}
