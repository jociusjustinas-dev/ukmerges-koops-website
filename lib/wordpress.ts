import "server-only";

import { classifieds as fallbackClassifieds, type Classified } from "./classifieds";
import { jobs as fallbackJobs, type Job } from "./jobs";
import { newsItems as fallbackNews, type NewsItem } from "./news";
import { stores as fallbackStores, type Store, type StoreArea } from "./stores";

const DEFAULT_WORDPRESS_URL = "https://orchid-grouse-384861.hostingersite.com";

export type WordPressOptions = {
  legal_name?: string;
  address?: string;
  phone?: string;
  administration_phone?: string;
  email?: string;
  office_hours?: string;
  facebook_url?: string;
  instagram_url?: string;
  privacy_url?: string;
  restaurant_phone?: string;
  restaurant_mobile?: string;
  restaurant_email?: string;
  restaurant_address?: string;
  restaurant_since?: string;
  restaurant_halls?: string;
  restaurant_capacity?: string;
};

export type CmsPageSection = {
  id: string;
  type: string;
  enabled: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  imageUrl?: string;
  overrides?: string[];
};

export type CmsPage = {
  id: number;
  title: string;
  sections: CmsPageSection[];
};

type RawTerm = { name?: string; slug?: string };
type RawEntry = {
  id?: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  publishedAt?: string;
  image?: string;
  city?: string;
  address?: string;
  hours?: string;
  phone?: string;
  extraPhone?: string;
  lat?: number;
  lng?: number;
  map?: string;
  featured?: boolean;
  areas?: RawTerm[];
  category?: string;
  categories?: RawTerm[];
  location?: string;
  area?: string;
  price?: string;
  status?: string;
  expiresAt?: string;
  employment?: string;
  department?: string;
  applyUrl?: string;
};

type RawSiteData = {
  version?: string;
  updatedAt?: string;
  options?: WordPressOptions;
  stores?: RawEntry[];
  news?: RawEntry[];
  classifieds?: RawEntry[];
  jobs?: RawEntry[];
  pages?: Record<string, CmsPage>;
};

export type KoopsCmsData = {
  options: WordPressOptions;
  stores: Store[];
  news: NewsItem[];
  classifieds: Classified[];
  jobs: Job[];
  pages: Record<string, CmsPage>;
};

function phoneHref(phone = "") {
  const normalized = phone.replace(/[^\d+]/g, "").replace(/^0/, "+370");
  return normalized;
}

function plainText(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function mapStores(entries: RawEntry[]): Store[] {
  return entries
    .filter((item) => item.slug && item.title && item.address)
    .map((item) => {
      const areaSlug = item.areas?.[0]?.slug;
      const area: StoreArea = areaSlug === "miestas" ? "miestas" : "rajonas";
      return {
        slug: item.slug!,
        name: item.title!,
        city: item.city || item.address!.split(",")[1]?.trim() || "Ukmergė",
        area,
        address: item.address!,
        hours: item.hours || "Darbo laiką tikslinti telefonu",
        phone: item.phone || "",
        phoneHref: phoneHref(item.phone),
        extraPhone: item.extraPhone || undefined,
        extraPhoneHref: item.extraPhone ? phoneHref(item.extraPhone) : undefined,
        image: item.image || undefined,
        lat: Number(item.lat) || 55.2497,
        lng: Number(item.lng) || 24.7636,
        map:
          item.map ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.address}, Lietuva`)}`,
        services: [],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "lt"));
}

function mapNews(entries: RawEntry[]): NewsItem[] {
  const tones: NewsItem["tone"][] = ["featured", "accent", "muted", "wide"];
  return entries
    .filter((item) => item.slug && item.title)
    .map((item, index) => ({
      slug: item.slug!,
      title: item.title!,
      excerpt: item.excerpt || undefined,
      category: item.category || "Naujienos",
      date: item.publishedAt || new Date().toISOString().slice(0, 10),
      image: item.image || undefined,
      tone: tones[index] || "muted",
      body: [{ type: "p" as const, text: plainText(item.content || item.excerpt || "") }],
    }));
}

function mapClassifieds(entries: RawEntry[]): Classified[] {
  return entries
    .filter((item) => item.slug && item.title)
    .map((item) => ({
      slug: item.slug!,
      title: item.title!,
      category:
        item.categories?.[0]?.slug === "turto-pardavimas"
          ? "Turto pardavimas"
          : item.categories?.[0]?.slug === "kita"
            ? "Kita"
            : "Patalpų nuoma",
      status: item.status === "rezervuotas" ? "Rezervuotas" : "Aktyvus",
      location: item.location || "Ukmergė",
      area: item.area || undefined,
      price: item.price || undefined,
      excerpt: item.excerpt || plainText(item.content || ""),
      publishedAt: item.publishedAt || new Date().toISOString().slice(0, 10),
      expiresAt: item.expiresAt || undefined,
      image: item.image || undefined,
    }));
}

function mapJobs(entries: RawEntry[]): Job[] {
  return entries
    .filter((item) => item.slug && item.title)
    .map((item, index) => ({
      id: item.slug!,
      number: String(index + 1).padStart(2, "0"),
      type: (item.department || "KOOPS").toUpperCase(),
      title: item.title!,
      location: item.location || "Ukmergė ir rajonas",
      employment: item.employment || "",
      summary: item.excerpt || plainText(item.content || ""),
      applyUrl: item.applyUrl || "/karjera#susisiekti",
    }));
}

const fallback: KoopsCmsData = {
  options: {},
  stores: fallbackStores,
  news: fallbackNews,
  classifieds: fallbackClassifieds,
  jobs: fallbackJobs,
  pages: {},
};

function normalizeOptions(options: WordPressOptions): WordPressOptions {
  const privacyUrl = options.privacy_url;
  const isKoopsPrivacyPage = privacyUrl && /\/privatumo-politika\/?(?:[?#].*)?$/.test(privacyUrl);

  return {
    ...options,
    privacy_url: isKoopsPrivacyPage ? "/privatumo-politika" : privacyUrl,
  };
}

export async function getKoopsCmsData(): Promise<KoopsCmsData> {
  const baseUrl = (process.env.WORDPRESS_API_URL || DEFAULT_WORDPRESS_URL).replace(/\/$/, "");

  try {
    const response = await fetch(`${baseUrl}/wp-json/koops/v1/site`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["koops-cms"] },
    });
    if (!response.ok) return fallback;

    const raw = (await response.json()) as RawSiteData;
    const liveStores = mapStores(raw.stores || []);
    const liveNews = mapNews(raw.news || []);
    const liveClassifieds = mapClassifieds(raw.classifieds || []);
    const liveJobs = mapJobs(raw.jobs || []);

    return {
      options: normalizeOptions(raw.options || {}),
      stores: liveStores.length ? liveStores : fallback.stores,
      news: liveNews.length ? liveNews : fallback.news,
      classifieds: liveClassifieds,
      jobs: liveJobs.length ? liveJobs : fallback.jobs,
      pages: raw.pages || {},
    };
  } catch {
    return fallback;
  }
}
