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
          <h1>Writer. Editor. Observer of Kenyan life.</h1>
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
        <section className={styles.more}>
          <h2>A life shaped by words</h2>
          <div>
            <p>Across a long career in Kenyan journalism, Ted has written about the institutions that shape public life and the ordinary encounters that reveal who we are. His work moves easily between serious commentary and the humour hidden in familiar situations.</p>
            <p>He has worked as a writer and editor, including serving as the founding editor of <em>The Nairobian</em>. The archive on this website brings together selected pieces from different stages of that journey while making room for new stories.</p>
            <p>This is intended to be a quiet home for the writing itself: a place where readers can discover an old column, follow a new observation or simply spend time with a well-told Kenyan story.</p>
          </div>
        </section>
        <section className={styles.closing}>
          <p className={styles.kicker}>ON THIS WEBSITE</p>
          <h2>Old stories, new observations.</h2>
          <p>The collection will continue to grow as earlier columns are prepared for the archive and new work is published. Readers can browse by subject, revisit familiar pieces and discover writing they may have missed the first time.</p>
          <p>The words and photograph on this page will eventually be managed from Ted’s admin area, allowing him to shape this introduction in his own voice.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
