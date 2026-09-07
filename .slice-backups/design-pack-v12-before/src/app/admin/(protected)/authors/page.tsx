import { saveAuthor } from "../../actions";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

export default async function AuthorsPage() {
  const { supabase } = await requireAdmin(); const { data } = await supabase.from("authors").select("id,name,bio,is_default").order("is_default",{ascending:false});
  return <><div className={styles.heading}><div><h1>Authors</h1><p>Ted remains the default; guest writers can be added here.</p></div></div><form className={styles.form} action={saveAuthor}><div className={styles.columns}><div className={styles.field}><label htmlFor="name">Author name</label><input id="name" name="name" required /></div><div className={styles.field}><label htmlFor="bio">Short biography</label><input id="bio" name="bio" /></div></div><button className={styles.primary}>Add author</button></form><br/><section className={styles.table}>{data?.map(item=><div className={styles.row} key={item.id}><strong>{item.name}</strong>{item.is_default ? <span className={styles.badge}>Default</span> : <span/>}<small>{item.bio || "No biography"}</small></div>)}</section></>;
}
