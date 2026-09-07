import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { getPublishedArticles } from "@/lib/content";
import { SearchClient } from "./SearchClient";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const articles = await getPublishedArticles();
  return <><SiteHeader /><SearchClient articles={articles} initialQuery={q} /><SiteFooter /></>;
}
