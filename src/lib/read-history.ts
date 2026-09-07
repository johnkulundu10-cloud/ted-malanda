"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "ted-malanda:read-articles:v1";
const EVENT_NAME = "ted-malanda:read-history-change";

function snapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

export function useReadArticles() {
  const serialized = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return useMemo(() => {
    try { return new Set<string>(JSON.parse(serialized)); }
    catch { return new Set<string>(); }
  }, [serialized]);
}

export function markArticleRead(slug: string) {
  let current: string[] = [];
  try { current = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch {}
  if (current.includes(slug)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, slug].slice(-500)));
  window.dispatchEvent(new Event(EVENT_NAME));
}
