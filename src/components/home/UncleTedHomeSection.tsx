import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { UncleTedColumn } from "@/lib/uncle-ted";
import styles from "@/app/page.module.css";

export function UncleTedHomeSection({columns}:{columns:UncleTedColumn[]}) {
  if (!columns.length) return null;
  return <section className={styles.uncleTedSection}>
    <div className={styles.sectionHeading}>
      <div><p className={styles.kicker}>With Uncle Ted</p><h2>Ted Talk</h2></div>
      <Link href="/ted-talk">All columns <ArrowRight size={15}/></Link>
    </div>
    <div className={styles.uncleTedGrid}>{columns.map((column)=><article key={column.id}>
      <p>{column.correspondentName} asks</p>
      <h3><Link href={`/ted-talk/${column.slug}`}>{column.title}</Link></h3>
      {column.teaser?<blockquote>{column.teaser}</blockquote>:null}
      <span>{column.date}</span>
    </article>)}</div>
  </section>;
}
