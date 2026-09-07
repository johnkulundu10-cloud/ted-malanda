import { articles as fallbackArticles, type Article } from "@/data/articles";
import { getSupabaseServer } from "@/lib/supabase-server";

type ArticleRow = {
  slug: string; title: string; excerpt: string | null; content: string | null;
  published_at: string | null; is_archived: boolean; is_featured: boolean;
  image_url: string | null; image_alt: string | null; image_caption: string | null;
  original_publication: string | null; authors: { name?: string } | null;
  categories: { name?: string } | null;
};

function displayDate(value: string | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

function mapRow(row: ArticleRow): Article {
  return {
    slug: row.slug, title: row.title, category: row.categories?.name ?? "Uncategorised",
    date: displayDate(row.published_at), year: row.published_at?.slice(0, 4) ?? "",
    excerpt: row.excerpt ?? "", featured: row.is_featured, archived: row.is_archived,
    author: row.authors?.name ?? "Ted Malanda", content: row.content ?? undefined,
    image: row.image_url ?? undefined, imageAlt: row.image_alt ?? undefined,
    imageCaption: row.image_caption ?? undefined, originalPublication: row.original_publication ?? undefined,
  };
}

export async function getPublishedArticles(): Promise<Article[]> {
  const supabase = await getSupabaseServer();
  if (!supabase) return fallbackArticles;
  const { data, error } = await supabase.from("articles")
    .select("slug,title,excerpt,content,published_at,is_archived,is_featured,image_url,image_alt,image_caption,original_publication,authors(name),categories(name)")
    .eq("status", "published").lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (error || !data?.length) return fallbackArticles;
  const databaseArticles = (data as unknown as ArticleRow[]).map(mapRow);
  const databaseSlugs = new Set(databaseArticles.map((article) => article.slug));
  return [...databaseArticles, ...fallbackArticles.filter((article) => !databaseSlugs.has(article.slug))];
}

export async function getPublishedArticle(slug: string) {
  return (await getPublishedArticles()).find((article) => article.slug === slug);
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = await getSupabaseServer();
  if (!supabase) return fallback;
  const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
  return (data?.value as T | undefined) ?? fallback;
}
