"use client";

import { Eye, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import styles from "./ArticleEngagement.module.css";

type Reaction = "like" | "dislike" | null;
type Stats = { views: number; likes: number; dislikes: number };
const emptyStats: Stats = { views: 0, likes: 0, dislikes: 0 };

function visitorId() {
  const key = "ted-malanda-visitor";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  localStorage.setItem(key, value);
  return value;
}

export function ArticleEngagement({ slug }: { slug: string }) {
  const [stats, setStats] = useState(emptyStats);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      await Promise.resolve();
      const savedReaction = localStorage.getItem(`ted-malanda-reaction:${slug}`) as Reaction;
      setReaction(savedReaction === "like" || savedReaction === "dislike" ? savedReaction : null);
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        const viewedKey = `ted-malanda-viewed:${slug}`;
        const viewed = localStorage.getItem(viewedKey);
        if (!viewed) localStorage.setItem(viewedKey, "1");
        setStats({ views: 1, likes: savedReaction === "like" ? 1 : 0, dislikes: savedReaction === "dislike" ? 1 : 0 });
        return;
      }
      await supabase.rpc("record_article_view", { p_slug: slug, p_visitor_id: visitorId() });
      const { data } = await supabase.from("article_stats").select("views, likes, dislikes").eq("slug", slug).maybeSingle();
      if (data) setStats(data);
    })();
  }, [slug]);

  async function react(next: Exclude<Reaction, null>) {
    if (busy) return;
    setBusy(true);
    const intended: Reaction = reaction === next ? null : next;
    const previous = reaction;
    setReaction(intended);
    setStats((current) => ({
      ...current,
      likes: Math.max(0, current.likes + (previous === "like" ? -1 : 0) + (intended === "like" ? 1 : 0)),
      dislikes: Math.max(0, current.dislikes + (previous === "dislike" ? -1 : 0) + (intended === "dislike" ? 1 : 0)),
    }));
    if (intended) localStorage.setItem(`ted-malanda-reaction:${slug}`, intended);
    else localStorage.removeItem(`ted-malanda-reaction:${slug}`);
    const supabase = getSupabaseBrowser();
    if (supabase) {
      const { error } = await supabase.rpc("set_article_reaction", { p_slug: slug, p_visitor_id: visitorId(), p_reaction: intended });
      if (error) {
        setReaction(previous);
        const { data } = await supabase.from("article_stats").select("views, likes, dislikes").eq("slug", slug).maybeSingle();
        if (data) setStats(data);
      }
    }
    setBusy(false);
  }

  return <div className={styles.engagement} aria-label="Article engagement">
    <span><Eye size={16} aria-hidden="true" />{stats.views.toLocaleString()} views</span>
    <button type="button" disabled={busy} className={reaction === "like" ? styles.active : ""} aria-pressed={reaction === "like"} onClick={() => void react("like")}><ThumbsUp size={16} aria-hidden="true" />{stats.likes}</button>
    <button type="button" disabled={busy} className={reaction === "dislike" ? styles.active : ""} aria-pressed={reaction === "dislike"} onClick={() => void react("dislike")}><ThumbsDown size={16} aria-hidden="true" />{stats.dislikes}</button>
  </div>;
}
