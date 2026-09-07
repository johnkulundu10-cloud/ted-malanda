import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { getUncleTedColumn, getUncleTedColumns } from "@/lib/uncle-ted";
import { bypassImageOptimizer } from "@/lib/images";
import { absoluteUrl } from "@/lib/site-url";
import styles from "../ted-talk.module.css";

const clean=(html:string)=>({__html:sanitizeHtml(html,{allowedTags:["p","h2","h3","strong","em","blockquote","ul","ol","li","a","br"],allowedAttributes:{a:["href","target","rel"]}})});
const plain=(value:string)=>sanitizeHtml(value,{allowedTags:[],allowedAttributes:{}}).replace(/\s+/g," ").trim();

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug}=await params;
  const column=await getUncleTedColumn(slug);
  if(!column)return{title:"Ted Talk"};
  const description=column.teaser||plain(column.letter).slice(0,180);
  const image=absoluteUrl("/images/social/ted-talk-default.png");
  const url=absoluteUrl(`/ted-talk/${column.slug}`);
  return{title:column.title,description,alternates:{canonical:url},openGraph:{title:column.title,description,url,type:"article",siteName:"Ted Malanda",publishedTime:column.publishedAt,images:[{url:image,width:1200,height:630,alt:"Ted Talk with Uncle Ted editorial illustration"}]},twitter:{card:"summary_large_image",title:column.title,description,images:[image]}};
}

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const columns=await getUncleTedColumns();
  const column=columns.find((item)=>item.slug===slug);
  if(!column)notFound();
  return <><SiteHeader/><main className={styles.detail}>
    <Link href="/ted-talk">← All Ted Talk columns</Link>
    <header><p>TED TALK WITH UNCLE TED · {column.date}</p><h1>{column.title}</h1>{column.teaser?<blockquote>{column.teaser}</blockquote>:null}</header>
    {column.image?<figure><Image src={column.image} alt={column.imageAlt??""} fill sizes="(max-width:860px) 100vw, 820px" unoptimized={bypassImageOptimizer(column.image)}/></figure>:null}
    <section className={styles.letter}><p>Dear Uncle Ted,</p><div dangerouslySetInnerHTML={clean(column.letter)}/><strong>{column.correspondentName}</strong></section>
    <section className={styles.answer}><p>Uncle Ted replies</p><div dangerouslySetInnerHTML={clean(column.response)}/></section>
    {column.originalUrl?<a href={column.originalUrl} target="_blank" rel="noreferrer">Read the original publication ↗</a>:null}
    <aside><p>MORE TED TALK</p>{columns.filter((item)=>item.slug!==slug).slice(0,6).map((item)=><Link key={item.id} href={`/ted-talk/${item.slug}`}>{item.title}</Link>)}</aside>
  </main><SiteFooter/></>;
}
