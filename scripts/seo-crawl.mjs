#!/usr/bin/env node

const startUrl = process.argv[2] || "https://ukmerges-koops-website.vercel.app/";
const origin = new URL(startUrl).origin;
const queue = [new URL("/", origin).href];
const seen = new Set();
const pages = [];

const decode = (value = "") => value
  .replace(/&quot;/gi, '"')
  .replace(/&#x27;|&#39;/gi, "'")
  .replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&nbsp;/gi, " ");

const strip = (value = "") => decode(value.replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim());

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return decode(match?.[1] ?? match?.[2] ?? match?.[3] ?? "");
};

const allTags = (html, tag) => html.match(new RegExp(`<${tag}\\b[^>]*>`, "gi")) || [];
const elementText = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi"))].map((match) => strip(match[1]));

const meta = (html, key, value) => {
  for (const tag of allTags(html, "meta")) {
    if (attr(tag, key).toLowerCase() === value.toLowerCase()) return attr(tag, "content");
  }
  return "";
};

const linkRel = (html, rel) => {
  for (const tag of allTags(html, "link")) {
    if (attr(tag, "rel").toLowerCase().split(/\s+/).includes(rel)) return attr(tag, "href");
  }
  return "";
};

const normalize = (href, base) => {
  try {
    const url = new URL(href, base);
    url.hash = "";
    if (url.origin !== origin) return null;
    if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/")) return null;
    return url.href;
  } catch {
    return null;
  }
};

while (queue.length && seen.size < 150) {
  const url = queue.shift();
  if (!url || seen.has(url)) continue;
  seen.add(url);

  try {
    const response = await fetch(url, { redirect: "follow" });
    const html = await response.text();
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      pages.push({ url, status: response.status, contentType });
      continue;
    }

    const links = allTags(html, "a").map((tag) => attr(tag, "href")).filter(Boolean);
    for (const href of links) {
      const normalized = normalize(href, url);
      if (normalized && !seen.has(normalized)) queue.push(normalized);
    }

    const images = allTags(html, "img").map((tag) => ({
      src: attr(tag, "src"),
      alt: attr(tag, "alt"),
      loading: attr(tag, "loading"),
      width: attr(tag, "width"),
      height: attr(tag, "height"),
    }));
    const title = elementText(html, "title")[0] || "";
    const description = meta(html, "name", "description");
    const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => {
      try { return JSON.parse(match[1]); } catch { return { parseError: true }; }
    });
    const visibleText = strip(html.replace(/<header[\s\S]*?<\/header>/gi, " ").replace(/<footer[\s\S]*?<\/footer>/gi, " "));

    pages.push({
      url,
      finalUrl: response.url,
      status: response.status,
      title,
      titleLength: [...title].length,
      description,
      descriptionLength: [...description].length,
      canonical: linkRel(html, "canonical"),
      robots: meta(html, "name", "robots"),
      lang: attr(html.match(/<html\b[^>]*>/i)?.[0] || "", "lang"),
      h1: elementText(html, "h1"),
      h2: elementText(html, "h2"),
      ogTitle: meta(html, "property", "og:title"),
      ogDescription: meta(html, "property", "og:description"),
      ogImage: meta(html, "property", "og:image"),
      ogUrl: meta(html, "property", "og:url"),
      twitterCard: meta(html, "name", "twitter:card"),
      favicon: linkRel(html, "icon"),
      wordCount: visibleText ? visibleText.split(/\s+/).length : 0,
      imageCount: images.length,
      imagesMissingAlt: images.filter((image) => image.alt === "").length,
      imagesMissingDimensions: images.filter((image) => !image.width || !image.height).length,
      lazyImages: images.filter((image) => image.loading === "lazy").length,
      jsonLd,
      internalLinks: links.map((href) => normalize(href, url)).filter(Boolean),
    });
  } catch (error) {
    pages.push({ url, error: String(error) });
  }
}

const resources = {};
for (const path of ["/robots.txt", "/sitemap.xml", "/favicon.ico"]) {
  try {
    const response = await fetch(new URL(path, origin), { redirect: "manual" });
    resources[path] = {
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      location: response.headers.get("location") || "",
      body: (await response.text()).slice(0, 5000),
    };
  } catch (error) {
    resources[path] = { error: String(error) };
  }
}

const referenced = new Set(pages.flatMap((page) => page.internalLinks || []));
const known = new Set(pages.map((page) => page.url));
const uncrawled = [...referenced].filter((url) => !known.has(url));
const duplicateTitles = Object.entries(Object.groupBy(pages.filter((page) => page.title), (page) => page.title))
  .filter(([, group]) => group.length > 1)
  .map(([value, group]) => ({ value, urls: group.map((page) => page.url) }));
const duplicateDescriptions = Object.entries(Object.groupBy(pages.filter((page) => page.description), (page) => page.description))
  .filter(([, group]) => group.length > 1)
  .map(([value, group]) => ({ value, urls: group.map((page) => page.url) }));

const report = JSON.stringify({
  generatedAt: new Date().toISOString(),
  origin,
  summary: {
    crawled: pages.length,
    ok: pages.filter((page) => page.status === 200).length,
    errors: pages.filter((page) => page.error || (page.status && page.status >= 400)).length,
    missingTitle: pages.filter((page) => !page.title).map((page) => page.url),
    missingDescription: pages.filter((page) => !page.description).map((page) => page.url),
    missingCanonical: pages.filter((page) => !page.canonical).map((page) => page.url),
    missingOgImage: pages.filter((page) => !page.ogImage).map((page) => page.url),
    wrongH1Count: pages.filter((page) => page.h1 && page.h1.length !== 1).map((page) => ({ url: page.url, count: page.h1.length })),
    noJsonLd: pages.filter((page) => page.jsonLd && page.jsonLd.length === 0).map((page) => page.url),
    shortContent: pages.filter((page) => page.wordCount && page.wordCount < 120).map((page) => ({ url: page.url, words: page.wordCount })),
    duplicateTitles,
    duplicateDescriptions,
    uncrawled,
  },
  resources,
  pages,
}, null, 2);

if (process.argv[3]) {
  const { writeFile } = await import("node:fs/promises");
  await writeFile(process.argv[3], report);
  console.log(`SEO crawl saved to ${process.argv[3]}`);
} else {
  console.log(report);
}
