import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { articles, getArticle } from "@/data/articles";
import styles from "./page.module.css";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = articles.filter((item) => item.slug !== slug && item.category === article.category).slice(0, 2);
  return <><SiteHeader /><main>
    <article className={styles.article}>
      <Link className={styles.back} href="/articles"><ArrowLeft size={15}/> All articles</Link>
      <header><p>{article.category}</p><h1>{article.title}</h1><div>{article.date}<span>By Ted Malanda</span></div></header>
      <p className={styles.standfirst}>{article.excerpt}</p>
      <div className={styles.body}>
        <p className={styles.preview}>Article body design preview</p>
        <p>This page demonstrates the reading experience for Ted’s articles. The final original text will be added through the publishing system as the archive is prepared.</p>
        <p>The design deliberately keeps the column narrow, the typography generous and the surrounding interface quiet. Occasional photographs, captions, quotations and section headings can be included when an article needs them.</p>
        <blockquote>Good stories need room to breathe. The page should support the writing without competing with it.</blockquote>
        <h2>A comfortable place for longer stories</h2>
        <p>When the content system is connected, this area will render the complete article, preserve its original publication information and credit any publication in which it first appeared.</p>
      </div>
    </article>
    {related.length > 0 && <aside className={styles.related}><p>MORE IN {article.category}</p>{related.map((item)=><Link href={`/articles/${item.slug}`} key={item.slug}><span>{item.title}</span><ArrowRight size={17}/></Link>)}</aside>}
  </main><SiteFooter /></>;
}
