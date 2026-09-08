"use client";

import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { deleteArticle, saveArticle } from "@/app/admin/actions";
import styles from "@/app/admin/admin.module.css";
import { RichEditor } from "./RichEditor";
import { SmartSelect } from "./SmartSelect";

type Choice = { id: string; name: string };
type RecordValue = Record<string, unknown>;
type StoryType = "new" | "archive";
const value = (article: RecordValue | null, key: string) => String(article?.[key] ?? "");

export function ArticleWorkspaceForm({ article, authors, categories, error }: { article: RecordValue | null; authors: Choice[]; categories: Choice[]; error?: string }) {
  const published = value(article, "published_at").slice(0, 16) || new Date().toISOString().slice(0, 16);
  const [publicationChanged, setPublicationChanged] = useState(false);
  const [storyType, setStoryType] = useState<StoryType>(article?.is_archived ? "archive" : "new");
  const [showImageDetails, setShowImageDetails] = useState(Boolean(value(article, "image_alt") || value(article, "image_caption")));
  const [previewUrl, setPreviewUrl] = useState(value(article, "image_url"));

  useEffect(() => () => { if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  return <>
    {error ? <p className={styles.notice}>{error}</p> : null}
    <form className={styles.form} action={saveArticle}>
      {article?.id ? <input type="hidden" name="id" value={String(article.id)} /> : null}
      <input type="hidden" name="existing_image" value={value(article, "image_url")} />
      <input type="hidden" name="story_type" value={storyType} />
      <input type="hidden" name="publication_changed" value={article?.id || publicationChanged ? "true" : "false"} />
      <div className={styles.storyTabs} role="tablist" aria-label="Choose article type">
        <button type="button" role="tab" aria-selected={storyType === "new"} className={storyType === "new" ? styles.storyTabActive : ""} onClick={() => setStoryType("new")}>New story</button>
        <button type="button" role="tab" aria-selected={storyType === "archive"} className={storyType === "archive" ? styles.storyTabActive : ""} onClick={() => setStoryType("archive")}>Past story / archive</button>
      </div>
      <p className={styles.fieldHint}>{storyType === "new" ? "Use this for new writing. It will be published as a current story." : "Use this for writing originally published elsewhere. Source fields will be saved with the article."}</p>
      <div className={styles.field}><label htmlFor="title">Title</label><input id="title" name="title" defaultValue={value(article, "title")} required /></div>
      <div className={styles.field}><label htmlFor="slug">URL slug</label><input id="slug" name="slug" defaultValue={value(article, "slug")} placeholder="Generated from the title if empty" /></div>
      <div className={styles.field}><label htmlFor="excerpt">Short description</label><textarea className={styles.descriptionInput} id="excerpt" name="excerpt" defaultValue={value(article, "excerpt")} /></div>
      <div className={styles.field}><label>Story editor</label><RichEditor name="content" initialContent={value(article, "content")} /></div>
      <div className={styles.columns}><div className={styles.field}><label>Author</label><SmartSelect name="author_id" options={authors} defaultValue={value(article, "author_id")} /></div><div className={styles.field}><label>Category</label><SmartSelect name="category_id" options={categories} defaultValue={value(article, "category_id")} /></div></div>
      <div className={styles.columns}><div className={styles.field}><label>Status</label><SmartSelect name="status" options={[{ id: "draft", name: "Draft" }, { id: "published", name: "Published" }]} defaultValue={value(article, "status") || "draft"} /></div><div className={styles.field}><label>Publication date and time</label><div className={styles.dateTimeFields}><input aria-label="Publication date" name="publication_date" type="date" defaultValue={published.slice(0, 10)} onChange={() => setPublicationChanged(true)} /><input aria-label="Publication time" name="publication_time" type="time" defaultValue={published.slice(11, 16)} onChange={() => setPublicationChanged(true)} /></div><small className={styles.dateHelp}>New stories use the exact time you save unless you change these fields.</small></div></div>
      <section className={styles.imageWorkspace} aria-label="Article image">
        <div className={styles.imageWorkspaceHeading}><div><label htmlFor="image">Main image</label><p>Optional. A preview appears here before you save.</p></div><button type="button" className={styles.secondaryButton} onClick={() => setShowImageDetails((current) => !current)}>{showImageDetails ? "Hide caption details" : "Set caption"}</button></div>
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={chooseImage} />
        {previewUrl ? <div className={styles.imagePreview}><img src={previewUrl} alt="Selected article preview" /></div> : null}
        {showImageDetails ? <div className={styles.columns}><div className={styles.field}><label htmlFor="image_alt">Image description</label><input id="image_alt" name="image_alt" defaultValue={value(article, "image_alt")} /></div><div className={styles.field}><label htmlFor="image_caption">Image caption</label><input id="image_caption" name="image_caption" defaultValue={value(article, "image_caption")} /></div></div> : null}
      </section>
      {storyType === "archive" ? <div className={styles.columns}><div className={styles.field}><label htmlFor="original_publication">Originally published by</label><input id="original_publication" name="original_publication" defaultValue={value(article, "original_publication")} /></div><div className={styles.field}><label htmlFor="original_url">Original article URL</label><input id="original_url" name="original_url" type="url" defaultValue={value(article, "original_url")} /></div></div> : null}
      <div className={styles.checks}><label><input type="checkbox" name="is_featured" defaultChecked={Boolean(article?.is_featured)} /> Feature on homepage</label></div>
      <p className={styles.fieldHint}>{storyType === "archive" ? "Archive stories are shown in the archive automatically. Feature this story to allow it on the homepage." : "Feature this story to allow it on the homepage."}</p>
      <div className={styles.actions}><button className={styles.primary}>Save article</button><Link href="/admin/articles">Cancel</Link></div>
    </form>
    {article?.id ? <form action={deleteArticle} className={styles.actions}><input type="hidden" name="id" value={String(article.id)} /><button className={styles.danger}>Delete article</button></form> : null}
  </>;
}
