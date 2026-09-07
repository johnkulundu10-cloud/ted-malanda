"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import styles from "../admin.module.css";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowser();
    if (!supabase) { setError("Supabase environment variables have not been added yet."); setBusy(false); return; }
    const { error } = await supabase.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
    if (error) { setError(error.message); setBusy(false); return; }
    router.replace("/admin"); router.refresh();
  }
  return <form className={styles.form} onSubmit={submit}>
    <div className={styles.field}><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
    <div className={styles.field}><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
    {error ? <p className={styles.notice}>{error}</p> : null}
    <button className={styles.primary} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
  </form>;
}
