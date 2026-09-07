import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { articles } from "@/data/articles";
import styles from "./page.module.css";

const latestArticles = articles.slice(0, 4);
const leadStories = [
  { ...articles[0], label: "Latest story", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=82" },
  { ...articles[4], label: "From the archive", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=82" },
];
const visualStories = [
  { ...articles[1], image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=80" },
  { ...articles[2], image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=700&q=80" },
  { ...articles[5], image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80" },
  { ...articles[7], image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=80" },
];

const categories = [
  { name: "Kenyan Life", items: ["Anecdotes from decades of long distance travel", "Sometimes, the old ways are the best", "Kenya reeling from a crisis of language"] },
  { name: "Public Affairs", items: ["Mwai Kibaki: Kenya’s most underestimated politician", "Government is that hapless parent who gave up", "Don’t waste university degrees on politicians"] },
  { name: "Humour & Satire", items: ["Time Kenya changed her name to Kelelestan", "Blimey, we are now naming elephants!", "The rich are eating like rabbits"] },
  { name: "Memory & Place", items: ["You must travel to understand Kenyans", "Tale of the last nomad", "Revisiting the charade at the gravesite"] },
];

export default function Home() {
  return <><SiteHeader /><main>
    <section className={styles.leads} aria-label="Featured writing">
      {leadStories.map((story, index) => <article className={styles.leadCard} key={story.slug}>
        <Link className={styles.leadImage} href={`/articles/${story.slug}`}><Image src={story.image} alt="" fill priority={index === 0} sizes="(max-width: 760px) 100vw, 50vw" /></Link>
        <p className={styles.kicker}>{story.label}</p>
        {index === 0 ? <h1><Link href={`/articles/${story.slug}`}>{story.title}</Link></h1> : <h2><Link href={`/articles/${story.slug}`}>{story.title}</Link></h2>}
        <p className={styles.excerpt}>{story.excerpt}</p>
        <div className={styles.meta}>{story.category}<span>{story.date}</span></div>
        <Link className={styles.action} href={`/articles/${story.slug}`}>Read article <ArrowRight size={15} /></Link>
      </article>)}
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHeading}><h2>Latest writing</h2><Link href="/articles">All articles <ArrowRight size={15} /></Link></div>
      <div className={styles.latestList}>{latestArticles.map((article) => <article key={article.slug}><div className={styles.latestMeta}>{article.category}<span>{article.date}</span></div><h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3></article>)}</div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHeading}><h2>Explore by subject</h2></div>
      <div className={styles.categoryGrid}>{categories.map((category) => <article className={styles.category} key={category.name}><h3>{category.name}</h3><ul>{category.items.map((item) => <li key={item}><Link href="/archive">{item}</Link></li>)}</ul><Link className={styles.categoryLink} href="/archive">More in {category.name} <ArrowRight size={15} /></Link></article>)}</div>
    </section>

    <section className={styles.visualSection}>
      <div className={styles.sectionHeading}><h2>More stories to explore</h2><Link href="/archive">Browse archive <ArrowRight size={15} /></Link></div>
      <div className={styles.visualGrid}>{visualStories.map((story) => <article key={story.slug}><Link className={styles.visualImage} href={`/articles/${story.slug}`}><Image src={story.image} alt="" fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 25vw" /></Link><p className={styles.kicker}>{story.category}</p><h3><Link href={`/articles/${story.slug}`}>{story.title}</Link></h3><span>{story.date}</span></article>)}</div>
    </section>
  </main><SiteFooter /></>;
}
