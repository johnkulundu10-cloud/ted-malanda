import Link from "next/link";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "./not-found.module.css";

export default function NotFound() {
  return <><SiteHeader /><main className={styles.main}><p>404</p><h1>This story isn’t here.</h1><div>The page may have moved, or the address may be incomplete.</div><nav><Link href="/">Return home</Link><Link href="/search">Search articles</Link></nav></main><SiteFooter /></>;
}
