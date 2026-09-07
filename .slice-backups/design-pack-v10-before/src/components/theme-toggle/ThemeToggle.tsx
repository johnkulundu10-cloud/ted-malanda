"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) return <span className={styles.placeholder} aria-hidden="true" />;

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  const CurrentIcon = isDark ? Moon : Sun;

  return (
    <button className={styles.button} type="button" onClick={() => setTheme(nextTheme)} aria-label={label} title={label}>
      <CurrentIcon size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
