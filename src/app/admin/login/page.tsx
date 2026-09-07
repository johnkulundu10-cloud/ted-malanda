import Link from "next/link";
import { LoginForm } from "./LoginForm";
import styles from "../admin.module.css";

export const metadata = { title: "Admin sign in" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className={styles.login}><section className={styles.loginCard}>
    <Link className={styles.brand} href="/">TED MALANDA</Link><h1>Welcome back</h1><p>Sign in to manage articles and website content.</p>
    {error === "setup" ? <p className={styles.notice}>Complete the Supabase setup and environment variables first.</p> : null}
    {error === "permission" ? <p className={styles.notice}>This account has not been granted administrator access.</p> : null}
    <LoginForm />
  </section></main>;
}
