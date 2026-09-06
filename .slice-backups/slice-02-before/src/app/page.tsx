import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "./page.module.css";

const latestArticles = [
  { title: "The strange wisdom hidden in ordinary Kenyan life", category: "Kenyan Life", minutes: 6 },
  { title: "Why every village remembers what the city forgets", category: "Memory & Place", minutes: 8 },
  { title: "Government is the parent who stopped asking questions", category: "Public Affairs", minutes: 5 },
];

const categories = [
  { name: "Kenyan Life", articles: ["The peculiar business of being Kenyan", "Lessons overheard in a matatu", "When the city follows you home"] },
  { name: "Public Affairs", articles: ["The politics of promises", "What institutions quietly teach us", "The national habit of looking away"] },
  { name: "Humour & Satire", articles: ["A perfectly serious guide to nonsense", "The trouble with knowing everything", "In defence of the village expert"] },
  { name: "Memory & Place", articles: ["The roads that raised us", "Notes from the old homestead", "What long journeys leave behind"] },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>WRITER · EDITOR · STORYTELLER</p>
            <h1>Hello, I’m Ted Malanda.</h1>
            <p className={styles.lead}>I write stories and commentary about Kenyan life, public affairs, family, culture, and the humour hiding inside ordinary things.</p>
            <Link className={styles.textLink} href="/about">More about Ted <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ul className={styles.highlights}>
            <li>Veteran Kenyan writer and editor</li>
            <li>Founding editor of <em>The Nairobian</em></li>
            <li>Stories, satire and public commentary</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2>Latest writing</h2>
            <Link href="/articles">View all <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className={styles.articleList}>
            {latestArticles.map((article) => (
              <article key={article.title}>
                <p className={styles.meta}>{article.category} · {article.minutes} min read</p>
                <h3><Link href="/articles">{article.title}</Link></h3>
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
                <ul>{category.articles.map((article) => <li key={article}><Link href="/articles">{article}</Link></li>)}</ul>
                <Link className={styles.categoryLink} href="/articles">More in {category.name} <ArrowRight size={15} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.newsletter}>
          <div>
            <p className={styles.eyebrow}>NEW STORIES FROM TED</p>
            <h2>Good writing, occasionally.</h2>
            <p>Receive new stories and selected pieces from the archive. No noise.</p>
          </div>
          <span className={styles.comingSoon}>Newsletter coming soon</span>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
