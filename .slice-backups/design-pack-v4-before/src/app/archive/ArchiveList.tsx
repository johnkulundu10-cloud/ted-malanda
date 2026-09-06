"use client";

import Link from "next/link";
import { useState } from "react";
import type { Article } from "@/data/articles";
import styles from "./page.module.css";

export function ArchiveList({ articles }: { articles: Article[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? articles : articles.slice(0, 6);

  return <section className={styles.archive} aria-label="Archived articles">
    <div className={styles.grid}>{visible.map((article, index) => <article className={styles.card} key={article.slug}>
      <div className={styles.number}>{String(index + 1).padStart(2, "0")}</div>
      <p>{article.category}<span>{article.date}</span></p>
      <h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2>
      <div>{article.excerpt}</div>
      <Link className={styles.read} href={`/articles/${article.slug}`}>Read article →</Link>
    </article>)}</div>
    {!expanded && articles.length > 6 ? <button type="button" onClick={() => setExpanded(true)}>View more articles</button> : null}
  </section>;
}
