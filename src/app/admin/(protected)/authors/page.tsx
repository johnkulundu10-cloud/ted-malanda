import { UserRound } from "lucide-react";
import { saveAuthor } from "../../actions";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

export default async function AuthorsPage() {
  const {supabase}=await requireAdmin();
  const {data}=await supabase.from("authors").select("id,name,bio,is_default").order("is_default",{ascending:false});
  return <><div className={styles.heading}><div><h1>Authors</h1><p>Manage Ted’s profile and occasional guest writers.</p></div></div>
    <section className={styles.managementPanel}><div><h2>Add an author</h2><p>Create a compact profile for bylines and author pages.</p></div><form className={styles.compactEntityForm} action={saveAuthor}><div className={styles.field}><label htmlFor="name">Author name</label><input id="name" name="name" required/></div><div className={styles.field}><label htmlFor="bio">Short biography</label><input id="bio" name="bio"/></div><button className={styles.primary}>Add author</button></form></section>
    <div className={styles.entityHeading}><h2>Writers</h2><span>{data?.length??0} total</span></div>
    <section className={styles.entityGrid}>{data?.map((item)=><article className={styles.entityCard} key={item.id}><div className={styles.entityIcon}><UserRound size={18}/></div><div><div className={styles.entityTitle}><h3>{item.name}</h3>{item.is_default?<span className={styles.badge}>Default</span>:null}</div><p>{item.bio||"No biography added yet."}</p></div></article>)}</section>
  </>;
}
