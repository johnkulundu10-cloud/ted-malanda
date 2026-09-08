import { getPublishedCategories } from "@/lib/content";
import { SiteHeaderClient } from "./SiteHeaderClient";

export async function SiteHeader() {
  const categories = await getPublishedCategories();
  return <SiteHeaderClient categories={categories} />;
}
