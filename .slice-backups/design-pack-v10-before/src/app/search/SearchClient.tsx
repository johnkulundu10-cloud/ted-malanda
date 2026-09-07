"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { Article } from "@/data/articles";
import styles from "./page.module.css";

export function SearchClient({ articles, initialQuery }: { articles: Article[]; initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => normalized ? articles.filter((article) => `${article.title} ${article.category} ${article.excerpt} Ted Malanda`.toLowerCase().includes(normalized)) : [], [articles, normalized]);

  function submit(event: FormEvent) {
    event.preventDefault();
    router.replace(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search", { scroll: false });
  }

  return <main className={styles.main}>
    <header><p>SEARCH THE ARCHIVE</p><h1>Find a story</h1></header>
    <form onSubmit={submit}><Search size={20} aria-hidden="true" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, subjects or words…" aria-label="Search articles" /><button type="submit">Search</button></form>
    <section aria-live="polite">
      {normalized ? <p className={styles.count}>{results.length} {results.length === 1 ? "result" : "results"} for “{query.trim()}”</p> : <p className={styles.hint}>Start typing to search all published and archived writing.</p>}
      {results.map((article) => <article key={article.slug}><p>{article.category}<span>{article.date}</span></p><h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2><div>{article.excerpt}</div></article>)}
      {normalized && results.length === 0 ? <div className={styles.empty}><h2>No matching stories</h2><p>Try a broader word, a category such as “Kenyan Life,” or part of an article title.</p></div> : null}
    </section>
  </main>;
}
