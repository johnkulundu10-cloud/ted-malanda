import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/AdminNav";
import styles from "../admin.module.css";
import { AdminAccountMenu } from "@/components/admin/AdminAccountMenu";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();

  return <div className={styles.shell}>
    <header className={styles.topbar}>
      <div className={styles.topbarBrand}>
        <Link className={styles.brand} href="/admin">TED MALANDA · ADMIN</Link>
        <AdminNav />
      </div>
      <div className={styles.account}>
        <Link className={styles.websiteLink} href="/">View website</Link>
        <AdminAccountMenu email={user.email ?? "Admin account"} />
      </div>
    </header>
    <div className={styles.layout}><main className={styles.main}>{children}</main></div>
  </div>;
}
