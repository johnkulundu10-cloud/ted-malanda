import Link from "next/link";
import { deleteUncleTed, saveUncleTed } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.css";
import { RichEditor } from "./RichEditor";
import { SmartSelect } from "./SmartSelect";

type Row=Record<string,unknown>;
const value=(row:Row|null,key:string)=>String(row?.[key]??"");

export function UncleTedForm({column,error}:{column:Row|null;error?:string}) {
  return <>
    {error?<p className={styles.notice}>{error}</p>:null}
    <form className={styles.form} action={saveUncleTed}>
      {column?.id?<input type="hidden" name="id" value={String(column.id)}/>:null}
      <div className={styles.field}><label>Title</label><input name="title" defaultValue={value(column,"title")} required/></div>
      <div className={styles.field}><label>URL slug</label><input name="slug" defaultValue={value(column,"slug")} placeholder="Generated from title if empty"/></div>
      <div className={styles.field}><label>One-line description</label><textarea name="teaser" defaultValue={value(column,"teaser")} placeholder="A short summary for listings and the homepage"/></div>
      <div className={styles.field}><label>Reader’s name</label><input name="correspondent_name" defaultValue={value(column,"correspondent_name")} placeholder="Anonymous"/></div>
      <div className={styles.field}><label>Reader’s letter</label><RichEditor name="letter" initialContent={value(column,"letter")}/></div>
      <div className={styles.field}><label>Uncle Ted’s response</label><RichEditor name="response" initialContent={value(column,"response")}/></div>
      <div className={styles.columns}><div className={styles.field}><label>Status</label><SmartSelect name="status" options={[{id:"draft",name:"Draft"},{id:"published",name:"Published"}]} defaultValue={value(column,"status")||"draft"}/></div><div className={styles.field}><label>Publication date</label><input name="published_at" type="datetime-local" defaultValue={value(column,"published_at").slice(0,16)}/></div></div>
      <div className={styles.field}><label>Original URL</label><input name="original_url" type="url" defaultValue={value(column,"original_url")}/></div>
      <div className={styles.actions}><button className={styles.primary}>Save column</button><Link href="/admin/ted-talk">Cancel</Link></div>
    </form>
    {column?.id?<form action={deleteUncleTed} className={styles.actions}><input type="hidden" name="id" value={String(column.id)}/><button className={styles.danger}>Delete column</button></form>:null}
  </>;
}
