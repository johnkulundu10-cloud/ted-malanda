import type { Metadata } from "next";
import { Figtree, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider/ThemeProvider";
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
  title: { default: "Ted Malanda", template: "%s — Ted Malanda" },
  description: "Stories, commentary and observations by Kenyan writer and editor Ted Malanda.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interfaceFont.variable} ${readingFont.variable}`}>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
