import Image from "next/image";
import type { Metadata } from "next";
import { bypassImageOptimizer } from "@/lib/images";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { ArticleReactions, ArticleStats } from "@/components/article-engagement/ArticleEngagement";
import { ReadTracker } from "@/components/article-engagement/ReadTracker";
import { ArticleRecommendations } from "@/components/article-engagement/ArticleRecommendations";
import { getPublishedArticle, getPublishedArticles } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-url";
import styles from "./page.module.css";

const plain=(value:string)=>sanitizeHtml(value,{allowedTags:[],allowedAttributes:{}}).replace(/\s+/g," ").trim();

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug}=await params;
  const article=await getPublishedArticle(slug);
  if(!article)return{title:"Article"};
  const description=article.excerpt||plain(article.content??"").slice(0,180)||"A story by Ted Malanda.";
  const image=absoluteUrl(article.image??"/images/ted-malanda.png");
  const url=absoluteUrl(`/articles/${article.slug}`);
  return{title:article.title,description,alternates:{canonical:url},openGraph:{title:article.title,description,url,type:"article",siteName:"Ted Malanda",authors:[article.author??"Ted Malanda"],images:[{url:image,alt:article.imageAlt??article.title}]},twitter:{card:"summary_large_image",title:article.title,description,images:[image]}};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getPublishedArticles();
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <><SiteHeader /><main>
    <article className={styles.article}>
      <Link className={styles.back} href="/articles"><ArrowLeft size={15}/> All articles</Link>
      <header><p>{article.category}</p><h1>{article.title}</h1><div>{article.date}<span>By {article.author ?? "Ted Malanda"}</span><ArticleStats slug={article.slug} /></div></header>
      <figure className={styles.image}><Image src={article.image ?? "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1400&q=82"} alt={article.imageAlt ?? "Landscape accompanying the article"} fill sizes="(max-width: 860px) 100vw, 820px" priority unoptimized={bypassImageOptimizer(article.image)}/>{article.imageCaption ? <figcaption>{article.imageCaption}</figcaption> : null}</figure>
      <div className={styles.body}>
        {article.content?.trim().startsWith("<") ? <div dangerouslySetInnerHTML={{__html:sanitizeHtml(article.content,{allowedTags:["p","h2","h3","strong","em","s","blockquote","ul","ol","li","a","img","br"],allowedAttributes:{a:["href","target","rel"],img:["src","alt","title","width","height"]}})}}/> : (article.content ?? "Some stories begin quietly, in a conversation overheard on a bus or a small incident that refuses to leave the mind.").split(/\n\s*\n/).map((block,index)=>block.startsWith("## ")?<h2 key={index}>{block.slice(3)}</h2>:<p key={index}>{block}</p>)}
        {article.originalPublication ? <p className={styles.preview}>Originally published by {article.originalPublication}.</p> : null}
      </div>
      <ArticleReactions slug={article.slug} />
      <ReadTracker slug={article.slug}/>
    </article>
    <ArticleRecommendations currentSlug={article.slug} currentCategory={article.category} articles={articles}/>
  </main><SiteFooter /></>;
}
