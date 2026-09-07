"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "@/app/admin/admin.module.css";
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
      </nav>
    </div>
  );
}
