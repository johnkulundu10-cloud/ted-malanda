import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { articles } from "@/data/articles";
import styles from "./page.module.css";

export const metadata = { title: "Articles" };

export default function ArticlesPage() {
  const [featured, ...remaining] = articles;
  const categories = [...new Set(articles.map((article) => article.category))];

  return <>
    <SiteHeader />
    <main className={styles.main}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>WRITING</p>
        <h1>Articles</h1>
        <p>Stories, commentary and observations about public life, culture and the curious business of being Kenyan.</p>
      </header>
      <nav className={styles.categories} aria-label="Article categories">
        <span>All writing</span>{categories.map((category) => <span key={category}>{category}</span>)}
      </nav>
      <section className={styles.featured}>
        <div><p className={styles.eyebrow}>FEATURED</p><h2><Link href={`/articles/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><Link className={styles.read} href={`/articles/${featured.slug}`}>Read article <ArrowRight size={16} /></Link></div>
        <div className={styles.featureMark}><span>TM</span><small>{featured.category}</small></div>
      </section>
      <section className={styles.list} aria-labelledby="all-writing"><h2 id="all-writing">All writing</h2>
        {remaining.map((article) => <article key={article.slug}><div className={styles.meta}>{article.category}<span>{article.date}</span></div><div><h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p></div><ArrowRight className={styles.arrow} size={18} /></article>)}
      </section>
    </main>
    <SiteFooter />
  </>;
}
