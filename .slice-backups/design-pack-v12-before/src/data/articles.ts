export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  year: string;
  excerpt: string;
  featured?: boolean;
  archived?: boolean;
  author?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  originalPublication?: string;
};

export const articles: Article[] = [
  {
    slug: "drag-us-to-singapore",
    title: "Drag us to Singapore? Over our dead bodies",
    category: "Public Affairs",
    date: "December 20, 2025",
    year: "2025",
    excerpt: "A sharp look at the ambitions we announce, the habits we defend and the country we keep promising to build.",
    featured: true,
  },
  {
    slug: "health-certificates-and-the-chef",
    title: "Health certificates are great, but can the chef really cook?",
    category: "Kenyan Life",
    date: "December 14, 2025",
    year: "2025",
    excerpt: "Paperwork can reassure us, but it cannot always answer the practical question sitting right in front of us.",
  },
  {
    slug: "warriors-returning-from-haiti",
    title: "Rude culture shock awaits our triumphant warriors from Haiti",
    category: "Public Affairs",
    date: "December 14, 2025",
    year: "2025",
    excerpt: "What happens when public ceremony meets the untidy realities waiting beyond the airport welcome?",
  },
  {
    slug: "presidents-award-kenya",
    title: "President’s Award-Kenya is a gem that shouldn’t be dissolved",
    category: "People & Society",
    date: "December 2025",
    year: "2025",
    excerpt: "Some institutions quietly shape generations and deserve more than a passing mention when change comes calling.",
  },
  {
    slug: "anecdotes-from-long-distance-travel",
    title: "Anecdotes from decades of long distance travel",
    category: "Kenyan Life",
    date: "August 18, 2024",
    year: "2024",
    excerpt: "From bogus preachers to persistent hawkers, some journeys remain long after the bus reaches its destination.",
  },
  {
    slug: "old-ways-are-the-best",
    title: "Sometimes, the old ways are the best",
    category: "Memory & Place",
    date: "May 5, 2024",
    year: "2024",
    excerpt: "Progress has its place, but memory occasionally preserves a solution that modern life has misplaced.",
  },
  {
    slug: "most-underestimated-politician",
    title: "Mwai Kibaki: Kenya’s most underestimated politician",
    category: "Public Affairs",
    date: "April 23, 2023",
    year: "2023",
    excerpt: "A reflection on quiet power, public memory and how a political legacy changes with distance.",
  },
  {
    slug: "naming-elephants",
    title: "Blimey, we are now naming elephants!",
    category: "Humour & Satire",
    date: "September 11, 2022",
    year: "2022",
    excerpt: "A characteristically playful observation about ceremony, affection and our talent for making an occasion of things.",
  },
];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
