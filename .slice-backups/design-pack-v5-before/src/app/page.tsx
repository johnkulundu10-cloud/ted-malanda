import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { articles } from "@/data/articles";
import styles from "./page.module.css";

const latestArticles = articles.slice(0, 4);

const categories = [
  { name: "Kenyan Life", articles: ["Anecdotes from decades of long distance travel", "Sometimes, the old ways are the best", "Kenya reeling from a crisis of language"] },
  { name: "Public Affairs", articles: ["Mwai Kibaki: Kenya’s most underestimated politician", "Government is that hapless parent who gave up", "Don’t waste university degrees on politicians"] },
  { name: "Humour & Satire", articles: ["Time Kenya changed her name to Kelelestan", "Blimey, we are now naming elephants!", "The rich are eating like rabbits"] },
  { name: "Memory & Place", articles: ["You must travel to understand Kenyans", "Tale of the last nomad", "Revisiting the charade at the gravesite"] },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className={styles.hero}>
          <p className={styles.kicker}>FEATURED FROM THE ARCHIVE</p>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <h1>Anecdotes from decades of long distance travel</h1>
              <p>From bogus preachers to persistent hawkers, some journeys stay with you long after the bus has reached its destination.</p>
              <div className={styles.meta}>Kenyan Life <span>·</span> By Ted Malanda</div>
              <Link className={styles.action} href="/archive">Read from the archive <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className={styles.heroImage}>
              <Image
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82"
                alt="A winding road through a wide landscape"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 46vw"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2>Latest writing</h2>
            <Link href="/articles">All articles <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className={styles.latestList}>
            {latestArticles.map((article) => (
              <article key={article.title}>
                <div className={styles.latestMeta}>{article.category}<span>{article.date}</span></div>
                <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><h2>Explore by subject</h2></div>
          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <article className={styles.category} key={category.name}>
                <h3>{category.name}</h3>
                <ul>{category.articles.map((article) => <li key={article}><Link href="/archive">{article}</Link></li>)}</ul>
                <Link className={styles.categoryLink} href="/archive">More in {category.name} <ArrowRight size={15} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.note}>
          <p className={styles.kicker}>NEW STORIES FROM TED</p>
          <div>
            <h2>Writing worth sitting with.</h2>
            <p>New columns, stories and rediscovered pieces from the archive—shared occasionally.</p>
          </div>
          <span>Newsletter coming later</span>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
