import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<{ saved?:string; deleted?:string }> }) {
  const { supabase } = await requireAdmin();
  const query = await searchParams;
  const { data: articles } = await supabase.from("articles").select("id,title,slug,status,published_at,categories(name)").order("updated_at",{ascending:false});
  return <><div className={styles.heading}><div><h1>Articles</h1><p>Write, edit, publish and organise stories.</p></div><Link className={styles.primary} href="/admin/articles/new">New article</Link></div>
    {query.saved ? <p className={styles.notice}>Article saved successfully.</p> : null}{query.deleted ? <p className={styles.notice}>Article deleted.</p> : null}
    <section className={styles.table}>{articles?.length ? articles.map((article)=><Link className={styles.row} href={`/admin/articles/${article.id}`} key={article.id}><div><strong>{article.title}</strong><small>/{article.slug}</small></div><span className={styles.badge}>{article.status}</span><small>{article.published_at ? new Date(article.published_at).toLocaleDateString("en-GB") : "Not scheduled"}</small></Link>) : <p className={styles.empty}>No articles yet. Create the first one when you are ready.</p>}</section></>;
}
