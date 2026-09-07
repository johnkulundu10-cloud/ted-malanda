import { saveAppearance } from "../../actions";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

export default async function SettingsPage({ searchParams }: { searchParams:Promise<{saved?:string}> }) {
  const { supabase } = await requireAdmin(); const [{ data }, query] = await Promise.all([supabase.from("site_settings").select("value").eq("key","appearance").maybeSingle(),searchParams]);
  const value = (data?.value ?? {}) as Record<string,string>;
  return <><div className={styles.heading}><div><h1>Appearance</h1><p>Choose from dependable fonts already supported by the website.</p></div></div>{query.saved ? <p className={styles.notice}>Font choices updated.</p> : null}<form className={styles.form} action={saveAppearance}><div className={styles.columns}><div className={styles.field}><label htmlFor="heading_font">Titles and menus</label><select id="heading_font" name="heading_font" defaultValue={value.heading_font ?? "Figtree"}><option>Figtree</option><option>Arial</option><option>Georgia</option></select></div><div className={styles.field}><label htmlFor="reading_font">Article text</label><select id="reading_font" name="reading_font" defaultValue={value.reading_font ?? "Source Serif 4"}><option>Source Serif 4</option><option>Georgia</option><option>Arial</option></select></div></div><button className={styles.primary}>Save appearance</button></form></>;
}
