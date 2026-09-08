import Image from "next/image";
import { bypassImageOptimizer } from "@/lib/images";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "./page.module.css";
import { getSiteSetting } from "@/lib/content";

export default async function AboutPage() {
  const defaults = {
    heading: "Writer. Editor. Observer of Kenyan life.",
    intro: "Ted Malanda is a Kenyan writer, columnist and veteran editor known for finding humour, contradiction and insight in everyday life.",
    hero_secondary: "His writing ranges across public affairs, politics, family, culture, travel and the curious business of being Kenyan.",
    highlight_one: "Veteran Kenyan writer and editor",
    highlight_two: "Founding editor of The Nairobian",
    highlight_three: "Stories, satire and public commentary",
    body: "Across a long career in Kenyan journalism, Ted has written about the institutions that shape public life and the ordinary encounters that reveal who we are.",
    secondary: "He has worked as a writer and editor, including serving as the founding editor of The Nairobian. The archive on this website brings together selected pieces from different stages of that journey while making room for new stories.",
    more_note: "This is intended to be a quiet home for the writing itself: a place where readers can discover an old column, follow a new observation or simply spend time with a well-told Kenyan story.",
    closing_heading: "Old stories, new observations.",
    closing_body: "The collection will continue to grow as earlier columns are prepared for the archive and new work is published.",
    closing_note: "",
    image_url: "/images/ted-malanda.png",
    image_alt: "Portrait of Ted Malanda",
    image_caption: "Ted Malanda",
  };
  const saved = await getSiteSetting<Partial<typeof defaults>>("about", {});
  const about = { ...defaults, ...saved };
  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <div className={styles.copy}>
          <p className={styles.kicker}>ABOUT</p>
          <h1>{about.heading}</h1>
          <p>{about.intro}</p>
          <p>{about.hero_secondary}</p>
          <div className={styles.highlights}>
            <span>{about.highlight_one}</span>
            <span>{about.highlight_two}</span>
            <span>{about.highlight_three}</span>
          </div>
        </div>
        <figure className={styles.portrait}>
          <Image src={about.image_url} alt={about.image_alt} width={900} height={900} priority unoptimized={bypassImageOptimizer(about.image_url)} />
          <figcaption>{about.image_caption}</figcaption>
        </figure>
        <section className={styles.more}>
          <h2>A life shaped by words</h2>
          <div>
            <p>{about.body}</p>
            <p>{about.secondary}</p>
            {about.more_note ? <p>{about.more_note}</p> : null}
          </div>
        </section>
        <section className={styles.closing}>
          <p className={styles.kicker}>ON THIS WEBSITE</p>
          <h2>{about.closing_heading}</h2>
          <p>{about.closing_body}</p>
          {about.closing_note ? <p>{about.closing_note}</p> : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
