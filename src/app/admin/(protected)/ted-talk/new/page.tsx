import { UncleTedForm } from "@/components/admin/UncleTedForm";
import styles from "@/app/admin/admin.module.css";

export default async function Page({searchParams}:{searchParams:Promise<{error?:string}>}) {
  const query=await searchParams;
  return <><div className={styles.heading}><div><h1>New Ted Talk column</h1><p>Add the reader’s letter and Uncle Ted’s response separately.</p></div></div><UncleTedForm column={null} error={query.error}/></>;
}
