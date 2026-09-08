"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
const links = [
  ["/admin", "Overview"],
  ["/admin/articles", "Articles"],
  ["/admin/ted-talk", "Ted Talk"],
  ["/admin/categories", "Categories"],
  ["/admin/authors", "Authors"],
  ["/admin/about", "About page"],
  ["/admin/settings", "Appearance"],
];
export function AdminNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function signOut() {
    await getSupabaseBrowser()?.auth.signOut();
    setOpen(false);
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <div className={styles.navContainer}>
      <button
        className={styles.menuButton}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
        aria-expanded={open}
        aria-controls="admin-navigation"
      >
        <Menu size={20} />
      </button>
      {open ? (
        <button
          className={styles.scrim}
          onClick={() => setOpen(false)}
          aria-label="Close admin menu"
        />
      ) : null}
      <nav
        id="admin-navigation"
        className={`${styles.nav} ${open ? styles.navOpen : ""}`}
        aria-label="Admin navigation"
      >
        <div className={styles.navTitle}>
          <span>Publishing</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
          >
            <X size={19} />
          </button>
        </div>
        {links.map(([href, label]) => (
          <Link
            onClick={() => setOpen(false)}
            className={pathname === href ? styles.navActive : ""}
            href={href}
            key={href}
          >
            {label}
          </Link>
        ))}
        <div className={styles.mobileAccountActions}>
          <Link onClick={() => setOpen(false)} className={pathname === "/admin/profile" ? styles.navActive : ""} href="/admin/profile">Profile</Link>
          <button type="button" onClick={signOut}>Sign out</button>
        </div>
      </nav>
    </div>
  );
}
