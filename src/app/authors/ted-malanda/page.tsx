import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "./page.module.css";

export const metadata = { title: "Ted Malanda — Author" };
export default function AuthorPage(){return <><SiteHeader/><main className={styles.main}><Image src="/images/ted-malanda.png" alt="Ted Malanda" width={360} height={360}/><div><p>AUTHOR</p><h1>Ted Malanda</h1><span>Kenyan writer, columnist and veteran editor writing about public affairs, humour, culture and everyday life.</span><nav><Link href="/about">Read full biography</Link><Link href="/articles?view=list#all-writing">View all writing</Link></nav></div></main><SiteFooter/></>}
