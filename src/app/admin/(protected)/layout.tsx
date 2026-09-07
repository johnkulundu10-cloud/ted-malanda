import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "../actions";
import styles from "../admin.module.css";
export default async function AdminLayout({children}:{children:React.ReactNode}){const{user}=await requireAdmin();return <div className={styles.shell}><header className={styles.topbar}><div className={styles.topbarBrand}><Link className={styles.brand} href="/admin">TED MALANDA · ADMIN</Link><AdminNav/></div><div className={styles.account}><span>{user.email}</span><Link href="/">View website</Link><form action={signOut}><button>Sign out</button></form></div></header><div className={styles.layout}><main className={styles.main}>{children}</main></div></div>}
