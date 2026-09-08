import { notFound } from "next/navigation";
import { ArticleWorkspaceForm } from "@/components/admin/ArticleWorkspaceForm";
import { requireAdmin } from "@/lib/admin";
import styles from "../../../admin.module.css";

export default async function EditArticlePage({ params, searchParams }: { params:Promise<{id:string}>; searchParams:Promise<{error?:string}> }) {
  const { supabase } = await requireAdmin(); const { id } = await params;
  const [{ data: article }, { data: authors }, { data: categories }, query] = await Promise.all([supabase.from("articles").select("*").eq("id",id).maybeSingle(),supabase.from("authors").select("id,name").order("is_default",{ascending:false}),supabase.from("categories").select("id,name").order("name"),searchParams]);
  if (!article) notFound();
  return <><div className={styles.heading}><div><h1>Edit article</h1><p>Changes become visible when the article is published.</p></div></div><ArticleWorkspaceForm article={article} authors={authors ?? []} categories={categories ?? []} error={query.error} /></>;
}
