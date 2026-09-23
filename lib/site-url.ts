function normalizeSiteUrl(value:string){return value.replace(/\/+$/,'')}

export function getSiteUrl(){
  const explicit=process.env.NEXT_PUBLIC_SITE_URL;
  if(explicit)return normalizeSiteUrl(explicit);
  const vercel=process.env.VERCEL_PROJECT_PRODUCTION_URL||process.env.VERCEL_URL;
  if(vercel)return normalizeSiteUrl(`https://${vercel}`);
  return 'https://sammemha.vercel.app';
}
