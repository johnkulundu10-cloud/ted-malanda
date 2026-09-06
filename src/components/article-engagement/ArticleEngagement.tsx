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

function savedReaction(slug: string): Reaction {
  const value = localStorage.getItem(`ted-malanda-reaction:${slug}`);
  return value === "like" || value === "dislike" ? value : null;
}

function eventName(slug: string) { return `ted-malanda-engagement:${slug}`; }

export function ArticleStats({ slug }: { slug: string }) {
  const [stats, setStats] = useState(emptyStats);

  useEffect(() => {
    const receive = (event: Event) => setStats((event as CustomEvent<Stats>).detail);
    window.addEventListener(eventName(slug), receive);
    void (async () => {
      await Promise.resolve();
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        const viewedKey = `ted-malanda-viewed:${slug}`;
        if (!localStorage.getItem(viewedKey)) localStorage.setItem(viewedKey, "1");
        setStats({ views: 1, likes: savedReaction(slug) === "like" ? 1 : 0, dislikes: savedReaction(slug) === "dislike" ? 1 : 0 });
        return;
      }
      await supabase.rpc("record_article_view", { p_slug: slug, p_visitor_id: visitorId() });
      const { data } = await supabase.from("article_stats").select("views, likes, dislikes").eq("slug", slug).maybeSingle();
      if (data) setStats(data);
    })();
    return () => window.removeEventListener(eventName(slug), receive);
  }, [slug]);

  return <span className={styles.summary} aria-label={`${stats.views} views and ${stats.likes} likes`}>
    <span><Eye size={11} aria-hidden="true" />{stats.views.toLocaleString()}</span>
    <span><ThumbsUp size={11} aria-hidden="true" />{stats.likes.toLocaleString()}</span>
  </span>;
}

export function ArticleReactions({ slug }: { slug: string }) {
  const [stats, setStats] = useState(emptyStats);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      await Promise.resolve();
      setReaction(savedReaction(slug));
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setStats({ views: 1, likes: savedReaction(slug) === "like" ? 1 : 0, dislikes: savedReaction(slug) === "dislike" ? 1 : 0 });
        return;
      }
      const { data } = await supabase.from("article_stats").select("views, likes, dislikes").eq("slug", slug).maybeSingle();
      if (data) setStats(data);
    })();
  }, [slug]);

  async function react(next: Exclude<Reaction, null>) {
    if (busy) return;
    setBusy(true);
    const intended: Reaction = reaction === next ? null : next;
    const previous = reaction;
    const nextStats = {
      ...stats,
      likes: Math.max(0, stats.likes + (previous === "like" ? -1 : 0) + (intended === "like" ? 1 : 0)),
      dislikes: Math.max(0, stats.dislikes + (previous === "dislike" ? -1 : 0) + (intended === "dislike" ? 1 : 0)),
    };
    setReaction(intended);
    setStats(nextStats);
    window.dispatchEvent(new CustomEvent(eventName(slug), { detail: nextStats }));
    if (intended) localStorage.setItem(`ted-malanda-reaction:${slug}`, intended);
    else localStorage.removeItem(`ted-malanda-reaction:${slug}`);
    const supabase = getSupabaseBrowser();
    if (supabase) {
      const { error } = await supabase.rpc("set_article_reaction", { p_slug: slug, p_visitor_id: visitorId(), p_reaction: intended });
      if (error) {
        setReaction(previous);
        const { data } = await supabase.from("article_stats").select("views, likes, dislikes").eq("slug", slug).maybeSingle();
        if (data) { setStats(data); window.dispatchEvent(new CustomEvent(eventName(slug), { detail: data })); }
      }
    }
    setBusy(false);
  }

  return <section className={styles.reactions} aria-label="Rate this article">
    <p>Did you enjoy this story?</p>
    <div>
      <button type="button" disabled={busy} className={reaction === "like" ? styles.active : ""} aria-pressed={reaction === "like"} onClick={() => void react("like")}><ThumbsUp size={17} aria-hidden="true" />Like <span>{stats.likes}</span></button>
      <button type="button" disabled={busy} className={reaction === "dislike" ? styles.active : ""} aria-pressed={reaction === "dislike"} onClick={() => void react("dislike")}><ThumbsDown size={17} aria-hidden="true" />Not for me <span>{stats.dislikes}</span></button>
    </div>
  </section>;
}
