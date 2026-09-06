import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle/ThemeToggle";
import styles from "./SiteHeader.module.css";

const navigation = [
  { href: "/articles", label: "Articles" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/" aria-label="Ted Malanda home">TED MALANDA</Link>
        <nav className={styles.navigation} aria-label="Primary navigation">
          {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
