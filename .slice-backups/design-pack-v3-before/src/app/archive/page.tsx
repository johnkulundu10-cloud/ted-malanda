import Link from "next/link";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { articles } from "@/data/articles";
import styles from "./page.module.css";

export const metadata = { title: "Archive" };

export default function ArchivePage() {
  const years = [...new Set(articles.map((article) => article.year))];
  return <><SiteHeader /><main className={styles.main}>
    <header><p>PAST WORK</p><h1>Archive</h1><div>A growing collection of previously published columns, stories and observations by Ted Malanda.</div></header>
    <div className={styles.summary}><span>{articles.length} pieces in this design preview</span><span>{years.at(-1)}–{years[0]}</span></div>
    {years.map((year) => <section className={styles.year} key={year}><h2>{year}</h2><div>{articles.filter((article) => article.year === year).map((article) => <article key={article.slug}><p>{article.category}<span>{article.date}</span></p><h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3></article>)}</div></section>)}
  </main><SiteFooter /></>;
}
