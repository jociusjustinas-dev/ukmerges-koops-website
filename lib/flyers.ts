export type FlyerKind = "bendras" | "top3" | "kitas";

export type Flyer = {
  slug: string;
  title: string;
  excerpt?: string;
  kind: FlyerKind;
  validFrom?: string;
  validUntil?: string;
  image?: string;
  pdfUrl?: string;
  pages: string[];
};

export function flyerHref(slug: string) {
  return `/leidiniai/${slug}`;
}

export function flyerKindLabel(kind: FlyerKind) {
  if (kind === "top3") return "TOP pasiūlymai";
  if (kind === "bendras") return "Akcijų leidinys";
  return "Leidinys";
}

function parseDay(value?: string) {
  if (!value) return null;
  const stamp = Date.parse(`${value}T12:00:00`);
  return Number.isNaN(stamp) ? null : stamp;
}

export function isFlyerCurrent(flyer: Flyer, now = new Date()) {
  const start = parseDay(flyer.validFrom);
  const end = flyer.validUntil ? Date.parse(`${flyer.validUntil}T23:59:59`) : null;
  const current = now.getTime();
  if (start && current < start) return false;
  if (end && !Number.isNaN(end) && current > end) return false;
  return Boolean(start || end || flyer.pages.length || flyer.pdfUrl);
}

const MONTHS_LT = [
  "sausio",
  "vasario",
  "kovo",
  "balandžio",
  "gegužės",
  "birželio",
  "liepos",
  "rugpjūčio",
  "rugsėjo",
  "spalio",
  "lapkričio",
  "gruodžio",
] as const;

function ltDay(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return `${MONTHS_LT[date.getMonth()]} ${date.getDate()} d.`;
}

export function flyerDateLabel(flyer: Flyer) {
  const from = flyer.validFrom;
  const until = flyer.validUntil;
  if (!from && !until) return "";
  if (from && until) {
    const start = new Date(`${from}T12:00:00`);
    const end = new Date(`${until}T12:00:00`);
    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${MONTHS_LT[start.getMonth()]} ${start.getDate()}–${end.getDate()} d.`;
    }
    return `${ltDay(from)} – ${ltDay(until)}`;
  }
  return ltDay(from || until || "");
}

export function sortFlyers(items: Flyer[]) {
  return [...items].sort((a, b) => {
    const currentDelta = Number(isFlyerCurrent(b)) - Number(isFlyerCurrent(a));
    if (currentDelta) return currentDelta;
    return (b.validFrom || "").localeCompare(a.validFrom || "");
  });
}

/** Demonstraciniai leidiniai, kol WordPress dar tuščias. */
export const flyers: Flyer[] = [
  {
    slug: "akcijos-2026-09-14-27",
    title: "Akcijos 09.14–09.27",
    excerpt: "Bendras KOOPS akcijų leidinys visoms parduotuvėms.",
    kind: "bendras",
    validFrom: "2026-09-14",
    validUntil: "2026-09-27",
    image: "/flyers/bendras-cover.jpg",
    pages: ["/flyers/bendras-cover.jpg"],
  },
  {
    slug: "top3-2026-09-14-27",
    title: "3 TOP pasiūlymai",
    excerpt: "Trys stipriausi savaitės kainų pasiūlymai.",
    kind: "top3",
    validFrom: "2026-09-14",
    validUntil: "2026-09-27",
    image: "/flyers/top3-cover.jpg",
    pages: ["/flyers/top3-cover.jpg"],
  },
];
