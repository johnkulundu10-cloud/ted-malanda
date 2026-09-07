"use client";

import Image from "next/image";
import { bypassImageOptimizer } from "@/lib/images";
import Link from "next/link";
import { useState } from "react";
import type { Article } from "@/data/articles";
import styles from "./page.module.css";

const images = [
  "https://images.unsplash.com/photo-1489493512598-d08130f49bea?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=80",
];

export function ArchiveList({ articles }: { articles: Article[] }) {
  const categories = ["All", ...new Set(articles.map((article) => article.category))];
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const filtered = category === "All" ? articles : articles.filter((article) => article.category === category);
  const visible = filtered.slice(0, visibleCount);

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    setVisibleCount(12);
  }

  return <section className={styles.archive} aria-label="Archived articles">
    <div className={styles.filter} role="group" aria-label="Filter archive by category">
      <span>Filter by</span>
      <div>{categories.map((item) => <button className={category === item ? styles.active : ""} type="button" onClick={() => chooseCategory(item)} key={item}>{item}</button>)}</div>
    </div>
    <div className={styles.list}>{visible.map((article) => {
      const originalIndex = articles.findIndex((item) => item.slug === article.slug);
      return <article className={styles.row} key={article.slug}>
        <Link className={styles.image} href={`/articles/${article.slug}`} aria-label={`Read ${article.title}`}><Image src={article.image ?? images[originalIndex % images.length]} alt={article.imageAlt ?? ""} fill sizes="(max-width: 700px) 100vw, 260px" unoptimized={bypassImageOptimizer(article.image)} /></Link>
        <div className={styles.copy}><p>{article.category}<span>{article.date}</span></p><h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2><div>{article.excerpt}</div><Link className={styles.read} href={`/articles/${article.slug}`}>Read article →</Link></div>
      </article>;
    })}</div>
    {visibleCount < filtered.length ? <button className={styles.more} type="button" onClick={() => setVisibleCount((count) => count + 12)}>Load more articles</button> : null}
  </section>;
}
