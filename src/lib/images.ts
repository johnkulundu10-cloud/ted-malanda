export function bypassImageOptimizer(src: string | undefined) {
  if (!src) return false;
  try {
    return new URL(src).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export function usableArticleImage(src: string | null | undefined) {
  if (!src) return undefined;
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return undefined;
    if (url.hostname === "cdn.standardmedia.co.ke" && !url.pathname.startsWith("/images/")) return undefined;
    return src;
  } catch {
    return src.startsWith("/") ? src : undefined;
  }
}
