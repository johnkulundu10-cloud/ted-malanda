import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "../simple-page.module.css";

export default function ArticlesPage() {
  return <><SiteHeader /><main className={styles.main}><p className={styles.eyebrow}>WRITING</p><h1>Articles</h1><p>New stories and commentary will appear here as we connect the publishing system.</p></main><SiteFooter /></>;
}
