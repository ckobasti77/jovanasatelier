import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { Logo } from "./logo";

const FOOTER_COPY = {
  en: {
    description:
      "Handcrafted in Belgrade. Tailored for your body, your moments, your confidence.",
    sections: [
      {
        title: "Studio",
        links: [
          { label: "About Jovana", href: "#" },
          { label: "Lookbook", href: "#" },
          { label: "Press kit", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Fitting guide", href: "#fit" },
          { label: "Aftercare", href: "#aftercare" },
          { label: "FAQ", href: "/faq" },
        ],
      },
      {
        title: "Contact",
        links: [
          { label: "WhatsApp", href: "https://wa.me/38100111222" },
          { label: "Instagram", href: "https://instagram.com/jovanaatelier" },
          { label: "Email", href: "mailto:studio@jovanaatelier.com" },
        ],
      },
    ],
    copyright: "All rights reserved.",
  },
  sr: {
    description:
      "Ručni rad u Beogradu. Krojen za tvoje telo, tvoje trenutke, tvoje samopouzdanje.",
    sections: [
      {
        title: "Studio",
        links: [
          { label: "O Jovani", href: "#" },
          { label: "Lookbook", href: "#" },
          { label: "Press kit", href: "#" },
        ],
      },
      {
        title: "Podrška",
        links: [
          { label: "Vodič za mere", href: "#fit" },
          { label: "Aftercare", href: "#aftercare" },
          { label: "FAQ", href: "/faq" },
        ],
      },
      {
        title: "Kontakt",
        links: [
          { label: "WhatsApp", href: "https://wa.me/38100111222" },
          { label: "Instagram", href: "https://instagram.com/jovanaatelier" },
          { label: "Email", href: "mailto:studio@jovanaatelier.com" },
        ],
      },
    ],
    copyright: "Sva prava zadržana.",
  },
} as const;

export function SiteFooter() {
  const { language } = useLanguage();
  const footerLabel = language === "sr" ? "Jovanin Atelje" : "Jovana's Atelier";
  const copy = FOOTER_COPY[language];

  return (
    <footer className="border-t border-border/60 bg-background/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Link href="/" className="group flex items-center gap-3 md:gap-4">
            <Logo className="transition group-hover:scale-[1.02]" />
          </Link>
        </div>
        {copy.sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/80">
              {section.title}
            </h3>
            <ul className="space-y-2 text-sm text-foreground/60">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/50 px-4 py-6 text-center text-xs text-foreground/45 sm:px-0">
        Copyright {new Date().getFullYear()} {footerLabel}. {copy.copyright}
      </div>
    </footer>
  );
}
