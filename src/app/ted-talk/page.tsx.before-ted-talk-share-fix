import Link from "next/link";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { getUncleTedColumns } from "@/lib/uncle-ted";
import styles from "./ted-talk.module.css";

export const metadata={title:"Ted Talk",description:"Reader dilemmas meet Uncle Ted’s brutally honest, witty advice.",openGraph:{title:"Ted Talk with Uncle Ted",description:"Reader dilemmas meet Uncle Ted’s brutally honest, witty advice.",images:[{url:"/images/social/ted-talk-default.png",width:1200,height:630,alt:"Ted Talk with Uncle Ted editorial illustration"}]},twitter:{card:"summary_large_image",images:["/images/social/ted-talk-default.png"]}};

export default async function Page() {
  const columns=await getUncleTedColumns();
  return <><SiteHeader/><main className={styles.main}><header><p>WITH UNCLE TED</p><h1>Ted Talk</h1><span>Readers bring the trouble. Uncle Ted supplies the brutally honest answer.</span></header><section className={styles.grid}>{columns.map((column)=><article key={column.id}><p>{column.date}</p><h2><Link href={`/ted-talk/${column.slug}`}>{column.title}</Link></h2><div>{column.teaser||column.letter.replace(/<[^>]+>/g," ").slice(0,180)}</div><Link className={styles.read} href={`/ted-talk/${column.slug}`}>Read Ted Talk →</Link></article>)}</section>{!columns.length?<p>No Ted Talk columns have been published yet.</p>:null}</main><SiteFooter/></>;
}
