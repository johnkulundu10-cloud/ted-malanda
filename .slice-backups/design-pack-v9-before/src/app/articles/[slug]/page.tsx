import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { ArticleEngagement } from "@/components/article-engagement/ArticleEngagement";
import { articles, getArticle } from "@/data/articles";
import styles from "./page.module.css";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const related = articles.filter((item) => item.slug !== slug && item.category === article.category).slice(0, 2);
  return <><SiteHeader /><main>
    <article className={styles.article}>
      <Link className={styles.back} href="/articles"><ArrowLeft size={15}/> All articles</Link>
      <header><p>{article.category}</p><h1>{article.title}</h1><div>{article.date}<span>By Ted Malanda</span></div><ArticleEngagement slug={article.slug} /></header>
      <figure className={styles.image}><Image src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1400&q=82" alt="Morning light across an open landscape" fill sizes="(max-width: 860px) 100vw, 820px" priority/><figcaption>A quiet moment before the story begins. Temporary archive image.</figcaption></figure>
      <div className={styles.body}>
        <p className={styles.preview}>Article body design preview — original archive text will replace this copy.</p>
        <p>Some stories begin with a grand announcement. Others arrive quietly, in a conversation overheard on a bus, a familiar argument at the market or a small incident that refuses to leave the mind.</p>
        <p>This page has been designed for that second kind of story. It gives the words enough room without turning the reading experience into a collection of panels, quotations and decorative interruptions.</p>
        <p>The final version will preserve Ted’s natural paragraph rhythm. Short observations can sit beside longer passages, while the line length remains comfortable on both a phone and a wide desktop screen.</p>
        <h2>The details that carry a story</h2>
        <p>A place often becomes memorable through an ordinary detail: the conductor calling for one last passenger, the newspaper folded beneath an arm or the way a room becomes silent when somebody asks the question everyone has avoided.</p>
        <p>Those details do not need elaborate presentation. A clear heading, an occasional photograph and carefully spaced paragraphs are enough to help the reader follow the journey.</p>
        <p>When Ted’s original archive is added, the publishing system will also preserve the date, category, author and original publication credit for every piece.</p>
        <h2>Built for long-form reading</h2>
        <p>Long stories should not feel physically difficult to read. The typography therefore remains modest in size, with generous line spacing and a centered column that does not stretch into an uncomfortable wall of text.</p>
        <p>Images will remain optional. They can introduce a story, document a place or break a particularly long article, but the design will never require Ted to find a picture merely to publish his writing.</p>
        <p>This final paragraph completes the longer design preview. Once the content tools are connected, Ted will be able to add as many normal paragraphs and headings as the story needs.</p>
      </div>
    </article>
    {related.length > 0 && <aside className={styles.related}><p>MORE IN {article.category}</p>{related.map((item)=><Link href={`/articles/${item.slug}`} key={item.slug}><span>{item.title}</span><ArrowRight size={17}/></Link>)}</aside>}
  </main><SiteFooter /></>;
}
