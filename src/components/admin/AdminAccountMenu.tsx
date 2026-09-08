import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.css";

export function AdminAccountMenu({ email }: { email: string }) {
  return <details className={styles.accountMenu}>
    <summary aria-label="Open account menu">
      <span>{email}</span>
      <ChevronDown size={15} aria-hidden="true" />
    </summary>
    <div className={styles.accountMenuPanel}>
      <p>{email}</p>
      <Link href="/admin/profile">Profile &amp; password</Link>
      <form action={signOut}><button type="submit">Sign out</button></form>
    </div>
  </details>;
}
