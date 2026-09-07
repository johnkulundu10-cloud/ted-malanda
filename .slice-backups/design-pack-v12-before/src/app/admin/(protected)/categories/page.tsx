import { saveCategory } from "../../actions";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin(); const { data } = await supabase.from("categories").select("id,name,description").order("name");
  return <><div className={styles.heading}><div><h1>Categories</h1><p>Subjects readers can use to browse the writing.</p></div></div><form className={styles.form} action={saveCategory}><div className={styles.columns}><div className={styles.field}><label htmlFor="name">Category name</label><input id="name" name="name" required /></div><div className={styles.field}><label htmlFor="description">Short description</label><input id="description" name="description" /></div></div><button className={styles.primary}>Add category</button></form><br/><section className={styles.table}>{data?.map(item=><div className={styles.row} key={item.id}><strong>{item.name}</strong><small>{item.description || "No description"}</small><span/></div>)}</section></>;
}
