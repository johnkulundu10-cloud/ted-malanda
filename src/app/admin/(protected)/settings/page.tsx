import { AppearanceEditor } from "@/components/admin/AppearanceEditor";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

export default async function SettingsPage({searchParams}:{searchParams:Promise<{saved?:string}>}) {
  const {supabase}=await requireAdmin();
  const [{data},query]=await Promise.all([supabase.from("site_settings").select("value").eq("key","appearance").maybeSingle(),searchParams]);
  const value=(data?.value??{}) as Record<string,string>;
  return <><div className={styles.heading}><div><h1>Appearance</h1><p>Shape the reading experience and preview each choice before saving.</p></div></div>{query.saved?<p className={styles.notice}>Font choices updated.</p>:null}<AppearanceEditor headingDefault={value.heading_font??"Figtree"} readingDefault={value.reading_font??"Source Serif 4"}/></>;
}
