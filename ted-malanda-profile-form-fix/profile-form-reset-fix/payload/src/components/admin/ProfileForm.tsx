"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import styles from "@/app/admin/admin.module.css";

export function ProfileForm({ email }: { email: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function updatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setMessage("");
    setError("");

    const form = new FormData(formElement);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The two passwords do not match.");
      return;
    }

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Supabase environment variables have not been added yet.");
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    formElement.reset();
    setMessage("Password updated. Keep it somewhere safe.");
  }

  return <form className={`${styles.form} ${styles.profileForm}`} onSubmit={updatePassword}>
    <div className={styles.profileEmail}>
      <span>Signed in as</span>
      <strong>{email}</strong>
    </div>
    <div className={styles.field}>
      <label htmlFor="password">New password</label>
      <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      <p className={styles.fieldHint}>Use at least 8 characters.</p>
    </div>
    <div className={styles.field}>
      <label htmlFor="confirmation">Confirm new password</label>
      <input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} required />
    </div>
    {error ? <p className={styles.errorNotice}>{error}</p> : null}
    {message ? <p className={styles.notice}>{message}</p> : null}
    <button className={styles.primary} disabled={busy}>{busy ? "Updating…" : "Update password"}</button>
  </form>;
}
