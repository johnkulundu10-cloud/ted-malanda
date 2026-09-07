"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle/ThemeToggle";
import styles from "./SiteHeader.module.css";

const navigation = [
  { href: "/articles?view=list#all-writing", label: "Articles" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/articles?category=Humour+%26+Satire#all-writing", label: "Humour & Satire", mobileOnly: true },
  { href: "/articles?category=Kenyan+Life#all-writing", label: "Kenyan Life", mobileOnly: true },
  { href: "/articles?category=Public+Affairs#all-writing", label: "Public Affairs", mobileOnly: true },
  { href: "/articles?category=Memory+%26+Place#all-writing", label: "Memory & Place", mobileOnly: true },
  { href: "/search", label: "Search", mobileOnly: true },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/" aria-label="Ted Malanda home" onClick={() => setOpen(false)}>TED MALANDA</Link>
        <nav id="mobile-navigation" className={`${styles.navigation} ${open ? styles.navigationOpen : ""}`} aria-label="Primary navigation">
          {navigation.map((item) => <Link className={item.mobileOnly ? styles.mobileOnly : undefined} onClick={() => setOpen(false)} key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <div className={styles.actions}>
          <Link className={styles.iconLink} href="/search" aria-label="Search articles" title="Search articles"><Search size={18} strokeWidth={1.8} /></Link>
          <ThemeToggle />
          <button className={styles.menuButton} type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open ? <button className={styles.scrim} aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
    </header>
  );
}
