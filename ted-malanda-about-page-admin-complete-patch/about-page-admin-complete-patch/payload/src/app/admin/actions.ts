"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const optional = (value: string) => value || null;
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function saveArticle(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const title = text(form, "title");
  const slug = slugify(text(form, "slug") || title);
  if (!title || !slug) redirect(`/admin/articles${id ? `/${id}` : "/new"}?error=Title+is+required`);

  let imageUrl = text(form, "existing_image");
  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${slug}/${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("article-images").upload(path, image, { upsert: false, contentType: image.type });
    if (error) redirect(`/admin/articles${id ? `/${id}` : "/new"}?error=${encodeURIComponent(error.message)}`);
    imageUrl = supabase.storage.from("article-images").getPublicUrl(path).data.publicUrl;
  }

  const publicationDate = text(form, "publication_date");
  const publicationTime = text(form, "publication_time");
  const publicationChanged = text(form, "publication_changed") === "true";
  const selectedPublication = publicationDate && publicationTime ? new Date(`${publicationDate}T${publicationTime}`) : null;
  const hasSelectedPublication = Boolean(selectedPublication && !Number.isNaN(selectedPublication.getTime()));
  const status = text(form, "status") === "published" ? "published" : "draft";
  const payload = {
    title, slug, excerpt: optional(text(form, "excerpt")), content: text(form, "content"), status,
    published_at: status === "published"
      ? (publicationChanged && hasSelectedPublication ? selectedPublication!.toISOString() : new Date().toISOString())
      : (publicationChanged && hasSelectedPublication ? selectedPublication!.toISOString() : null),
    author_id: optional(text(form, "author_id")), category_id: optional(text(form, "category_id")),
    image_url: optional(imageUrl), image_alt: optional(text(form, "image_alt")), image_caption: optional(text(form, "image_caption")),
    original_publication: optional(text(form, "original_publication")), original_url: optional(text(form, "original_url")),
    is_archived: text(form, "story_type") === "archive", is_featured: form.get("is_featured") === "on", updated_at: new Date().toISOString(),
  };
  const result = id ? await supabase.from("articles").update(payload).eq("id", id) : await supabase.from("articles").insert(payload);
  if (result.error) redirect(`/admin/articles${id ? `/${id}` : "/new"}?error=${encodeURIComponent(result.error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin/articles?saved=1");
}

export async function deleteArticle(form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("articles").delete().eq("id", text(form, "id"));
  revalidatePath("/", "layout");
  redirect("/admin/articles?deleted=1");
}

export async function saveCategory(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const name = text(form, "name");
  if (name) {
    const payload = { name, slug: slugify(name), description: optional(text(form, "description")) };
    if (id) await supabase.from("categories").update(payload).eq("id", id);
    else await supabase.from("categories").insert(payload);
  }
  revalidatePath("/", "layout");
  redirect("/admin/categories?saved=1");
}

export async function saveAuthor(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = text(form, "id");
  const name = text(form, "name");
  if (name) {
    const payload = { name, slug: slugify(name), bio: optional(text(form, "bio")) };
    if (id) await supabase.from("authors").update(payload).eq("id", id);
    else await supabase.from("authors").insert({ ...payload, is_default: false });
  }
  revalidatePath("/", "layout");
  redirect("/admin/authors?saved=1");
}

export async function saveAbout(form: FormData) {
  const { supabase } = await requireAdmin();
  let imageUrl = text(form, "existing_image") || "/images/ted-malanda.png";
  const image = form.get("image");
  if (image instanceof File && image.size > 0) {
    const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `about/ted-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("article-images").upload(path, image, { contentType: image.type });
    if (!error) imageUrl = supabase.storage.from("article-images").getPublicUrl(path).data.publicUrl;
  }
  await supabase.from("site_settings").upsert({ key: "about", value: {
    heading: text(form,"heading"), intro: text(form,"intro"), hero_secondary: text(form,"hero_secondary"),
    highlight_one: text(form,"highlight_one"), highlight_two: text(form,"highlight_two"), highlight_three: text(form,"highlight_three"),
    body: text(form,"body"), secondary: text(form,"secondary"), more_note: text(form,"more_note"),
    closing_heading: text(form,"closing_heading"), closing_body: text(form,"closing_body"), closing_note: text(form,"closing_note"),
    image_url: imageUrl, image_alt: text(form,"image_alt") || "Portrait of Ted Malanda", image_caption: text(form,"image_caption"),
  }, updated_at: new Date().toISOString() });
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

export async function saveAppearance(form: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from("site_settings").upsert({ key: "appearance", value: { heading_font: text(form,"heading_font"), reading_font: text(form,"reading_font") }, updated_at: new Date().toISOString() });
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveUncleTed(form: FormData) {
  const { supabase } = await requireAdmin();
  const id=text(form,"id"), title=text(form,"title"), slug=slugify(text(form,"slug")||title);
  if(!title||!slug) redirect(`/admin/ted-talk${id?`/${id}`:"/new"}?error=Title+is+required`);
  const status=text(form,"status")==="published"?"published":"draft"; const date=text(form,"published_at");
  const payload={title,slug,teaser:optional(text(form,"teaser")),letter:text(form,"letter"),correspondent_name:optional(text(form,"correspondent_name")),response:text(form,"response"),status,published_at:status==="published"?(date?new Date(date).toISOString():new Date().toISOString()):optional(date?new Date(date).toISOString():""),original_url:optional(text(form,"original_url")),updated_at:new Date().toISOString()};
  const result=id?await supabase.from("uncle_ted_columns").update(payload).eq("id",id):await supabase.from("uncle_ted_columns").insert(payload);
  if(result.error)redirect(`/admin/ted-talk${id?`/${id}`:"/new"}?error=${encodeURIComponent(result.error.message)}`);
  revalidatePath("/ted-talk","layout"); redirect("/admin/ted-talk?saved=1");
}

export async function deleteUncleTed(form: FormData){const{supabase}=await requireAdmin();await supabase.from("uncle_ted_columns").delete().eq("id",text(form,"id"));revalidatePath("/ted-talk","layout");redirect("/admin/ted-talk?deleted=1");}
