import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "../simple-page.module.css";

export default function ArchivePage() {
  return <><SiteHeader /><main className={styles.main}><p className={styles.eyebrow}>PAST WORK</p><h1>Archive</h1><p>A growing collection of Ted Malanda’s previously published columns and stories.</p></main><SiteFooter /></>;
}
