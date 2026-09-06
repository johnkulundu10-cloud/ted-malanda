import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider/ThemeProvider";
import "./globals.css";

const interfaceFallback = Inter({ subsets: ["latin"], variable: "--font-interface-fallback", display: "swap" });
const readingFallback = Source_Serif_4({ subsets: ["latin"], variable: "--font-reading-fallback", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Ted Malanda", template: "%s — Ted Malanda" },
  description: "Stories, commentary and observations by Kenyan writer and editor Ted Malanda.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const adobeFontsUrl = process.env.NEXT_PUBLIC_ADOBE_FONTS_URL;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>{adobeFontsUrl ? <link rel="stylesheet" href={adobeFontsUrl} /> : null}</head>
      <body className={`${interfaceFallback.variable} ${readingFallback.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
