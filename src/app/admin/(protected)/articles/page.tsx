import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";
import { AdminArticlesTable, type AdminArticleRow } from "@/components/admin/AdminArticlesTable";

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<{ saved?:string; deleted?:string }> }) {
  const { supabase } = await requireAdmin();
  const query = await searchParams;
  const { data: articles } = await supabase.from("articles").select("id,title,slug,excerpt,status,published_at,image_url,image_alt,is_featured,categories(name)").order("updated_at",{ascending:false});
  const rows: AdminArticleRow[] = (articles ?? []).map((article) => ({
    id: article.id, title: article.title, slug: article.slug, status: article.status,
    excerpt: article.excerpt ?? "", published_at: article.published_at,
    image: article.image_url ?? null, imageAlt: article.image_alt ?? "",
    featured: Boolean(article.is_featured),
    category: (article.categories as {name?:string}|null)?.name ?? "Uncategorised",
  }));
  return <><div className={styles.heading}><div><h1>Articles</h1><p>Write, edit, publish and organise stories.</p></div><Link className={styles.primary} href="/admin/articles/new">New article</Link></div>
    {query.saved ? <p className={styles.notice}>Article saved successfully.</p> : null}{query.deleted ? <p className={styles.notice}>Article deleted.</p> : null}
    <AdminArticlesTable articles={rows}/></>;
}
