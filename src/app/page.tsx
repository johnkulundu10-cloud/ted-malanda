import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { HomeContent } from "@/components/home/HomeContent";
import { UncleTedHomeSection } from "@/components/home/UncleTedHomeSection";
import { getPublishedArticles } from "@/lib/content";
import { getUncleTedColumns } from "@/lib/uncle-ted";

export default async function Home() {
  const [articles, uncleTedColumns] = await Promise.all([
    getPublishedArticles(),
    getUncleTedColumns(),
  ]);
  return <><SiteHeader /><HomeContent articles={articles}/><UncleTedHomeSection columns={uncleTedColumns.slice(0,3)}/><SiteFooter /></>;
}
