#!/usr/bin/env node

import { execFileSync } from "node:child_process";

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
} else if (command === "site") {
  result = await request("/wp-json/koops/v1/site");
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
  throw new Error("Komandos: me, site, options, section, page, list, item.");
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
