import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ConvexClientProvider } from "@/providers/convex-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const title = "JeVeux Couture - Design-to-Fit Dresses";
const description =
  "Discover four signature silhouettes and tailor every measurement to your body. Configure fabric, color, and fit with JeVeux Couture's design-to-fit experience.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jeveux-couture.example"),
  title: {
    default: title,
    template: "%s | JeVeux Couture",
  },
  description,
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title,
    description,
    url: "https://jeveux-couture.example",
    siteName: "JeVeux Couture",
    images: [
      {
        url: "https://jeveux-couture.example/og.png",
        width: 1200,
        height: 630,
        alt: "JeVeux Couture dress configurator preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@jeveuxcouture",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitializer = `
  (() => {
    const storageKey = "jeveux-theme";
    const cleanup = () => {
      if (document.body && document.body.hasAttribute("cz-shortcut-listen")) {
        document.body.removeAttribute("cz-shortcut-listen");
      }
    };
    try {
      const stored = window.localStorage.getItem(storageKey);
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const resolved =
        stored === "dark" || (!stored || stored === "system") && systemPrefersDark
          ? "dark"
          : "light";
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.style.setProperty("color-scheme", resolved);
      root.dataset.theme = stored ?? "system";
      cleanup();
      window.addEventListener("DOMContentLoaded", cleanup, { once: true });
    } catch (error) {
      console.warn("Theme init", error);
    }
  })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitializer }}
        />
        <ConvexClientProvider>
          <LanguageProvider>
            <ThemeProvider>
              <div
                className="relative min-h-screen transition-[background-image] duration-700 ease-out"
                style={{ backgroundImage: "var(--shell-background)" }}
              >
                {children}
                <ScrollToTop />
              </div>
            </ThemeProvider>
          </LanguageProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
