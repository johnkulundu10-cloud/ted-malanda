import { saveAbout } from "../../actions";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

const defaults: Record<string, string> = {
  heading: "Writer. Editor. Observer of Kenyan life.",
  intro: "Ted Malanda is a Kenyan writer, columnist and veteran editor known for finding humour, contradiction and insight in everyday life.",
  hero_secondary: "His writing ranges across public affairs, politics, family, culture, travel and the curious business of being Kenyan.",
  highlight_one: "Veteran Kenyan writer and editor",
  highlight_two: "Founding editor of The Nairobian",
  highlight_three: "Stories, satire and public commentary",
  body: "Across a long career in Kenyan journalism, Ted has written about the institutions that shape public life and the ordinary encounters that reveal who we are.",
  secondary: "He has worked as a writer and editor, including serving as the founding editor of The Nairobian.",
  more_note: "This is intended to be a quiet home for the writing itself: a place where readers can discover an old column, follow a new observation or simply spend time with a well-told Kenyan story.",
  closing_heading: "Old stories, new observations.",
  closing_body: "The collection will continue to grow as earlier columns are prepared for the archive and new work is published.",
  closing_note: "",
  image_url: "/images/ted-malanda.png",
  image_alt: "Portrait of Ted Malanda",
  image_caption: "Ted Malanda",
};

export default async function AdminAboutPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase } = await requireAdmin();
  const [{ data }, query] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "about").maybeSingle(),
    searchParams,
  ]);
  const v = { ...defaults, ...((data?.value ?? {}) as Record<string, string>) };
  const textareaFields = [
    ["intro", "Introduction"], ["hero_secondary", "Second introduction paragraph"],
    ["body", "Career and story"], ["secondary", "Second paragraph"],
    ["more_note", "Career section closing note"], ["closing_body", "Closing paragraph"],
    ["closing_note", "Optional closing note"],
  ];

  return <>
    <div className={styles.heading}><div><h1>About page</h1><p>Everything shown on the public About page is managed here.</p></div></div>
    {query.saved ? <p className={styles.notice}>About page updated.</p> : null}
    <form className={styles.form} action={saveAbout}>
      <input type="hidden" name="existing_image" value={v.image_url} />
      <div className={styles.field}><label htmlFor="heading">Main heading</label><input id="heading" name="heading" defaultValue={v.heading} /></div>
      {textareaFields.slice(0, 2).map(([name, label]) => <div className={styles.field} key={name}><label htmlFor={name}>{label}</label><textarea className={styles.aboutTextarea} id={name} name={name} defaultValue={v[name]} /></div>)}
      <section className={styles.aboutImageSection}>
        <div><p className={styles.groupLabel}>Portrait</p><p className={styles.fieldHint}>This image appears beside the opening introduction.</p></div>
        <div className={styles.aboutImagePreview}><img src={v.image_url} alt="Current portrait" /></div>
        <div className={styles.field}><label htmlFor="image">Replace portrait</label><input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" /></div>
        <div className={styles.columns}>
          <div className={styles.field}><label htmlFor="image_alt">Image description</label><input id="image_alt" name="image_alt" defaultValue={v.image_alt} /></div>
          <div className={styles.field}><label htmlFor="image_caption">Image caption</label><input id="image_caption" name="image_caption" defaultValue={v.image_caption} /></div>
        </div>
      </section>
      <section className={styles.aboutTextSection}>
        <p className={styles.groupLabel}>Highlights</p>
        {[['highlight_one', 'First highlight'], ['highlight_two', 'Second highlight'], ['highlight_three', 'Third highlight']].map(([name, label]) => <div className={styles.field} key={name}><label htmlFor={name}>{label}</label><input id={name} name={name} defaultValue={v[name]} /></div>)}
      </section>
      {textareaFields.slice(2, 5).map(([name, label]) => <div className={styles.field} key={name}><label htmlFor={name}>{label}</label><textarea className={styles.aboutTextarea} id={name} name={name} defaultValue={v[name]} /></div>)}
      <div className={styles.field}><label htmlFor="closing_heading">Closing heading</label><input id="closing_heading" name="closing_heading" defaultValue={v.closing_heading} /></div>
      {textareaFields.slice(5).map(([name, label]) => <div className={styles.field} key={name}><label htmlFor={name}>{label}</label><textarea className={styles.aboutTextarea} id={name} name={name} defaultValue={v[name]} /></div>)}
      <button className={styles.primary}>Save About page</button>
    </form>
  </>;
}
