"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/articles";
import { useReadArticles } from "@/lib/read-history";
import styles from "./ArticleRecommendations.module.css";

export function ArticleRecommendations({ currentSlug, currentCategory, articles }: { currentSlug:string; currentCategory:string; articles:Article[] }) {
  const read = useReadArticles();
  const available = articles.filter((item) => item.slug !== currentSlug && !read.has(item.slug));
  const sameCategory = available.filter((item) => item.category === currentCategory);
  const otherCategories = available.filter((item) => item.category !== currentCategory);
  const recommendations = [...sameCategory, ...otherCategories].slice(0, 10);
  if (!recommendations.length) return null;
  return <aside className={styles.related}>
    <p>KEEP READING</p>
    <div className={styles.grid}>{recommendations.map((item) => <Link href={`/articles/${item.slug}`} key={item.slug}><span><small>{item.category}</small>{item.title}</span><ArrowRight size={17}/></Link>)}</div>
  </aside>;
}
