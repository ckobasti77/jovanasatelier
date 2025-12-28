"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ProfileForm } from "@/components/profiles/profile-form";
import { useConvexMutation, useConvexQuery } from "@/lib/convex-client";
import { useSessionToken } from "@/hooks/use-session-token";
import { getErrorMessage } from "@/lib/error";

const FORM_COPY = {
  en: {
    badge: "atelier profiles",
    title: "Edit measurement profile",
    description: "Update the profile and we will sync changes with your configurator presets.",
    label: "Profile label",
    labelHelper: "Example: Barefoot ceremony or 8cm heels.",
    bust: "Bust (cm)",
    waist: "Waist (cm)",
    hips: "Hips (cm)",
    height: "Height (cm)",
    heel: "Heel height (cm)",
    notes: "Notes",
    notesHelper: "Optional: add preferred bra, desired ease, or styling reminders.",
    save: "Save changes",
    saving: "Saving...",
    delete: "Delete profile",
    deleting: "Deleting...",
    back: "Back to profiles",
    error: "We could not save the profile. Try again.",
    deleteError: "We could not delete the profile. Try again.",
  },
  sr: {
    badge: "atelje profili",
    title: "Uredi profil mera",
    description: "Azuriraj profil i sinhronizovacemo promene sa konfiguratorom.",
    label: "Naziv profila",
    labelHelper: "Primer: Bosa ceremonija ili 8cm stikle.",
    bust: "Grudi (cm)",
    waist: "Struk (cm)",
    hips: "Kukovi (cm)",
    height: "Visina (cm)",
    heel: "Visina stikle (cm)",
    notes: "Beleske",
    notesHelper:
      "Opcionalno: omiljeni grudnjak, zeljena lakoca ili styling napomene.",
    save: "Sacuvaj izmene",
    saving: "Cuvamo...",
    delete: "Obrisi profil",
    deleting: "Brisemo...",
    back: "Nazad na profile",
    error: "Profil nije sacuvan. Pokusaj ponovo.",
    deleteError: "Profil nije obrisan. Pokusaj ponovo.",
  },
} as const;

export default function EditProfilePage() {
  const params = useParams<{ profileId: string }>();
  const profileId = params?.profileId;
  const sessionToken = useSessionToken();
  const { language } = useLanguage();
  const copy = FORM_COPY[language];
  const router = useRouter();

  const profiles = useConvexQuery("profiles:list", {
    sessionToken: sessionToken ?? undefined,
  }) as Array<{
    id?: string;
    _id?: string;
    label: string;
    bust: number;
    waist: number;
    hips: number;
    height: number;
    heel: number;
    notes?: string;
  }> | undefined;

  const profile = useMemo(() => {
    if (profiles === undefined) return undefined;
    if (!profileId) return null;

    const match = profiles.find((item) => {
      const id = item.id ?? item._id;
      return id === profileId;
    });

    if (!match) return null;

    return {
      id: match.id ?? match._id ?? profileId,
      label: match.label,
      bust: match.bust,
      waist: match.waist,
      hips: match.hips,
      height: match.height,
      heel: match.heel,
      notes: match.notes,
    };
  }, [profiles, profileId]);

  const updateProfile = useConvexMutation("profiles:upsert");
  const deleteProfile = useConvexMutation("profiles:remove");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (profile === null) {
      router.replace("/profiles");
    }
  }, [profile, router]);

  if (profile === undefined) {
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
          </div>
          <div className="flex gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        <Card className="border-border/40 bg-background/85">
          <CardContent className="flex items-center justify-center py-24 text-sm text-foreground/60">
            Loading profile...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile === null) {
    return null;
  }

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
            defaultValues={{
              label: profile.label,
              bust: profile.bust,
              waist: profile.waist,
              hips: profile.hips,
              height: profile.height,
              heel: profile.heel,
              notes: profile.notes,
            }}
            submitting={isSubmitting}
            deleting={isDeleting}
            onSubmit={async (values) => {
              setFeedback(null);
              setIsSubmitting(true);
              try {
                await updateProfile({
                  sessionToken: sessionToken ?? undefined,
                  profileId,
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
                setFeedback(getErrorMessage(error, copy.error, language));
              } finally {
                setIsSubmitting(false);
              }
            }}
            onDelete={async () => {
              setFeedback(null);
              setIsDeleting(true);
              try {
                await deleteProfile({
                  sessionToken: sessionToken ?? undefined,
                  profileId,
                });
                router.push("/profiles");
              } catch (error) {
                setFeedback(getErrorMessage(error, copy.deleteError, language));
              } finally {
                setIsDeleting(false);
              }
            }}
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
              delete: copy.delete,
              deleting: copy.deleting,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

