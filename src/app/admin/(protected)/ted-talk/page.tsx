import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import styles from "@/app/admin/admin.module.css";

export default async function Page({searchParams}:{searchParams:Promise<{saved?:string;deleted?:string}>}) {
  const {supabase}=await requireAdmin();
  const [query,{data}]=await Promise.all([searchParams,supabase.from("uncle_ted_columns").select("id,title,teaser,status,published_at").order("updated_at",{ascending:false})]);
  return <><div className={styles.heading}><div><h1>Ted Talk</h1><p>Manage reader letters and Uncle Ted’s replies.</p></div><Link className={styles.primary} href="/admin/ted-talk/new">New column</Link></div>{query.saved?<p className={styles.notice}>Column saved.</p>:null}{query.deleted?<p className={styles.notice}>Column deleted.</p>:null}<section className={styles.table}>{data?.length?data.map((column)=><Link className={styles.row} href={`/admin/ted-talk/${column.id}`} key={column.id}><div><strong>{column.title}</strong><small>{column.teaser||"No description added yet."}</small></div><span className={styles.badge}>{column.status}</span><small>{column.published_at?new Date(column.published_at).toLocaleDateString("en-GB"):"Not scheduled"}</small></Link>):<p className={styles.empty}>No Ted Talk columns yet.</p>}</section></>;
}
