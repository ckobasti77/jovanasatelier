"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Lock, Mail, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSessionToken } from "@/hooks/use-session-token";
import { saveSessionToken } from "@/lib/auth-storage";
import { useConvexMutation, useConvexQuery } from "@/lib/convex-client";
import { getErrorMessage } from "@/lib/error";
import { cn } from "@/lib/utils";

const benefits = [
  "Track atelier production in real time",
  "Manage measurement profiles & adjustments",
  "Save inspiration boards for upcoming events",
];

export default function SignInPage() {
  const router = useRouter();
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
    const email = (form.get("email") as string) ?? "";
    const password = (form.get("password") as string) ?? "";

    if (!email || !password) {
      setError("Please enter both email and password to continue.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const result = await signIn({ email, password });
      if (!result?.sessionToken) {
        throw new Error("Unable to sign in. Please try again.");
      }
      saveSessionToken(result.sessionToken);
      window.location.href = "/portal";
    } catch (error) {
      setError(getErrorMessage(error, "Unable to sign in. Please try again."));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_0.9fr]">
      <div className="space-y-6">
        <Badge variant="outline" className="uppercase tracking-[0.35em]">
          returning client
        </Badge>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Sign in to your atelier portal.
          </h2>
          <p className="text-sm text-foreground/70">
            Continue configuring dresses, review production status, and chat with your concierge.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-foreground/70">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <Sparkles className="mt-1 h-4 w-4 text-foreground/60" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <div className="text-xs uppercase tracking-[0.28em] text-foreground/50">
          New to Jovana Atelier?{" "}
          <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
            Create account
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[28px] border border-border/50 bg-background/80 p-8">
        <div className="space-y-2">
          <Label htmlFor="email" helper="We will send order updates and fittings to this email.">
            Email address
          </Label>
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
          <Label htmlFor="password" helper="Minimum 10 characters.">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Your secure password"
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
            Remember me
          </label>
            <Link href="/forgot-password" className="text-foreground underline-offset-4 hover:underline">
            Forgot password?
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
              Signing in
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
