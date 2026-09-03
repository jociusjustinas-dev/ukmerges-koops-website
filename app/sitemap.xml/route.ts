import { newsHref } from "../../lib/news";
import { absoluteUrl } from "../../lib/site-url";
import { getKoopsCmsData } from "../../lib/wordpress";

const staticRoutes = [
  "/",
  "/parduotuves",
  "/naujienos",
  "/skelbimai",
  "/restoranas",
  "/karjera",
  "/tiekejams",
  "/apie",
  "/kontaktai",
  "/privatumo-politika",
];

const DEFAULT_WORDPRESS_URL = "https://orchid-grouse-384861.hostingersite.com";

type ModifiedEntry = { slug: string; modified_gmt: string };

function isoDate(value: string) {
  return new Date(`${value}Z`).toISOString();
}

async function modificationDates() {
  try {
    const baseUrl = (process.env.WORDPRESS_API_URL || DEFAULT_WORDPRESS_URL).replace(/\/$/, "");
    const resources = ["pages", "koops_store", "posts"] as const;
    const responses = await Promise.all(
      resources.map((resource) =>
        fetch(`${baseUrl}/wp-json/wp/v2/${resource}?per_page=100&_fields=slug,modified_gmt`, {
          next: { revalidate: 3600 },
        }),
      ),
    );

    if (responses.some((response) => !response.ok)) return new Map<string, string>();
    const [pages, stores, posts] = await Promise.all(
      responses.map((response) => response.json() as Promise<ModifiedEntry[]>),
    );
    const dates = new Map<string, string>();
    pages.forEach((entry) => dates.set(entry.slug === "pradinis" ? "/" : `/${entry.slug}`, isoDate(entry.modified_gmt)));
    stores.forEach((entry) => dates.set(`/parduotuves/${entry.slug}`, isoDate(entry.modified_gmt)));
    posts.forEach((entry) => dates.set(newsHref(entry.slug), isoDate(entry.modified_gmt)));

    const latest = (entries: ModifiedEntry[]) =>
      entries.reduce((max, entry) => Math.max(max, new Date(`${entry.modified_gmt}Z`).getTime()), 0);
    const latestStores = latest(stores);
    const latestNews = latest(posts);
    const latestSite = Math.max(latest(pages), latestStores, latestNews);
    if (latestStores) dates.set("/parduotuves", new Date(latestStores).toISOString());
    if (latestNews) dates.set("/naujienos", new Date(latestNews).toISOString());
    if (latestSite) dates.set("/", new Date(latestSite).toISOString());
    return dates;
  } catch {
    return new Map<string, string>();
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [{ stores, news }, modified] = await Promise.all([getKoopsCmsData(), modificationDates()]);
  const routes = [
    ...staticRoutes,
    ...stores.map((store) => `/parduotuves/${store.slug}`),
    ...news.map((item) => newsHref(item.slug)),
  ];
  const entries = [...new Set(routes)]
    .map((route) => {
      const frequency = route.startsWith("/naujienos") ? "weekly" : "monthly";
      const priority = route === "/" ? "1.0" : route === "/parduotuves" ? "0.9" : "0.7";
      const lastModified = modified.get(route);
      const lastmod = lastModified ? `<lastmod>${escapeXml(lastModified)}</lastmod>` : "";
      return `<url><loc>${escapeXml(absoluteUrl(route))}</loc>${lastmod}<changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
