import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { HomeContent } from "@/components/home/HomeContent";
import { UncleTedHomeSection } from "@/components/home/UncleTedHomeSection";
import { getPublishedArticles, getPublishedCategories } from "@/lib/content";
import { getUncleTedColumns } from "@/lib/uncle-ted";

export default async function Home() {
  const [articles, uncleTedColumns, categories] = await Promise.all([
    getPublishedArticles(),
    getUncleTedColumns(),
    getPublishedCategories(),
  ]);
  return <><SiteHeader /><HomeContent articles={articles} categories={categories}/><UncleTedHomeSection columns={uncleTedColumns.slice(0,3)}/><SiteFooter showCta /></>;
}
