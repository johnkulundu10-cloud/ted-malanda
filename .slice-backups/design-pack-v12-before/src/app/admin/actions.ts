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

  const publishedInput = text(form, "published_at");
  const status = text(form, "status") === "published" ? "published" : "draft";
  const payload = {
    title, slug, excerpt: optional(text(form, "excerpt")), content: text(form, "content"), status,
    published_at: status === "published" ? (publishedInput ? new Date(publishedInput).toISOString() : new Date().toISOString()) : optional(publishedInput ? new Date(publishedInput).toISOString() : ""),
    author_id: optional(text(form, "author_id")), category_id: optional(text(form, "category_id")),
    image_url: optional(imageUrl), image_alt: optional(text(form, "image_alt")), image_caption: optional(text(form, "image_caption")),
    original_publication: optional(text(form, "original_publication")), original_url: optional(text(form, "original_url")),
    is_archived: form.get("is_archived") === "on", is_featured: form.get("is_featured") === "on", updated_at: new Date().toISOString(),
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
  const name = text(form, "name");
  if (name) await supabase.from("categories").insert({ name, slug: slugify(name), description: optional(text(form, "description")) });
  revalidatePath("/admin/categories");
}

export async function saveAuthor(form: FormData) {
  const { supabase } = await requireAdmin();
  const name = text(form, "name");
  if (name) await supabase.from("authors").insert({ name, slug: slugify(name), bio: optional(text(form, "bio")), is_default: false });
  revalidatePath("/admin/authors");
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
  await supabase.from("site_settings").upsert({ key: "about", value: { heading: text(form,"heading"), intro: text(form,"intro"), body: text(form,"body"), secondary: text(form,"secondary"), closing_heading: text(form,"closing_heading"), closing_body: text(form,"closing_body"), image_url: imageUrl }, updated_at: new Date().toISOString() });
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
