import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { ArticleReactions, ArticleStats } from "@/components/article-engagement/ArticleEngagement";
import { getPublishedArticle, getPublishedArticles } from "@/lib/content";
import styles from "./page.module.css";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article, articles] = await Promise.all([getPublishedArticle(slug), getPublishedArticles()]);
  if (!article) notFound();
  const related = articles.filter((item) => item.slug !== slug && item.category === article.category).slice(0, 2);
  return <><SiteHeader /><main>
    <article className={styles.article}>
      <Link className={styles.back} href="/articles"><ArrowLeft size={15}/> All articles</Link>
      <header><p>{article.category}</p><h1>{article.title}</h1><div>{article.date}<span>By {article.author ?? "Ted Malanda"}</span><ArticleStats slug={article.slug} /></div></header>
      <figure className={styles.image}><Image src={article.image ?? "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1400&q=82"} alt={article.imageAlt ?? "Landscape accompanying the article"} fill sizes="(max-width: 860px) 100vw, 820px" priority/>{article.imageCaption ? <figcaption>{article.imageCaption}</figcaption> : null}</figure>
      <div className={styles.body}>
        {article.content?.trim().startsWith("<") ? <div dangerouslySetInnerHTML={{__html:sanitizeHtml(article.content,{allowedTags:["p","h2","h3","strong","em","s","blockquote","ul","ol","li","a","img","br"],allowedAttributes:{a:["href","target","rel"],img:["src","alt","title","width","height"]}})}}/> : (article.content ?? "Some stories begin quietly, in a conversation overheard on a bus or a small incident that refuses to leave the mind.").split(/\n\s*\n/).map((block,index)=>block.startsWith("## ")?<h2 key={index}>{block.slice(3)}</h2>:<p key={index}>{block}</p>)}
        {article.originalPublication ? <p className={styles.preview}>Originally published by {article.originalPublication}.</p> : null}
      </div>
      <ArticleReactions slug={article.slug} />
    </article>
    {related.length > 0 && <aside className={styles.related}><p>MORE IN {article.category}</p>{related.map((item)=><Link href={`/articles/${item.slug}`} key={item.slug}><span>{item.title}</span><ArrowRight size={17}/></Link>)}</aside>}
  </main><SiteFooter /></>;
}
