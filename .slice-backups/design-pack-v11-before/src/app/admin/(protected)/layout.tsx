import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "../actions";
import styles from "../admin.module.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return <div className={styles.shell}>
    <header className={styles.topbar}><Link className={styles.brand} href="/admin">TED MALANDA · ADMIN</Link><div className={styles.account}><span>{user.email}</span><Link href="/">View website</Link><form action={signOut}><button>Sign out</button></form></div></header>
    <div className={styles.layout}><nav className={styles.nav} aria-label="Admin navigation"><Link href="/admin">Overview</Link><Link href="/admin/articles">Articles</Link><Link href="/admin/categories">Categories</Link><Link href="/admin/authors">Authors</Link><Link href="/admin/about">About page</Link><Link href="/admin/settings">Appearance</Link></nav><main className={styles.main}>{children}</main></div>
  </div>;
}
