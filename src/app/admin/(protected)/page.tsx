import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import styles from "../admin.module.css";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const [{ count: all }, { count: published }, { count: drafts }] = await Promise.all([
    supabase.from("articles").select("id", { count:"exact", head:true }),
    supabase.from("articles").select("id", { count:"exact", head:true }).eq("status","published"),
    supabase.from("articles").select("id", { count:"exact", head:true }).eq("status","draft"),
  ]);
  return <><div className={styles.heading}><div><h1>Overview</h1><p>A quiet place to manage Ted’s writing.</p></div><Link className={styles.primary} href="/admin/articles/new">New article</Link></div>
    <section className={styles.cards}><div className={styles.card}><span>ALL ARTICLES</span><strong>{all ?? 0}</strong></div><div className={styles.card}><span>PUBLISHED</span><strong>{published ?? 0}</strong></div><div className={styles.card}><span>DRAFTS</span><strong>{drafts ?? 0}</strong></div></section></>;
}
