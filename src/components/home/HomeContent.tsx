"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";
import { bypassImageOptimizer } from "@/lib/images";
import { useReadArticles } from "@/lib/read-history";
import styles from "@/app/page.module.css";

const fallbacks=[
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=82",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=82",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=700&q=80",
];

function preview(article: Article) {
  if(article.excerpt?.trim()) return article.excerpt.trim();
  const text=(article.content??"").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
  return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.slice(0,2).join(" ").trim()??"";
}

export function HomeContent({articles}:{articles:Article[]}){
  const read=useReadArticles();
  const unread=articles.filter((article)=>!read.has(article.slug));
  const pool=unread.length?unread:articles;
  const latest=pool[0];
  if(!latest)return <main className={styles.emptyHome}>No published stories yet.</main>;
  const archiveLead=pool.find((article)=>article.slug!==latest.slug&&article.archived&&article.featured)
    ??pool.find((article)=>article.slug!==latest.slug&&article.archived)
    ??pool.find((article)=>article.slug!==latest.slug);
  const leadStories=[{...latest,label:"Latest story",image:latest.image??fallbacks[0]},...(archiveLead?[{...archiveLead,label:"From the archive",image:archiveLead.image??fallbacks[1]}]:[])];
  const used=new Set(leadStories.map((item)=>item.slug));
  const latestArticles=pool.filter((item)=>!used.has(item.slug)).slice(0,4);
  const categoryNames=[...new Set(pool.map((item)=>item.category))];
  const categories=categoryNames.map((name)=>({name,items:pool.filter((item)=>item.category===name).slice(0,3)}));
  const visualStories=pool.filter((item)=>!used.has(item.slug)&&!latestArticles.some((latestItem)=>latestItem.slug===item.slug)).slice(0,4).map((item,index)=>({...item,image:item.image??fallbacks[index%fallbacks.length]}));
  return <main>
    <section className={styles.leads} aria-label="Featured writing">{leadStories.map((story,index)=><article className={styles.leadCard} key={`${story.label}-${story.slug}`}>
      <Link className={styles.leadImage} href={`/articles/${story.slug}`}><Image src={story.image} alt={story.imageAlt??""} fill priority={index===0} sizes="(max-width: 760px) 100vw, 50vw" unoptimized={bypassImageOptimizer(story.image)}/></Link>
      <p className={styles.kicker}>{story.label}</p>{index===0?<h1><Link href={`/articles/${story.slug}`}>{story.title}</Link></h1>:<h2><Link href={`/articles/${story.slug}`}>{story.title}</Link></h2>}
      {preview(story)?<p className={styles.excerpt}>{preview(story)}</p>:null}<div className={styles.meta}>{story.category}<span>{story.date}</span></div><Link className={styles.action} href={`/articles/${story.slug}`}>Read article <ArrowRight size={15}/></Link>
    </article>)}</section>
    <section className={styles.section}><div className={styles.sectionHeading}><h2>Latest writing</h2><Link href="/articles">All articles <ArrowRight size={15}/></Link></div>
      <div className={styles.latestList}>{latestArticles.map((article)=><article key={article.slug}><div className={styles.latestMeta}>{article.category}<span>{article.date}</span></div><h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>{preview(article)?<p>{preview(article)}</p>:null}</article>)}</div>
    </section>
    {visualStories.length?<section className={styles.visualSection}><div className={styles.sectionHeading}><h2>More stories to explore</h2><Link href="/archive">Browse archive <ArrowRight size={15}/></Link></div><div className={styles.visualGrid}>{visualStories.map((story)=><article key={story.slug}><Link className={styles.visualImage} href={`/articles/${story.slug}`}><Image src={story.image} alt={story.imageAlt??""} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 25vw" unoptimized={bypassImageOptimizer(story.image)}/></Link><p className={styles.kicker}>{story.category}</p><h3><Link href={`/articles/${story.slug}`}>{story.title}</Link></h3><span>{story.date}</span></article>)}</div></section>:null}
    <section className={styles.section}><div className={styles.sectionHeading}><h2>Explore by subject</h2></div><div className={styles.categoryGrid}>{categories.map((category)=><article className={styles.category} key={category.name}><h3>{category.name}</h3><ul>{category.items.map((item)=><li key={item.slug}><Link href={`/articles/${item.slug}`}>{item.title}</Link></li>)}</ul><Link className={styles.categoryLink} href={`/articles?category=${encodeURIComponent(category.name)}#all-writing`}>More in {category.name} <ArrowRight size={15}/></Link></article>)}</div></section>
  </main>;
}
