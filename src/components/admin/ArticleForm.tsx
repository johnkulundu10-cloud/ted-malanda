import Link from "next/link";
import { deleteArticle, saveArticle } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.css";
import { RichEditor } from "./RichEditor";
import { SmartSelect } from "./SmartSelect";

type Choice = { id: string; name: string };
type RecordValue = Record<string, unknown>;
const value = (article: RecordValue | null, key: string) => String(article?.[key] ?? "");

export function ArticleForm({ article, authors, categories, error }: { article: RecordValue | null; authors: Choice[]; categories: Choice[]; error?: string }) {
  const published = value(article,"published_at").slice(0,16);
  return <>
    {error ? <p className={styles.notice}>{error}</p> : null}
    <form className={styles.form} action={saveArticle}>
      {article?.id ? <input type="hidden" name="id" value={String(article.id)} /> : null}
      <input type="hidden" name="existing_image" value={value(article,"image_url")} />
      <div className={styles.field}><label htmlFor="title">Title</label><input id="title" name="title" defaultValue={value(article,"title")} required /></div>
      <div className={styles.field}><label htmlFor="slug">URL slug</label><input id="slug" name="slug" defaultValue={value(article,"slug")} placeholder="Generated from the title if empty" /></div>
      <div className={styles.field}><label htmlFor="excerpt">Short description</label><textarea id="excerpt" name="excerpt" defaultValue={value(article,"excerpt")} /></div>
      <div className={styles.field}><label>Story editor</label><RichEditor name="content" initialContent={value(article,"content")} /></div>
      <div className={styles.columns}><div className={styles.field}><label>Author</label><SmartSelect name="author_id" options={authors} defaultValue={value(article,"author_id")}/></div><div className={styles.field}><label>Category</label><SmartSelect name="category_id" options={categories} defaultValue={value(article,"category_id")}/></div></div>
      <div className={styles.columns}><div className={styles.field}><label>Status</label><SmartSelect name="status" options={[{id:"draft",name:"Draft"},{id:"published",name:"Published"}]} defaultValue={value(article,"status") || "draft"}/></div><div className={styles.field}><label htmlFor="published_at">Publication date</label><input id="published_at" name="published_at" type="datetime-local" defaultValue={published} /></div></div>
      <div className={styles.field}><label htmlFor="image">Main image (optional)</label><input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" /></div>
      <div className={styles.columns}><div className={styles.field}><label htmlFor="image_alt">Image description</label><input id="image_alt" name="image_alt" defaultValue={value(article,"image_alt")} /></div><div className={styles.field}><label htmlFor="image_caption">Image caption</label><input id="image_caption" name="image_caption" defaultValue={value(article,"image_caption")} /></div></div>
      <div className={styles.columns}><div className={styles.field}><label htmlFor="original_publication">Originally published by</label><input id="original_publication" name="original_publication" defaultValue={value(article,"original_publication")} /></div><div className={styles.field}><label htmlFor="original_url">Original article URL</label><input id="original_url" name="original_url" type="url" defaultValue={value(article,"original_url")} /></div></div>
      <div className={styles.checks}><label><input type="checkbox" name="is_archived" defaultChecked={Boolean(article?.is_archived)} /> Archive article</label><label><input type="checkbox" name="is_featured" defaultChecked={Boolean(article?.is_featured)} /> Feature on homepage</label></div>
      <p className={styles.fieldHint}>To control the “From the archive” homepage card, select both Archive article and Feature on homepage. The newest matching article is used, excluding the latest story.</p>
      <div className={styles.actions}><button className={styles.primary}>Save article</button><Link href="/admin/articles">Cancel</Link></div>
    </form>
    {article?.id ? <form action={deleteArticle} className={styles.actions}><input type="hidden" name="id" value={String(article.id)} /><button className={styles.danger}>Delete article</button></form> : null}
  </>;
}
