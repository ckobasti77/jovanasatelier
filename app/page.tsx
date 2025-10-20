"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Layers3,
  MoveRight,
  Palette,
  Ruler,
  Share2,
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
    icon: <Layers3 className="h-5 w-5" />,
    copy: {
      en: {
        title: "Signature silhouettes",
        description: "Four couture-approved bases fine-tuned for modern bodies.",
      },
      sr: {
        title: "Potpisane siluete",
        description: "Četiri couture osnove prilagođene savremenoj figuri.",
      },
    },
  },
  {
    icon: <Ruler className="h-5 w-5" />,
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
    icon: <Palette className="h-5 w-5" />,
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
        "Luma, Vara, Noor, and Solenne - signature models engineered to adapt to your shape. Configure fabrics, colors, and every centimeter of fit in a guided atelier experience built for zero guesswork.",
      primaryCta: "Launch configurator",
      secondaryCta: "Explore silhouettes",
      overlayTag: "Jovana muse",
      overlayLabel: "featured look",
      overlayDescription: "Silk crepe column with draped shoulders and detachable sash.",
      overlayChips: ["Noor edit", "Slate", "Atelier 12h"],
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
      shareTitle: "Save and share your configuration.",
      shareDescription:
        "The configurator generates a secure link you can send to friends or stylists. Export a PDF order summary with your measurements, fabrics, and atelier notes.",
      shareMeta: "URL short-link + QR code",
      shareMetaCaption: "privacy-first",
    },
    fit: {
      badge: "fit assistant",
      heading: "Intelligent guidance so measurements feel easy.",
      bullets: [
        "Step-by-step measurement wizard with visual prompts, tolerance thresholds, and live validation.",
        "Fit confidence bar factors in height, bust-weight ratio, and chosen model silhouette for better recommendations.",
        "Save multiple measurement profiles ? ?Jovana in heels?, ?Jovana barefoot? ? and switch with one tap.",
      ],
      primaryCta: "Start measuring",
      secondaryCta: "Watch the guide video",
      profileLabel: "profile: Jovana heels",
      confidenceLabel: "confidence: high",
      metricLabels: ["Bust", "Waist", "Hips", "Heel height"],
      metricValues: ["92 cm", "70 cm", "98 cm", "8 cm"],
      fitScoreLabel: "fit confidence",
      fitSummary:
        "Based on your Noor configuration with Tencel Sateen. Try adjusting bust or heel height for refined drape.",
    },
    aftercare: {
      badge: "aftercare",
      heading: "Support beyond the atelier doors.",
      description:
        "Each order unlocks resources to keep your piece immaculate. From bespoke care routines to video tutorials and alteration credits, we stay with you long after the celebration.",
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
      title: "Tvoje telo. Tvoje mere. Četiri siluete za haljinu iz snova.",
      description:
        "Luma, Vara, Noor i Solenne — potpisani modeli projektovani da se prilagode tvojoj figuri. Konfiguriši tkanine, boje i svaki centimetar kroja uz vođeno atelje iskustvo bez nagađanja.",
      primaryCta: "Pokreni konfigurator",
      secondaryCta: "Istraži siluete",
      overlayTag: "Jovanina muza",
      overlayLabel: "izdvojeni look",
      overlayDescription: "Svileni krep u kolonskom kroju sa drapiranim ramenima i odvojivim pojasom.",
      overlayChips: ["Noor edicija", "Škriljac", "Atelje 12h"],
      imageAlt: "Model u ručno šivanoj večernjoj haljini",
    },
    models: {
      badge: "siluete",
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
      heading: "Vođeno putovanje od iskre do završene haljine.",
      footerLabel: "vođeno & interaktivno",
      shareTitle: "Sačuvaj i podeli konfiguraciju.",
      shareDescription:
        "Konfigurator generiše bezbedan link koji možeš poslati prijateljima ili stilistima. Izvezi PDF sa merama, tkaninama i beleškama ateljea.",
      shareMeta: "URL skraćeni link + QR kod",
      shareMetaCaption: "privatnost pre svega",
    },
    fit: {
      badge: "fit asistent",
      heading: "Inteligentno vođenje za lako uzimanje mera.",
      bullets: [
        "Korak-po-korak čarobnjak za mere sa vizuelnim instrukcijama, tolerancijama i trenutnom validacijom.",
        "Traka pouzdanosti uklapanja uzima u obzir visinu, odnos grudi i težine i odabranu siluetu modela za preciznije preporuke.",
        "Sačuvaj više profila mera – „Jovana u štiklama“, „Jovana bosa“ – i menjaj ih jednim dodirom.",
      ],
      primaryCta: "Počni sa merenjem",
      secondaryCta: "Pogledaj video vodič",
      profileLabel: "profil: Jovana u štiklama",
      confidenceLabel: "sigurnost: visoka",
      metricLabels: ["Grudi", "Struk", "Kukovi", "Visina štikle"],
      metricValues: ["92 cm", "70 cm", "98 cm", "8 cm"],
      fitScoreLabel: "sigurnost uklapanja",
      fitSummary:
        "Zasnovano na tvojoj Noor konfiguraciji sa tencel satenom. Podesi obim grudi ili visinu štikle za još bolji pad.",
    },
    aftercare: {
      badge: "nega",
      heading: "Podrška i kada izađeš iz ateljea.",
      description:
        "Svaka porudžbina otključava resurse da haljina ostane besprekorna. Od personalizovanih rituala nege do video tutorijala i kredita za prepravke, ostajemo uz tebe i posle proslave.",
      closingTitle: "Spremna da zakoračiš u atelje?",
      closingDescription:
        "Kreiraj nalog, sačuvaj profile mera, prati izradu i otključaj rani pristup novim siluetama.",
      primaryCta: "Otvori svoj profil",
      secondaryCta: "Prijavi se",
    },
  },
} as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-6xl flex-col gap-24 px-6 pb-32 pt-16 sm:pt-24">
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
      className="relative grid gap-10 overflow-hidden rounded-[32px] border border-border/50 p-10 transition-colors duration-500 sm:grid-cols-[1.1fr_0.9fr] sm:gap-14 sm:p-16"
      style={{ backgroundImage: "var(--hero-surface)" }}
    >
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-foreground/10 text-xs font-semibold uppercase tracking-[0.22em] text-foreground">
            {copy.badge}
          </Badge>
          <span className="text-sm text-foreground/60">
            {copy.subline}
          </span>
        </div>
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
          {copy.title}
        </h1>
        <p className="max-w-xl text-base text-foreground/70 sm:text-lg">
          {copy.description}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <Link href="/configurator">
              {copy.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="#models">
              {copy.secondaryCta}
              <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <motion.div
          className="grid gap-3 sm:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
              className="group rounded-3xl border border-border/25 bg-background/75 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-foreground/35 hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center rounded-full bg-gradient-to-br from-foreground/12 via-foreground/5 to-transparent text-foreground">
                  {item.icon}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {highlight.title}
                </h3>
              </div>
              <div className="mt-4 h-[3px] w-12 rounded-full bg-gradient-to-r from-foreground/50 via-foreground/20 to-transparent transition-all duration-300 group-hover:w-16" />
              <p className="mt-4 text-sm leading-relaxed text-foreground/60">
                  {highlight.description}
              </p>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
      <motion.div
        className="relative hidden min-h-[460px] overflow-hidden rounded-[32px] border border-border/60 bg-background/60 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.55)] sm:block"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80"
          alt={copy.imageAlt}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-background/10 to-transparent" />
        <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/20 px-4 py-2 text-xs uppercase tracking-[0.32em] text-black/75 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-black/80" />
          {copy.overlayTag}
        </div>
        <div className="absolute left-6 right-6 bottom-6 flex flex-col gap-3 rounded-3xl border border-white/30 bg-background p-5 text-sm text-foreground shadow-[0_25px_45px_-35px_rgba(15,23,42,0.65)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">
            {copy.overlayLabel}
          </p>
          <p className="text-base font-semibold leading-snug text-foreground">
            {copy.overlayDescription}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-foreground/55">
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
    </section>
  );
}
function ModelsSection() {
  const { language } = useLanguage();
  const copy = HOME_COPY[language].models;
  const models = useLocalizedDressModels();
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
          <Button asChild variant="ghost" size="sm">
            <Link href="/lookbook">
              {copy.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {models.map((model) => (
          <Card key={model.id} glow className="group overflow-hidden">
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
                <Link href={`/configurator?model=${model.slug}`}>
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
      <div className="flex flex-col gap-6 rounded-[28px] border border-border/40 bg-background/80 p-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-foreground">
            {copy.shareTitle}
          </h3>
          <p className="max-w-xl text-sm text-foreground/70">
            {copy.shareDescription}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-background">
            <Share2 className="h-5 w-5 text-foreground/70" />
          </div>
          <div className="text-sm text-foreground/65">
            {copy.shareMeta}
            <br />
            <span className="text-xs uppercase tracking-[0.28em]">
              {copy.shareMetaCaption}
            </span>
          </div>
        </div>
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
      className="grid gap-10 rounded-[28px] border border-border/50 p-10 transition-colors duration-500 sm:grid-cols-2 sm:p-16"
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
        <div className="flex flex-wrap items-center gap-4">
          <Button asChild>
            <Link href="/configurator">
              {copy.primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/guides/measurement">{copy.secondaryCta}</Link>
          </Button>
        </div>
      </div>
      <motion.div
        className="relative overflow-hidden rounded-[24px] border border-border/40 bg-background/80 p-6"
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
      <div className="flex flex-col gap-6 rounded-[24px] border border-border/50 bg-background/80 p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">
            {copy.closingTitle}
          </h3>
          <p className="mt-2 text-sm text-foreground/70">
            {copy.closingDescription}
          </p>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
          <Button asChild>
            <Link href="/sign-up">{copy.primaryCta}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/portal">{copy.secondaryCta}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}







