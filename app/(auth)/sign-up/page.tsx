"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Lock, Mail, Phone, Sparkles, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSessionToken } from "@/hooks/use-session-token";
import { saveSessionToken } from "@/lib/auth-storage";
import { useConvexMutation, useConvexQuery } from "@/lib/convex-client";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";

const onboardingHighlights = [
  "Craft multiple measurement profiles for different occasions",
  "Save configuration drafts and share with friends",
  "Unlock concierge styling sessions & alteration tokens",
];

export default function SignUpPage() {
  const router = useRouter();
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

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!sessionToken) return;
    if (!viewerReady) return;
    if (!viewerHasUser) return;

    const target = viewerRole === "admin" ? "/admin" : "/portal";
    router.replace(target);
  }, [hasHydrated, sessionToken, viewerReady, viewerHasUser, viewerRole, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = (form.get("name") as string) ?? "";
    const email = (form.get("email") as string) ?? "";
    const phone = (form.get("phone") as string) ?? "";
    const password = (form.get("password") as string) ?? "";
    const confirm = (form.get("confirmPassword") as string) ?? "";

    if (!name || !email || !password) {
      setError("Please complete all required fields to continue.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords need to match.");
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
        throw new Error("Unable to create account.");
      }
      saveSessionToken(result.sessionToken);
      window.location.href = "/portal";
    } catch (error) {
      setError(getErrorMessage(error, "Unable to create account. Please try again."));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_0.9fr]">
      <div className="space-y-6">
        <Badge className="uppercase tracking-[0.35em]">new muse</Badge>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Create your atelier profile.
          </h2>
          <p className="text-sm text-foreground/70">
            A single place to manage measurements, track bespoke orders, and reach your stylist team.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-foreground/70">
          {onboardingHighlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <Sparkles className="mt-1 h-4 w-4 text-foreground/60" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <div className="text-xs uppercase tracking-[0.28em] text-foreground/50">
          Already part of the atelier?{" "}
          <Link href="/sign-in" className="text-foreground underline-offset-4 hover:underline">
            Sign in instead
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[28px] border border-border/50 bg-background/80 p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Jovana Novak"
              className="rounded-2xl pl-10"
              icon={<UserRound className="h-4 w-4 text-foreground/50" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jovana@example.com"
              className="rounded-2xl pl-10"
              icon={<Mail className="h-4 w-4 text-foreground/50" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" helper="Optional Â· Concierge will use this for fittings.">
              Phone / WhatsApp
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+381 XX XXX"
              className="rounded-2xl pl-10"
              icon={<Phone className="h-4 w-4 text-foreground/50" />}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              className="rounded-2xl pl-10"
              icon={<Lock className="h-4 w-4 text-foreground/50" />}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat password"
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
            I agree with atelier terms and privacy policy.
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
              Creating account
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
