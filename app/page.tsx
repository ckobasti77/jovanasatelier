"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Layers3,
  MoveRight,
  Palette,
  Ruler,
  Sparkles,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useLocalizedDressModels } from "@/hooks/use-dress-models";
import { useLanguage } from "@/components/language-provider";

const HERO_HIGHLIGHTS = [
  {
    icon: <Layers3 className="h-6 w-6" />,
    copy: {
      en: {
        title: "Signature silhouettes",
        description: "Four couture-approved bases fine-tuned for modern bodies.",
      },
      sr: {
        title: "Potpisani modeli",
        description: "Četiri couture osnove prilagođene savremenoj figuri.",
      },
    },
  },
  {
    icon: <Ruler className="h-6 w-6" />,
    copy: {
      en: {
        title: "Precision fit",
        description: "Guided measurements with guardrails and live feedback.",
      },
      sr: {
        title: "Precizno uklapanje",
        description: "Vođeno uzimanje mera sa smernicama i trenutnim povratnim informacijama.",
      },
    },
  },
  {
    icon: <Palette className="h-6 w-6" />,
    copy: {
      en: {
        title: "Material artistry",
        description: "Luxury fabrics, curated palettes, unlimited iterations.",
      },
      sr: {
        title: "Materijalna poetika",
        description: "Luksuzne tkanine, birane palete i neograničene iteracije.",
      },
    },
  },
] as const;

const PROCESS_STEPS = [
  {
    step: "01",
    copy: {
      en: {
        title: "Choose your base",
        description:
          "Explore silhouettes, structure, and movement to find the foundation that resonates with your moment.",
      },
      sr: {
        title: "Izaberi bazu",
        description:
          "Istraži siluetu, konstrukciju i pokret kako bi pronašla osnovu koja odgovara tvom trenutku.",
      },
    },
  },
  {
    step: "02",
    copy: {
      en: {
        title: "Design the details",
        description:
          "Pick fabric, color, and length. Watch the preview adapt and save variations for later.",
      },
      sr: {
        title: "Oblikuj detalje",
        description:
          "Odaberi tkaninu, boju i dužinu. Posmatraj kako se prikaz menja i sačuvaj verzije za kasnije.",
      },
    },
  },
  {
    step: "03",
    copy: {
      en: {
        title: "Fit with confidence",
        description:
          "Guided measurement wizard with tolerances, how-to illustrations, and fit confidence scoring.",
      },
      sr: {
        title: "Meri sa sigurnošću",
        description:
          "Vođeni čarobnjak za mere uz tolerancije, ilustracije i indeks pouzdanosti uklapanja.",
      },
    },
  },
  {
    step: "04",
    copy: {
      en: {
        title: "Order & track",
        description:
          "Secure payment, shareable configuration PDF, and real-time atelier production tracker.",
      },
      sr: {
        title: "Poruči i prati",
        description:
          "Sigurno plaćanje, PDF konfiguracija za deljenje i praćenje izrade u realnom vremenu.",
      },
    },
  },
] as const;

const AFTERCARE_CARDS = [
  {
    copy: {
      en: {
        title: "Care ritual",
        description:
          "Keep your dress pristine with tailored washing, pressing, and storage instructions.",
      },
      sr: {
        title: "Ritual nege",
        description:
          "Očuvaj haljinu besprekornom uz prilagođena uputstva za pranje, peglanje i odlaganje.",
      },
    },
  },
  {
    copy: {
      en: {
        title: "Alteration pass",
        description:
          "Complimentary alteration tokens for the first 60 days with express turnaround.",
      },
      sr: {
        title: "Paket prepravki",
        description:
          "Besplatni vaučeri za prepravke tokom prvih 60 dana uz ubrzani rok isporuke.",
      },
    },
  },
  {
    copy: {
      en: {
        title: "Live support",
        description:
          "WhatsApp concierge and Instagram DM line for styling or fitting questions.",
      },
      sr: {
        title: "Živa podrška",
        description:
          "WhatsApp i Instagram concierge za pitanja o stilu i uklapanju.",
      },
    },
  },
] as const;

const HOME_COPY = {
  en: {
    hero: {
      badge: "design-to-fit",
      subline: "Handcrafted in Belgrade - Worldwide delivery",
      title: "Your body. Your measures. Four silhouettes to craft your dream dress.",
      description:
        "Allure, Blush, Elegance, and Valeria - signature models engineered to adapt to your shape. Configure fabrics, colors, and every centimeter of fit in a guided atelier experience built for zero guesswork.",
      primaryCta: "Launch configurator",
      secondaryCta: "Explore silhouettes",
      overlayTag: "JeVeux muse",
      overlayLabel: "featured look",
      overlayDescription: "Silk crepe column with draped shoulders and detachable sash.",
      overlayChips: ["Elegance edit", "Pearl", "Atelier 12h"],
      imageAlt: "Model wearing a hand-tailored evening gown",
    },
    models: {
      badge: "silhouettes",
      heading: "Four signatures, infinite variations.",
      cta: "View lookbook",
      pricePrefix: "from EUR",
      detailLabels: {
        fabrics: "Fabrics",
        palette: "Palette",
        production: "Production",
      },
      configureLabel: "Configure",
      viewDetails: "View details",
    },
    process: {
      badge: "process",
      heading: "A guided journey from spark to finished garment.",
      footerLabel: "guided & interactive",
    },
    fit: {
      badge: "fit assistant",
      heading: "Intelligent guidance so measurements feel easy.",
      bullets: [
        "Step-by-step measurement wizard with visual prompts, tolerance thresholds, and live validation.",
        "Fit confidence bar factors in height, bust-weight ratio, and chosen model silhouette for better recommendations.",
        "Save multiple measurement profiles - \"Heels\", \"Barefoot\" - and switch with one tap.",
      ],
      primaryCta: "Start measuring",
      secondaryCta: "Measurement guide",
      profileLabel: "profile: ceremony heels",
      confidenceLabel: "confidence: high",
      metricLabels: ["Bust", "Waist", "Hips", "Heel height"],
      metricValues: ["92 cm", "70 cm", "98 cm", "8 cm"],
      fitScoreLabel: "fit confidence",
      fitSummary:
        "Based on your Elegance configuration with Tencel Sateen. Try adjusting bust or heel height for refined drape.",
    },
    aftercare: {
      badge: "aftercare",
      heading: "Support beyond the atelier doors.",
      description:
        "Each order unlocks resources to keep your piece immaculate. From bespoke care routines to atelier check-ins and alteration credits, we stay with you long after the celebration.",
      guideCta: "Full aftercare guide",
      closingTitle: "Ready to step inside the atelier?",
      closingDescription:
        "Create an account to save measurement profiles, track production, and unlock early previews of new silhouettes.",
      primaryCta: "Open your profile",
      secondaryCta: "Sign in",
    },
  },
  sr: {
    hero: {
      badge: "po meri",
      subline: "Ručno rađeno u Beogradu — isporuka širom sveta",
      title: "Tvoje telo. Tvoje mere. Četiri modela za haljinu iz snova.",
      description:
        "Allure, Blush, Elegance i Valeria — potpisani modeli projektovani da se prilagode tvojoj figuri. Konfiguriši tkanine, boje i svaki centimetar kroja uz vođeno atelje iskustvo bez nagađanja.",
      primaryCta: "Pokreni konfigurator",
      secondaryCta: "Istraži modele",
      overlayTag: "Muza JeVeux",
      overlayLabel: "izdvojeni look",
      overlayDescription: "Svileni krep u kolonskom kroju sa drapiranim ramenima i odvojivim pojasom.",
      overlayChips: ["Elegance edicija", "Biser", "Atelje 12h"],
      imageAlt: "Model u ručno šivanoj večernjoj haljini",
    },
    models: {
      badge: "modeli",
      heading: "Četiri potpisa, beskrajne varijacije.",
      cta: "Pogledaj lookbook",
      pricePrefix: "od EUR",
      detailLabels: {
        fabrics: "Tkanine",
        palette: "Paleta",
        production: "Vreme izrade",
      },
      configureLabel: "Konfiguriši",
      viewDetails: "Vidi detalje",
    },
    process: {
      badge: "proces",
      heading: "Vodeno putovanje od iskre do zavrsene haljine.",
      footerLabel: "vodeno & interaktivno",
    },
    fit: {
      badge: "fit asistent",
      heading: "Inteligentno vodenje za lako uzimanje mera.",
      bullets: [
        "Korak-po-korak carobnjak za mere sa vizuelnim instrukcijama, tolerancijama i trenutnom validacijom.",
        "Traka pouzdanosti uklapanja uzima u obzir visinu, odnos grudi i tezine i odabranu siluetu modela za preciznije preporuke.",
        "Sacuvaj vise profila mera - \"U stiklama\", \"Bosa\" - i menjaj ih jednim dodirom.",
      ],
      primaryCta: "Pocni sa merenjem",
      secondaryCta: "Vodic za mere",
      profileLabel: "profil: u stiklama",
      confidenceLabel: "sigurnost: visoka",
      metricLabels: ["Grudi", "Struk", "Kukovi", "Visina stikle"],
      metricValues: ["92 cm", "70 cm", "98 cm", "8 cm"],
      fitScoreLabel: "sigurnost uklapanja",
      fitSummary:
        "Zasnovano na tvojoj Elegance konfiguraciji sa tencel satenom. Podesi obim grudi ili visinu stikle za jos bolji pad.",
    },
    aftercare: {
      badge: "nega",
      heading: "Podrška i kada izađeš iz ateljea.",
      description:
        "Svaka porudžbina otključava resurse da haljina ostane besprekorna. Od personalizovanih rituala nege do atelier saveta i kredita za prepravke, ostajemo uz tebe i posle proslave.",
      closingTitle: "Spremna da zakoračiš u atelje?",
      closingDescription:
        "Kreiraj nalog, sačuvaj profile mera, prati izradu i otključaj rani pristup novim siluetama.",
      primaryCta: "Otvori svoj profil",
      secondaryCta: "Prijavi se",
      guideCta: "Kompletan vodic za negu",
    },
  },
} as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-6xl flex-col gap-16 px-4 pb-28 pt-14 sm:gap-20 sm:px-6 sm:pb-32 sm:pt-20 lg:gap-24">
        <HeroSection />
        <ModelsSection />
        <ConfiguratorProcess />
        <FitAssistantHighlight />
        <AftercareSection />
      </main>
      <SiteFooter />
    </>
  );
}

function HeroSection() {
  const { language } = useLanguage();
  const copy = HOME_COPY[language].hero;
  return (
    <section
      className="relative flex flex-col gap-8 overflow-hidden rounded-[28px] border border-border/50 p-6 transition-colors duration-500 sm:gap-10 sm:p-10 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.2fr)] lg:gap-14 lg:rounded-[32px] lg:p-16"
      style={{ backgroundImage: "var(--hero-surface)" }}
    >
      <motion.div
        className="relative order-first h-64 w-full overflow-hidden rounded-[24px] border border-border/60 bg-background/70 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.55)] sm:h-80 sm:rounded-[28px] lg:order-none lg:min-h-[460px] lg:rounded-[32px]"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/images/elegance/pearl/WhatsApp Image 2025-11-24 at 21.37.19.avif"
          alt={copy.imageAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-background/10 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/25 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.32em] text-black/75 backdrop-blur sm:left-6 sm:top-6 sm:px-4 sm:py-2">
          <Sparkles className="h-3.5 w-3.5 text-black/80" />
          {copy.overlayTag}
        </div>
        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-3xl border border-white/30 bg-background/95 p-5 text-sm text-foreground shadow-[0_25px_45px_-35px_rgba(15,23,42,0.65)] backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-5 lg:p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">
            {copy.overlayLabel}
          </p>
          <p className="text-base font-semibold leading-snug text-foreground sm:text-lg">
            {copy.overlayDescription}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[0.6rem] uppercase tracking-[0.26em] text-foreground/55 sm:text-[0.65rem]">
            {copy.overlayChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-foreground/20 bg-foreground/5 px-3 py-1"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge className="bg-foreground/10 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-foreground">
            {copy.badge}
          </Badge>
          <span className="text-xs text-foreground/60 sm:text-sm">
            {copy.subline}
          </span>
        </div>
        <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {copy.title}
        </h1>
        <p className="max-w-xl text-sm text-foreground/70 sm:text-base">
          {copy.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button asChild size="md" className="w-full sm:w-auto">
            <Link href="/configurator">
              {copy.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="md"
            className="w-full border border-foreground/15 sm:w-auto"
          >
            <Link href="#models">
              {copy.secondaryCta}
              <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <motion.div
        className="mt-4 grid gap-5 sm:mt-6 sm:grid-cols-2 lg:col-span-2 lg:mt-8 lg:grid-cols-3"
        initial={false}
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 24 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.12, duration: 0.6 },
          },
        }}
      >
        {HERO_HIGHLIGHTS.map((item) => {
          const highlight = item.copy[language];
          return (
            <motion.div
              key={highlight.title}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="group relative overflow-hidden rounded-[28px] border border-border/20 bg-background/85 p-6 shadow-[0_20px_48px_-30px_rgba(15,23,42,0.55)] transition-all duration-500 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_30px_60px_-28px_rgba(15,23,42,0.58)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-px rounded-[26px] border border-white/5 opacity-0 transition duration-500 group-hover:opacity-100"
              />
              <div className="relative flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/10 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-500 group-hover:scale-105">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-2xl border border-white/15 opacity-0 transition duration-500 group-hover:opacity-100"
                    />
                    {item.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{highlight.title}</h3>
                </div>
                <div className="h-[2px] w-14 rounded-full bg-gradient-to-r from-foreground/40 via-foreground/20 to-transparent transition-all duration-500 group-hover:w-20 group-hover:from-foreground/60" />
                <p className="text-sm leading-relaxed text-foreground/70">
                  {highlight.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
function ModelsSection() {
  const { language } = useLanguage();
  const copy = HOME_COPY[language].models;
  const models = useLocalizedDressModels();
  const router = useRouter();
  const handleCardNavigate = (slug: string) => {
    router.push(`/models/${slug}`);
  };
  return (
    <section id="models" className="space-y-10">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit uppercase tracking-[0.35em]">
          {copy.badge}
        </Badge>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {copy.heading}
          </h2>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-center sm:w-auto"
          >
            <Link href="/lookbook">
              {copy.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {models.map((model) => (
          <Card
            key={model.id}
            glow
            role="link"
            tabIndex={0}
            aria-label={`${model.name} details`}
            className="group cursor-pointer overflow-hidden"
            onClick={() => handleCardNavigate(model.slug)}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleCardNavigate(model.slug);
              }
            }}
          >
            <CardHeader className="relative flex flex-col gap-4 pb-0">
              <div className="relative overflow-hidden rounded-[24px] border border-border/30">
                <Image
                  src={model.heroImage}
                  alt={`${model.name} couture dress`}
                  width={640}
                  height={800}
                  className="h-80 w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-65 mix-blend-overlay"
                  style={{ background: model.accentGradient }}
                />
                <div className="absolute inset-x-3 top-3 flex items-center justify-between text-xs uppercase tracking-[0.3em]">
                  <span className="rounded-full bg-background/80 px-3 py-1 text-foreground/70">
                    {model.silhouette}
                  </span>
                  <span className="rounded-full bg-background/80 px-3 py-1 text-foreground/70">
                    {copy.pricePrefix} {model.basePrice}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                  {model.name}
                </h3>
                <p className="text-sm text-foreground/70">{model.tagLine}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="grid gap-2 text-sm text-foreground/70">
                {model.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <BadgeCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground/70" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="grid gap-4 text-sm">
                <DetailRow label={copy.detailLabels.fabrics}>
                  {model.fabrics.map((fabric) => fabric.name).join(" / ")}
                </DetailRow>
                <DetailRow label={copy.detailLabels.palette}>
                  <div className="flex flex-wrap items-center gap-3">
                    {model.colors.map((color) => (
                      <span key={color.id} className="flex items-center gap-2">
                        <span
                          className="h-6 w-6 rounded-full border border-white/60 shadow"
                          style={{ background: color.swatch }}
                        />
                        <span className="text-foreground/65">{color.name}</span>
                      </span>
                    ))}
                  </div>
                </DetailRow>
                <DetailRow label={copy.detailLabels.production}>
                  {model.productionTime}
                </DetailRow>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="backdrop-blur hover:translate-x-0.5"
              >
                <Link
                  href={`/configurator?model=${model.slug}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  {copy.configureLabel} {model.name}
                </Link>
              </Button>
              <Link
                href={`/models/${model.slug}`}
                className="text-sm font-medium text-foreground/70 transition hover:text-foreground"
              >
                {copy.viewDetails}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span className="text-xs uppercase tracking-[0.28em] text-foreground/50">
        {label}
      </span>
      <div className="text-sm text-foreground/75">{children}</div>
    </div>
  );
}

function ConfiguratorProcess() {
  const { language } = useLanguage();
  const copy = HOME_COPY[language].process;
  return (
    <section id="process" className="space-y-10">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit uppercase tracking-[0.35em]">
          {copy.badge}
        </Badge>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {copy.heading}
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {PROCESS_STEPS.map((step) => {
          const stepCopy = step.copy[language];
          return (
            <Card key={step.step} className="border-border/40">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <span className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/45">
                  {step.step}
                </span>
                <Sparkles className="h-5 w-5 text-foreground/50" />
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {stepCopy.title}
                </h3>
                <p className="text-sm text-foreground/65">{stepCopy.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <span className="text-xs uppercase tracking-[0.28em] text-foreground/45">
                  {copy.footerLabel}
                </span>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function FitAssistantHighlight() {
  const { language } = useLanguage();
  const copy = HOME_COPY[language].fit;
  return (
    <section
      id="fit"
      className="grid gap-8 rounded-[24px] border border-border/50 p-6 transition-colors duration-500 sm:gap-10 sm:p-10 lg:grid-cols-2 lg:rounded-[28px] lg:p-16"
      style={{ backgroundImage: "var(--fit-surface)" }}
    >
      <div className="space-y-5">
        <Badge variant="outline" className="w-fit uppercase tracking-[0.35em]">
          {copy.badge}
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {copy.heading}
        </h2>
        <ul className="space-y-4 text-sm text-foreground/70">
          {[
            { icon: Ruler, text: copy.bullets[0] },
            { icon: Clock, text: copy.bullets[1] },
            { icon: Sparkles, text: copy.bullets[2] },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <Icon className="mt-1 h-4 w-4 flex-shrink-0 text-foreground/60" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/configurator">
              {copy.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full border border-foreground/15 sm:w-auto"
          >
            <Link href="/fitting-guide">{copy.secondaryCta}</Link>
          </Button>
        </div>
      </div>
      <motion.div
        className="relative overflow-hidden rounded-[24px] border border-border/40 bg-background/80 p-5 sm:p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="rounded-[18px] border border-border/50 p-6 shadow-inner backdrop-blur"
          style={{ backgroundImage: "var(--fit-card)" }}
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-foreground/50">
            <span>{copy.profileLabel}</span>
            <span>{copy.confidenceLabel}</span>
          </div>
          <div className="mt-6 space-y-3">
            {copy.metricLabels.map((label, index) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-border/40 bg-background/70 px-4 py-3 text-sm text-foreground/70"
              >
                <span className="uppercase tracking-[0.22em]">
                  {label}
                </span>
                <span className="font-medium text-foreground">
                  {copy.metricValues[index]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 rounded-[16px] border border-border/40 bg-background/70 p-4 text-sm text-foreground/70">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-[0.28em] text-foreground/50">
                {copy.fitScoreLabel}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                87%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full w-[87%] rounded-full bg-foreground/80" />
            </div>
            <p className="text-xs text-foreground/55">
              {copy.fitSummary}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
function AftercareSection() {
  const { language } = useLanguage();
  const copy = HOME_COPY[language].aftercare;
  return (
    <section id="aftercare" className="space-y-8">
      <div className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit uppercase tracking-[0.35em]">
          {copy.badge}
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {copy.heading}
        </h2>
        <p className="max-w-3xl text-sm text-foreground/70">
          {copy.description}
        </p>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full border border-foreground/15 sm:w-fit"
        >
          <Link href="/aftercare">{copy.guideCta}</Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {AFTERCARE_CARDS.map((item) => {
          const itemCopy = item.copy[language];
          return (
            <Card
              key={itemCopy.title}
              className="border-border/40 bg-background/85 p-6 shadow-[0_16px_40px_-24px_rgba(15,23,42,.45)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-foreground/10 text-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {itemCopy.title}
                </h3>
                <p className="text-sm text-foreground/70">{itemCopy.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="flex flex-col gap-6 rounded-[24px] border border-border/50 bg-background/80 p-6 sm:p-7 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">
            {copy.closingTitle}
          </h3>
          <p className="mt-2 text-sm text-foreground/70">
            {copy.closingDescription}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/sign-up">{copy.primaryCta}</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full border border-foreground/15 sm:w-auto"
          >
            <Link href="/portal">{copy.secondaryCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}










