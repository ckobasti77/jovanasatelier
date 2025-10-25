"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ProfileForm } from "@/components/profiles/profile-form";
import { useConvexMutation } from "@/lib/convex-client";
import { useSessionToken } from "@/hooks/use-session-token";
import { getErrorMessage } from "@/lib/error";

const FORM_COPY = {
  en: {
    badge: "atelier profiles",
    title: "Create measurement profile",
    description: "Save a profile to reuse measurements and speed up future orders.",
    label: "Profile label",
    labelHelper: "Example: Barefoot ceremony or Jovana - 8cm heels.",
    bust: "Bust (cm)",
    waist: "Waist (cm)",
    hips: "Hips (cm)",
    height: "Height (cm)",
    heel: "Heel height (cm)",
    notes: "Notes",
    notesHelper: "Optional: add preferred bra, desired ease, or styling reminders.",
    save: "Save profile",
    saving: "Saving...",
    back: "Back to profiles",
    error: "We could not save the profile. Try again.",
  },
  sr: {
    badge: "atelje profili",
    title: "Kreiraj profil mera",
    description: "Sa�?uvaj profil da bi ubrzala budu�?e porud�_bine i provere.",
    label: "Naziv profila",
    labelHelper: "Primer: Bosa ceremonija ili Jovana - 8cm ��tikle.",
    bust: "Grudi (cm)",
    waist: "Struk (cm)",
    hips: "Kukovi (cm)",
    height: "Visina (cm)",
    heel: "Visina ��tikle (cm)",
    notes: "Bele�_ke",
    notesHelper: "Opcionalno: omiljeni grudnjak, �?eljena lako�a ili styling napomene.",
    save: "Sa�?uvaj profil",
    saving: "�?uvamo...",
    back: "Nazad na profile",
    error: "Profil nije sa�?uvan. Poku��aj ponovo.",
  },
} as const;

export default function NewProfilePage() {
  const sessionToken = useSessionToken();
  const createProfile = useConvexMutation("profiles:upsert");
  const router = useRouter();
  const { language } = useLanguage();
  const copy = FORM_COPY[language];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 px-4 pb-16 pt-12 sm:gap-12 sm:px-6 sm:pb-24">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Badge variant="outline" className="uppercase tracking-[0.28em] text-xs text-foreground/60">
            {copy.badge}
          </Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{copy.title}</h1>
            <p className="text-sm text-foreground/65 sm:text-base">{copy.description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 sm:w-auto"
            onClick={() => router.push("/profiles")}
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Button>
          {feedback ? <p className="text-sm text-rose-500">{feedback}</p> : null}
        </div>
        <div className="flex gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <Card className="border-border/40 bg-background/85">
        <CardHeader />
        <CardContent>
          <ProfileForm
            submitting={isSubmitting}
            deleting={false}
            copy={{
              label: copy.label,
              labelHelper: copy.labelHelper,
              bust: copy.bust,
              waist: copy.waist,
              hips: copy.hips,
              height: copy.height,
              heel: copy.heel,
              notes: copy.notes,
              notesHelper: copy.notesHelper,
              save: copy.save,
              saving: copy.saving,
            }}
            onSubmit={async (values) => {
              setFeedback(null);
              setIsSubmitting(true);
              try {
                await createProfile({
                  sessionToken: sessionToken ?? undefined,
                  label: values.label,
                  bust: Number(values.bust),
                  waist: Number(values.waist),
                  hips: Number(values.hips),
                  height: Number(values.height),
                  heel: Number(values.heel),
                  notes: values.notes ?? undefined,
                });
                router.push("/profiles");
              } catch (error) {
                setFeedback(getErrorMessage(error, copy.error));
              } finally {
                setIsSubmitting(false);
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
