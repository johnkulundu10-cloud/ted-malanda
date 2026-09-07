import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { getPublishedArticles } from "@/lib/content";
import { ArchiveList } from "./ArchiveList";
import styles from "./page.module.css";

export const metadata = { title: "Archive" };

export default async function ArchivePage() {
  const articles = (await getPublishedArticles()).filter((article) => article.archived !== false);
  return <><SiteHeader /><main className={`${styles.main} archive-page`}>
    <header><p>PAST WORK</p><h1>From the archive</h1><div>A growing collection of previously published columns, stories and observations by Ted Malanda.</div></header>
    <ArchiveList articles={articles} />
  </main><SiteFooter /></>;
}
