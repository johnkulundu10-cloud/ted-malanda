import Link from "next/link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>© {new Date().getFullYear()} Ted Malanda</p>
        <nav aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/archive">Archive</Link>
        </nav>
      </div>
    </footer>
  );
}
