import { ArticleWorkspaceForm } from "@/components/admin/ArticleWorkspaceForm";
import { requireAdmin } from "@/lib/admin";
import styles from "../../../admin.module.css";

export default async function NewArticlePage({ searchParams }: { searchParams: Promise<{ error?:string }> }) {
  const { supabase } = await requireAdmin();
  const [{ data: authors }, { data: categories }, query] = await Promise.all([supabase.from("authors").select("id,name").order("is_default",{ascending:false}),supabase.from("categories").select("id,name").order("name"),searchParams]);
  return <><div className={styles.heading}><div><h1>New article</h1><p>Start with a new story, or switch to the archive tab to import past writing.</p></div></div><ArticleWorkspaceForm article={null} authors={authors ?? []} categories={categories ?? []} error={query.error} /></>;
}
