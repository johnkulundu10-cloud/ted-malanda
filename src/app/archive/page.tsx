import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { getPublishedArticles, getPublishedCategories } from "@/lib/content";
import { ArchiveList } from "./ArchiveList";
import styles from "./page.module.css";

export const metadata = { title: "Archive" };

export default async function ArchivePage() {
  const [publishedArticles, categories] = await Promise.all([getPublishedArticles(), getPublishedCategories()]);
  const articles = publishedArticles.filter((article) => article.archived !== false);
  return <><SiteHeader /><main className={`${styles.main} archive-page`}>
    <header><p>PAST WORK</p><h1>From the archive</h1><div>A growing collection of previously published columns, stories and observations by Ted Malanda.</div></header>
    <ArchiveList articles={articles} categories={categories.map((category) => category.name)} />
  </main><SiteFooter /></>;
}
