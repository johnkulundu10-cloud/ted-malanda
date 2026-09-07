import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { UncleTedForm } from "@/components/admin/UncleTedForm";
import styles from "@/app/admin/admin.module.css";

export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}) {
  const {supabase}=await requireAdmin();
  const [{id},query]=await Promise.all([params,searchParams]);
  const {data}=await supabase.from("uncle_ted_columns").select("*").eq("id",id).single();
  if(!data)notFound();
  return <><div className={styles.heading}><div><h1>Edit Ted Talk column</h1><p>Update the letter, Uncle Ted reply and publication details.</p></div></div><UncleTedForm column={data} error={query.error}/></>;
}
