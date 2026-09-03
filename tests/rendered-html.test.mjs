import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the KOOPS homepage and SEO metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="lt">/i);
  assert.match(html, /<title>KOOPS \| Parduotuvės Ukmergėje ir rajone<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/ukmerges-koops-website\.vercel\.app"/i);
  assert.match(html, /property="og:image"/i);
  assert.match(html, /property="og:url" content="https:\/\/ukmerges-koops-website\.vercel\.app"/i);
  assert.match(html, /<h1><span>KOOPS <\/span><span>parduotuvės <\/span>[\s\S]*<span>arčiau <\/span><span>jūsų\.<\/span><\/h1>/i);
  assert.match(html, /"@type":"Organization"/i);
  assert.match(html, /"@type":"WebSite"/i);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/i);
});

test("keeps the primary hero visible and prioritizes only its background", async () => {
  const response = await render();
  const html = await response.text();
  const highPriorityImages = html.match(/fetchPriority="high"/g) ?? [];

  assert.equal(highPriorityImages.length, 2);
  assert.match(html, /class="tt-hero-background"[\s\S]*fetchPriority="high"/i);
  assert.doesNotMatch(html, /tt-hero-top h1[^>]*style="[^"]*opacity:\s*0/i);
  assert.match(html, /<img(?=[^>]*loading="lazy")(?=[^>]*alt="Parduotuvė)[^>]*>/i);
});
