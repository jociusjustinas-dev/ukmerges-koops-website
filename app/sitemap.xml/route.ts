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

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { stores, news } = await getKoopsCmsData();
  const routes = [
    ...staticRoutes,
    ...stores.map((store) => `/parduotuves/${store.slug}`),
    ...news.map((item) => newsHref(item.slug)),
  ];
  const entries = [...new Set(routes)]
    .map((route) => {
      const frequency = route.startsWith("/naujienos") ? "weekly" : "monthly";
      const priority = route === "/" ? "1.0" : route === "/parduotuves" ? "0.9" : "0.7";
      return `<url><loc>${escapeXml(absoluteUrl(route))}</loc><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`;
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
