import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import styles from "./page.module.css";

export const metadata = { title: "Privacy" };
export default function PrivacyPage(){return <><SiteHeader/><main className={styles.main}><p>INFORMATION</p><h1>Privacy</h1><section><p>This website is designed to collect as little personal information as practical.</p><h2>Article engagement</h2><p>To prevent repeated reactions and excessive view counting, the site may store a randomly generated visitor identifier and article preferences in your browser. This identifier is not intended to reveal your identity.</p><h2>Images and hosting</h2><p>Development images may be delivered by external image services. The production site may also use hosting and database providers that process basic technical information required to deliver and secure the website.</p><h2>Contact and updates</h2><p>This notice will be updated before the public launch when the final analytics, hosting and contact arrangements are confirmed.</p></section></main><SiteFooter/></>}
