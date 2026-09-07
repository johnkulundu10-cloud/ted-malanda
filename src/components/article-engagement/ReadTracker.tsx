"use client";

import { useEffect, useRef } from "react";
import { markArticleRead } from "@/lib/read-history";

export function ReadTracker({ slug }: { slug: string }) {
  const marker = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = marker.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        markArticleRead(slug);
        observer.disconnect();
      }
    }, { threshold: 0.8 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [slug]);
  return <div ref={marker} aria-hidden="true" />;
}
