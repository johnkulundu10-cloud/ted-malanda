import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "../simple-page.module.css";

export default function AboutPage() {
  return <><SiteHeader /><main className={styles.main}><p className={styles.eyebrow}>ABOUT</p><h1>Ted Malanda</h1><p>Ted is a Kenyan writer, columnist and veteran editor known for finding humour, contradiction and insight in everyday life.</p><p>This page will become fully editable from the Admin area, including Ted’s portrait, biography, highlights and links.</p></main><SiteFooter /></>;
}
