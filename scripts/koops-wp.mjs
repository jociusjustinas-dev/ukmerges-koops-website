#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const baseUrl = (process.env.KOOPS_WP_URL || "https://orchid-grouse-384861.hostingersite.com").replace(/\/$/, "");
const username = process.env.KOOPS_WP_USER || "admin";

function applicationPassword() {
  if (process.env.KOOPS_WP_APP_PASSWORD) return process.env.KOOPS_WP_APP_PASSWORD;
  try {
    return execFileSync("security", ["find-generic-password", "-s", "koops-wordpress-api", "-a", username, "-w"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    throw new Error("KOOPS API raktas nerastas sistemos raktinėje.");
  }
}

async function request(path, options = {}) {
  const auth = Buffer.from(`${username}:${applicationPassword()}`).toString("base64");
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status}: ${body.message || "WordPress API klaida"}`);
  return body;
}

async function ensureCategory({ name, slug }) {
  const existing = await request(`/wp-json/wp/v2/categories?context=edit&slug=${encodeURIComponent(slug)}&_fields=id,name,slug`);
  if (existing.length) return existing[0];
  return request("/wp-json/wp/v2/categories", {
    method: "POST",
    body: JSON.stringify({ name, slug }),
  });
}

function mediaType(filename) {
  const extension = filename.toLowerCase().split(".").pop();
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  return "image/jpeg";
}

async function ensureRemoteMedia(image) {
  const existing = await request(`/wp-json/wp/v2/media?context=edit&slug=${encodeURIComponent(image.slug)}&_fields=id,slug,source_url`);
  if (existing.length) return existing[0];

  const sourceResponse = await fetch(image.sourceUrl, { headers: { Accept: "image/*" } });
  if (!sourceResponse.ok) throw new Error(`Nepavyko atsisiųsti nuotraukos: ${image.sourceUrl}`);
  const filename = image.filename || basename(new URL(image.sourceUrl).pathname);
  const auth = Buffer.from(`${username}:${applicationPassword()}`).toString("base64");
  const uploadResponse = await fetch(`${baseUrl}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
      "Content-Disposition": `attachment; filename="${filename.replace(/["\\]/g, "")}"`,
      "Content-Type": mediaType(filename),
    },
    body: Buffer.from(await sourceResponse.arrayBuffer()),
  });
  const uploaded = await uploadResponse.json().catch(() => ({}));
  if (!uploadResponse.ok) throw new Error(`${uploadResponse.status}: ${uploaded.message || "Nuotraukos įkėlimo klaida"}`);

  return request(`/wp-json/wp/v2/media/${uploaded.id}`, {
    method: "POST",
    body: JSON.stringify({
      slug: image.slug,
      title: image.title,
      alt_text: image.alt,
    }),
  });
}

async function syncNews(manifestPath) {
  const absolutePath = resolve(manifestPath);
  const manifest = JSON.parse(readFileSync(absolutePath, "utf8"));
  if (!Array.isArray(manifest) || !manifest.length) throw new Error("Naujienų manifestas turi būti netuščias JSON masyvas.");

  const synced = [];
  for (const item of manifest) {
    const category = await ensureCategory(item.category);
    const media = item.image ? await ensureRemoteMedia(item.image) : null;
    const existing = await request(`/wp-json/wp/v2/posts?context=edit&slug=${encodeURIComponent(item.slug)}&_fields=id,slug`);
    const payload = {
      title: item.title,
      slug: item.slug,
      status: "publish",
      date: item.date,
      excerpt: item.excerpt,
      content: item.content,
      categories: [category.id],
      featured_media: media?.id || 0,
    };
    const saved = await request(existing.length ? `/wp-json/wp/v2/posts/${existing[0].id}` : "/wp-json/wp/v2/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    synced.push({ id: saved.id, slug: saved.slug, status: saved.status });
  }

  const hello = await request("/wp-json/wp/v2/posts?context=edit&slug=hello-world&_fields=id,slug,status");
  if (hello.length && hello[0].status !== "trash") {
    await request(`/wp-json/wp/v2/posts/${hello[0].id}`, {
      method: "DELETE",
    });
  }
  return synced;
}

async function syncJobs(manifestPath) {
  const absolutePath = resolve(manifestPath);
  const manifest = JSON.parse(readFileSync(absolutePath, "utf8"));
  if (!Array.isArray(manifest) || !manifest.length) throw new Error("Darbo pasiūlymų manifestas turi būti netuščias JSON masyvas.");

  const synced = [];
  for (const item of manifest) {
    const existing = await request(`/wp-json/wp/v2/koops_job?context=edit&slug=${encodeURIComponent(item.slug)}&_fields=id,slug`);
    const payload = {
      title: item.title,
      slug: item.slug,
      status: "publish",
      date: item.date,
      excerpt: item.excerpt,
      content: item.content,
      meta: {
        koops_location: item.location,
        koops_employment: item.employment,
        koops_department: item.department,
        koops_apply_url: item.applyUrl,
        koops_deadline: item.deadline || "",
      },
    };
    const saved = await request(existing.length ? `/wp-json/wp/v2/koops_job/${existing[0].id}` : "/wp-json/wp/v2/koops_job", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    synced.push({ id: saved.id, slug: saved.slug, status: saved.status });
  }
  return synced;
}

function parseJson(value, label) {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error();
    return parsed;
  } catch {
    throw new Error(`${label} turi būti JSON objektas.`);
  }
}

const [command, ...args] = process.argv.slice(2);
const resources = {
  news: "posts",
  stores: "koops_store",
  classifieds: "koops_classified",
  jobs: "koops_job",
};

let result;
if (command === "me") {
  result = await request("/wp-json/wp/v2/users/me?context=edit&_fields=id,name,roles");
} else if (command === "keys") {
  result = await request("/wp-json/wp/v2/users/me/application-passwords?_fields=uuid,name,created,last_used,last_ip");
} else if (command === "revoke-key") {
  if (!args[0]) throw new Error("Naudojimas: revoke-key <uuid>");
  const currentUser = await request("/wp-json/wp/v2/users/me?_fields=id");
  result = await request(`/wp-json/wp/v2/users/${currentUser.id}/application-passwords/${encodeURIComponent(args[0])}`, {
    method: "DELETE",
  });
} else if (command === "site") {
  result = await request("/wp-json/koops/v1/site");
} else if (command === "sync-news") {
  if (!args[0]) throw new Error("Naudojimas: sync-news <manifestas.json>");
  result = await syncNews(args[0]);
} else if (command === "sync-jobs") {
  if (!args[0]) throw new Error("Naudojimas: sync-jobs <manifestas.json>");
  result = await syncJobs(args[0]);
} else if (command === "options") {
  result = await request("/wp-json/koops/v1/manage/options", {
    method: "PATCH",
    body: JSON.stringify({ changes: parseJson(args[0], "Pakeitimai") }),
  });
} else if (command === "section") {
  const [page, section, changes] = args;
  if (!page || !section || !changes) throw new Error("Naudojimas: section <puslapis> <sekcija> '<JSON>'");
  result = await request(`/wp-json/koops/v1/manage/pages/${encodeURIComponent(page)}/sections/${encodeURIComponent(section)}`, {
    method: "PATCH",
    body: JSON.stringify({ changes: parseJson(changes, "Pakeitimai") }),
  });
} else if (command === "page") {
  const [page, sections] = args;
  if (!page || !sections) throw new Error("Naudojimas: page <puslapis> '<JSON masyvas>'");
  const parsed = JSON.parse(sections);
  if (!Array.isArray(parsed)) throw new Error("Sekcijos turi būti JSON masyvas.");
  result = await request(`/wp-json/koops/v1/manage/pages/${encodeURIComponent(page)}`, {
    method: "PATCH",
    body: JSON.stringify({ sections: parsed }),
  });
} else if (command === "list") {
  const endpoint = resources[args[0]];
  if (!endpoint) throw new Error("Tipas: news, stores, classifieds arba jobs.");
  result = await request(`/wp-json/wp/v2/${endpoint}?context=edit&per_page=100&_fields=id,slug,title,status,meta`);
} else if (command === "item") {
  const [resource, slug, changes] = args;
  const endpoint = resources[resource];
  if (!endpoint || !slug || !changes) throw new Error("Naudojimas: item <tipas> <slug> '<JSON>'");
  const matches = await request(`/wp-json/wp/v2/${endpoint}?context=edit&slug=${encodeURIComponent(slug)}&_fields=id,slug`);
  if (!matches.length) throw new Error("Įrašas nerastas.");
  result = await request(`/wp-json/wp/v2/${endpoint}/${matches[0].id}`, {
    method: "POST",
    body: JSON.stringify(parseJson(changes, "Pakeitimai")),
  });
} else {
  throw new Error("Komandos: me, keys, revoke-key, site, sync-news, sync-jobs, options, section, page, list, item.");
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
