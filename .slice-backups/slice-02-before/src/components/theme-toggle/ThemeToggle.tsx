"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

const choices = [
  { value: "system", label: "Use device theme", Icon: Laptop },
  { value: "light", label: "Use light theme", Icon: Sun },
  { value: "dark", label: "Use dark theme", Icon: Moon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) return <span className={styles.placeholder} aria-hidden="true" />;

  const index = choices.findIndex((choice) => choice.value === theme);
  const next = choices[(index + 1 + choices.length) % choices.length];
  const CurrentIcon = choices[index >= 0 ? index : 0].Icon;

  return (
    <button className={styles.button} type="button" onClick={() => setTheme(next.value)} aria-label={next.label} title={next.label}>
      <CurrentIcon size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
