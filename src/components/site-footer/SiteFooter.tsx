import Link from "next/link";
import styles from "./SiteFooter.module.css";

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/ted.malanda/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ted-malanda-99279a25?originalSubdomain=ke" },
  { label: "X", href: "https://x.com/TedMalanda" },
];

export function SiteFooter({showCta=false}:{showCta?:boolean}) {
  return (
    <footer className={styles.footer}>
      {showCta?<div className={styles.ctaWrap}><section className={styles.cta} aria-labelledby="stay-informed"><div><p>FOLLOW THE WRITING</p><h2 id="stay-informed">Stay informed. Stay ahead.</h2><span>New stories, sharp observations and rediscovered favourites from Ted Malanda.</span></div><Link href="https://www.facebook.com/ted.malanda/" target="_blank" rel="noreferrer">Follow on Facebook →</Link></section></div>:null}
      <div className={styles.inner}>
        <div className={styles.identity}>
          <Link className={styles.wordmark} href="/">TED MALANDA</Link>
          <p>Stories, memory, humour and observations from everyday Kenyan life.</p>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <p>Explore</p>
          <Link href="/articles">Articles</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/ted-talk">Ted Talk</Link>
          <Link href="/about">About</Link>
          <Link href="/search">Search</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        <div className={styles.note}>
          <p>Follow Ted</p>
          <span>New writing and rediscovered pieces, published without the noise.</span>
          <div className={styles.socials}>{socials.map((social)=><Link key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}</Link>)}</div>
        </div>
      </div>
      <div className={styles.bottom}><span>© {new Date().getFullYear()} Ted Malanda</span><span>Made for thoughtful reading</span></div>
    </footer>
  );
}
