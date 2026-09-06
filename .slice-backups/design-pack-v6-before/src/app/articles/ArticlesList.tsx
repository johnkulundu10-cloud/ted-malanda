"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Article } from "@/data/articles";
import styles from "./page.module.css";

const images = [
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=700&q=80",
];

export function ArticlesList({ articles }: { articles: Article[] }) {
  const categories = ["All", ...new Set(articles.map((article) => article.category))];
  const [category, setCategory] = useState("All");
  const filtered = category === "All" ? articles : articles.filter((article) => article.category === category);

  return <section className={styles.writing} aria-labelledby="all-writing">
    <div className={styles.listHeading}><h2 id="all-writing">All writing</h2></div>
    <div className={styles.filter} role="group" aria-label="Filter articles by category">
      <span>Filter by</span><div>{categories.map((item) => <button className={category === item ? styles.active : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    </div>
    <div className={styles.list}>{filtered.map((article, index) => <article className={styles.row} key={article.slug}>
      <Link className={styles.rowImage} href={`/articles/${article.slug}`} aria-label={`Read ${article.title}`}><Image src={images[index % images.length]} alt="" fill sizes="(max-width: 700px) 100vw, 250px" /></Link>
      <div className={styles.rowCopy}><p>{article.category}<span>{article.date}</span></p><h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3><div>{article.excerpt}</div><Link className={styles.rowRead} href={`/articles/${article.slug}`}>Read article →</Link></div>
    </article>)}</div>
    {filtered.length === 0 ? <p className={styles.empty}>No articles in this category yet.</p> : null}
  </section>;
}
