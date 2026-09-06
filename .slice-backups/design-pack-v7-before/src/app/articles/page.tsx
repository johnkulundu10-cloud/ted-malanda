import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { articles } from "@/data/articles";
import { ArticlesList } from "./ArticlesList";
import styles from "./page.module.css";

export const metadata = { title: "Articles" };

export default function ArticlesPage() {
  const [featured, ...remaining] = articles;
  return <>
    <SiteHeader />
    <main className={styles.main}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>WRITING</p>
        <h1>Articles</h1>
        <p>Stories, commentary and observations about public life, culture and the curious business of being Kenyan.</p>
      </header>
      <section className={styles.featured}>
        <div><p className={styles.eyebrow}>FEATURED</p><h2><Link href={`/articles/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><Link className={styles.read} href={`/articles/${featured.slug}`}>Read article <ArrowRight size={16} /></Link></div>
        <div className={styles.featureImage}><Image src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=82" alt="A road crossing a broad landscape" fill sizes="(max-width: 700px) 100vw, 35vw" priority /></div>
      </section>
      <ArticlesList articles={remaining} />
    </main>
    <SiteFooter />
  </>;
}
