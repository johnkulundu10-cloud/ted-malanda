"use client";

import Image from "next/image";
import Link from "next/link";
import Select from "react-select";
import { Eye, ImageIcon, Search, Star, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useState } from "react";
import { bypassImageOptimizer } from "@/lib/images";
import styles from "@/app/admin/admin.module.css";

export type AdminArticleRow={id:string;title:string;slug:string;excerpt:string;status:string;published_at:string|null;category:string;image:string|null;imageAlt:string;featured:boolean;views:number;likes:number;dislikes:number};
type Option={value:string;label:string};

const selectStyles={
  control:(base:Record<string,unknown>)=>({...base,minHeight:36,height:36,borderRadius:2,borderColor:"color-mix(in srgb, var(--color-border) 68%, transparent)",background:"var(--color-canvas)",boxShadow:"none",fontSize:".83rem",cursor:"pointer","&:hover":{borderColor:"color-mix(in srgb, var(--color-border) 68%, transparent)"}}),
  valueContainer:(base:Record<string,unknown>)=>({...base,padding:"0 .6rem"}),
  indicatorsContainer:(base:Record<string,unknown>)=>({...base,height:34}),
  menu:(base:Record<string,unknown>)=>({...base,zIndex:30,background:"var(--color-surface)",border:"1px solid var(--color-border)",borderRadius:2,boxShadow:"0 12px 30px rgba(0,0,0,.1)"}),
  option:(base:Record<string,unknown>,state:{isSelected:boolean;isFocused:boolean})=>({...base,fontSize:".83rem",background:state.isSelected?"var(--color-text)":state.isFocused?"var(--color-chrome)":"transparent",color:state.isSelected?"var(--color-canvas)":"var(--color-text)",cursor:"pointer"}),
  singleValue:(base:Record<string,unknown>)=>({...base,color:"var(--color-text)"}),
  input:(base:Record<string,unknown>)=>({...base,color:"var(--color-text)"}),
};

export function AdminArticlesTable({articles}:{articles:AdminArticleRow[]}) {
  const [search,setSearch]=useState("");
  const [status,setStatus]=useState("all");
  const [category,setCategory]=useState("all");
  const [featured,setFeatured]=useState("all");
  const categories=[...new Set(articles.map((item)=>item.category).filter(Boolean))].sort();
  const statusOptions:Option[]=[{value:"all",label:"All statuses"},{value:"published",label:"Published"},{value:"draft",label:"Drafts"}];
  const categoryOptions:Option[]=[{value:"all",label:"All categories"},...categories.map((item)=>({value:item,label:item}))];
  const featuredOptions:Option[]=[{value:"all",label:"All articles"},{value:"featured",label:"Featured"},{value:"standard",label:"Not featured"}];
  const filtered=articles.filter((article)=>{
    const term=search.trim().toLowerCase();
    return (!term||`${article.title} ${article.excerpt}`.toLowerCase().includes(term))
      &&(status==="all"||article.status===status)
      &&(category==="all"||article.category===category)
      &&(featured==="all"||(featured==="featured"?article.featured:!article.featured));
  });
  const clear=()=>{setSearch("");setStatus("all");setCategory("all");setFeatured("all");};
  return <>
    <section className={styles.filters} aria-label="Filter articles">
      <label className={styles.searchField}><Search size={16}/><input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search title or description" aria-label="Search articles"/></label>
      <Select<Option,false> instanceId="article-status" aria-label="Filter by status" value={statusOptions.find((item)=>item.value===status)} options={statusOptions} onChange={(item)=>setStatus(item?.value??"all")} styles={selectStyles}/>
      <Select<Option,false> instanceId="article-category" aria-label="Filter by category" value={categoryOptions.find((item)=>item.value===category)} options={categoryOptions} onChange={(item)=>setCategory(item?.value??"all")} styles={selectStyles}/>
      <Select<Option,false> instanceId="article-featured" aria-label="Filter featured articles" value={featuredOptions.find((item)=>item.value===featured)} options={featuredOptions} onChange={(item)=>setFeatured(item?.value??"all")} styles={selectStyles}/>
      <button type="button" onClick={clear}><X size={14}/>Clear</button>
    </section>
    <p className={styles.resultCount}>{filtered.length} of {articles.length} articles</p>
    <section className={`${styles.table} ${styles.articleTable}`}>{filtered.length?filtered.map((article)=><Link className={styles.adminArticleRow} href={`/admin/articles/${article.id}`} key={article.id}>
      <div className={styles.adminThumb}>{article.image?<Image src={article.image} alt={article.imageAlt} width={72} height={52} unoptimized={bypassImageOptimizer(article.image)}/>:<ImageIcon size={19}/>}</div>
      <div className={styles.adminRowCopy}>
        <strong>{article.title}</strong>
        <small>{article.excerpt||"No description added yet."}</small>
        <div className={styles.adminRowMeta}>
          <span>{article.category||"Uncategorised"}</span>
          <span className={styles.articleMetrics} aria-label={`${article.views} views, ${article.likes} likes and ${article.dislikes} dislikes`}>
            <span title="Views"><Eye size={12} aria-hidden="true" />{article.views.toLocaleString()}</span>
            <span title="Likes"><ThumbsUp size={12} aria-hidden="true" />{article.likes.toLocaleString()}</span>
            <span title="Not for me"><ThumbsDown size={12} aria-hidden="true" />{article.dislikes.toLocaleString()}</span>
          </span>
        </div>
      </div>
      <span className={styles.featureState}>{article.featured?<><Star size={13} fill="currentColor"/>Featured</>:"—"}</span>
      <span className={styles.badge}>{article.status}</span>
      <small>{article.published_at?new Date(article.published_at).toLocaleDateString("en-GB"):"Not scheduled"}</small>
    </Link>):<p className={styles.empty}>No articles match these filters.</p>}</section>
  </>;
}
