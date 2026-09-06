import Image from "next/image";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.copy}>
          <p className={styles.kicker}>ABOUT</p>
          <h1>Hello, I’m Ted Malanda.</h1>
          <p>Ted Malanda is a Kenyan writer, columnist and veteran editor known for finding humour, contradiction and insight in everyday life.</p>
          <p>His writing ranges across public affairs, politics, family, culture, travel and the curious business of being Kenyan.</p>
          <div className={styles.highlights}>
            <span>Veteran Kenyan writer and editor</span>
            <span>Founding editor of <em>The Nairobian</em></span>
            <span>Stories, satire and public commentary</span>
          </div>
          <p className={styles.note}>This introductory biography, portrait and the highlights above will be editable in the Admin area.</p>
        </div>
        <figure className={styles.portrait}>
          <Image src="/images/ted-malanda.png" alt="Portrait of Ted Malanda" width={900} height={900} priority />
          <figcaption>Ted Malanda</figcaption>
        </figure>
      </main>
      <SiteFooter />
    </>
  );
}
