function withProtocol(value:string) {
  return /^https?:\/\//i.test(value)?value:`https://${value}`;
}

export const siteUrl=withProtocol(
  process.env.NEXT_PUBLIC_SITE_URL
  ??process.env.VERCEL_PROJECT_PRODUCTION_URL
  ??process.env.VERCEL_URL
  ??"http://localhost:3000",
).replace(/\/$/,"");

export const absoluteUrl=(path:string)=>/^https?:\/\//i.test(path)?path:`${siteUrl}${path.startsWith("/")?path:`/${path}`}`;
