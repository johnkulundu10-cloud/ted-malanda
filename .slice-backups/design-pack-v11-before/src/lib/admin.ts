import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function requireAdmin() {
  const supabase = await getSupabaseServer();
  if (!supabase) redirect("/admin/login?error=setup");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin/login?error=permission");
  return { supabase, user };
}
