import type { Metadata } from "next";
import { Figtree, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider/ThemeProvider";
import { getSiteSetting } from "@/lib/content";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const interfaceFont = Figtree({
  subsets: ["latin"],
  variable: "--font-interface",
  display: "swap",
});

const readingFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-reading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Ted Malanda", template: "%s — Ted Malanda" },
  description: "Stories, commentary and observations by Kenyan writer and editor Ted Malanda.",
  openGraph: { siteName:"Ted Malanda", type:"website", locale:"en_KE" },
  twitter: { card:"summary_large_image" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const appearance = await getSiteSetting("appearance", { heading_font: "Figtree", reading_font: "Source Serif 4" });
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" data-heading-font={appearance.heading_font} data-reading-font={appearance.reading_font}>
      <body className={`${interfaceFont.variable} ${readingFont.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
