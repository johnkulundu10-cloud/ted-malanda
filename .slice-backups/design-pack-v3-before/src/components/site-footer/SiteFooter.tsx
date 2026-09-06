import Link from "next/link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.identity}>
          <Link className={styles.wordmark} href="/">TED MALANDA</Link>
          <p>Stories, memory, humour and observations from everyday Kenyan life.</p>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <p>Explore</p>
          <Link href="/articles">Articles</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className={styles.note}>
          <p>From the desk</p>
          <span>New writing and rediscovered pieces, published without the noise.</span>
        </div>
      </div>
      <div className={styles.bottom}><span>© {new Date().getFullYear()} Ted Malanda</span><span>Made for thoughtful reading</span></div>
    </footer>
  );
}
