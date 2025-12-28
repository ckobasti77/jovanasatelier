"use client";

import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

const FAQ_COPY = {
  en: {
    badge: "faq",
    title: "Frequently asked questions",
    lead:
      "Answers to the most common questions about JeVeux, fittings, and delivery timelines.",
    items: [
      {
        question: "How does the configurator work?",
        answer:
          "Choose a base silhouette, then adjust fabric, color, and length. You can save measurement profiles and submit the final configuration to the atelier.",
      },
      {
        question: "How long does production take?",
        answer:
          "Standard production ranges from 6-10 weeks depending on complexity. Exact timelines are confirmed after review.",
      },
      {
        question: "Can I update measurements after ordering?",
        answer:
          "Yes. Contact the atelier within 7 days of placing the order so we can adjust the pattern before cutting.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes. We ship worldwide with tracked delivery and coordinate customs paperwork where required.",
      },
      {
        question: "What if I need alterations?",
        answer:
          "Your order includes alteration support. Reach out to schedule a fitting or share adjustment notes with our team.",
      },
      {
        question: "How do I book a fitting?",
        answer:
          "Use the concierge form in your portal or email us to reserve an in-studio or remote fitting slot.",
      },
    ],
    ctaTitle: "Still have questions?",
    ctaBody: "Start with the configurator or get in touch for a personalized consult.",
    ctaPrimary: "Start configuration",
    ctaSecondary: "About JeVeux",
  },
  sr: {
    badge: "faq",
    title: "Najcesca pitanja",
    lead:
      "Odgovori na najcesca pitanja o JeVeux, probama i rokovima isporuke.",
    items: [
      {
        question: "Kako radi konfigurator?",
        answer:
          "Izaberi osnovnu siluetu, zatim podesi tkaninu, boju i duzinu. Mozes sacuvati profile mera i poslati finalnu konfiguraciju ateljeu.",
      },
      {
        question: "Koliko traje izrada?",
        answer:
          "Standardni rok je 6-10 nedelja u zavisnosti od slozenosti. Tacan datum potvrdjujemo nakon pregleda.",
      },
      {
        question: "Da li mogu da izmenim mere nakon porudzbine?",
        answer:
          "Da. Javite se u roku od 7 dana kako bismo prilagodili kroj pre seckanja.",
      },
      {
        question: "Da li saljete u inostranstvo?",
        answer:
          "Da. Saljemo sirom sveta uz pracenje posiljke i pripremu carinske dokumentacije.",
      },
      {
        question: "Sta ako su potrebne prepravke?",
        answer:
          "Porudzbina ukljucuje podrsku za prepravke. Kontaktirajte nas za probu ili posaljite napomene.",
      },
      {
        question: "Kako zakazujem probu?",
        answer:
          "Koristite concierge formu u portalu ili posaljite email za termin u studiju ili online.",
      },
    ],
    ctaTitle: "Imate jos pitanja?",
    ctaBody: "Pokrenite konfigurator ili nam se javite za licnu konsultaciju.",
    ctaPrimary: "Pokreni konfigurator",
    ctaSecondary: "O JeVeux",
  },
} as const;

export default function FaqPage() {
  const { language } = useLanguage();
  const copy = FAQ_COPY[language];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-5xl flex-col gap-12 px-4 pb-24 pt-14 sm:gap-16 sm:px-6 sm:pb-28 sm:pt-20">
        <section className="space-y-4">
          <Badge variant="outline" className="w-fit uppercase tracking-[0.35em]">
            {copy.badge}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {copy.title}
          </h1>
          <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
            {copy.lead}
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {copy.items.map((item) => (
            <Card key={item.question} className="border-border/40 bg-background/80">
              <CardHeader className="pb-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {item.question}
                </h2>
              </CardHeader>
              <CardContent className="text-sm text-foreground/70">
                {item.answer}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="flex flex-col gap-4 rounded-[24px] border border-border/40 bg-background/80 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {copy.ctaTitle}
            </h3>
            <p className="text-sm text-foreground/70">
              {copy.ctaBody}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/configurator">{copy.ctaPrimary}</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full border border-foreground/15 sm:w-auto">
              <Link href="/o-jeveux">{copy.ctaSecondary}</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
