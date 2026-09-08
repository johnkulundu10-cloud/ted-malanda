import { Tag } from "lucide-react";
import { saveCategory } from "../../actions";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

export default async function CategoriesPage({searchParams}:{searchParams:Promise<{saved?:string}>}) {
  const {supabase}=await requireAdmin();
  const [{data},query]=await Promise.all([supabase.from("categories").select("id,name,description").order("name"),searchParams]);
  return <><div className={styles.heading}><div><h1>Categories</h1><p>Subjects readers can use to browse the writing.</p></div></div>
    {query.saved?<p className={styles.notice}>Category saved. It will now appear across the reader site.</p>:null}
    <section className={styles.managementPanel}><div><h2>Add a category</h2><p>Keep names short and descriptions useful to readers.</p></div><form className={styles.compactEntityForm} action={saveCategory}><div className={styles.field}><label htmlFor="name">Category name</label><input id="name" name="name" required/></div><div className={styles.field}><label htmlFor="description">Short description</label><input id="description" name="description"/></div><button className={styles.primary}>Add category</button></form></section>
    <div className={styles.entityHeading}><h2>Existing categories</h2><span>{data?.length??0} total</span></div>
    <section className={styles.entityGrid}>{data?.map((item)=><article className={styles.entityCard} key={item.id}><div className={styles.entityIcon}><Tag size={18}/></div><div><h3>{item.name}</h3><p>{item.description||"No description added yet."}</p><details className={styles.entityEdit}><summary>Edit category</summary><form className={styles.inlineEntityForm} action={saveCategory}><input type="hidden" name="id" value={item.id}/><div className={styles.field}><label>Category name</label><input name="name" defaultValue={item.name} required/></div><div className={styles.field}><label>Short description</label><input name="description" defaultValue={item.description??""}/></div><button className={styles.primary}>Save changes</button></form></details></div></article>)}</section>
  </>;
}
