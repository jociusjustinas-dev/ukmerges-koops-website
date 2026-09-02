export type Classified = {
  slug: string;
  title: string;
  category: "Patalpų nuoma" | "Turto pardavimas" | "Kita";
  status: "Aktyvus" | "Rezervuotas";
  location: string;
  area?: string;
  price?: string;
  excerpt: string;
  publishedAt: string;
  expiresAt?: string;
  image?: string;
};

/**
 * Demonstracinėje versijoje skelbimų sąrašas tuščias. Gamybinėje svetainėje
 * šiuos įrašus pateiks WordPress turinio tipas „Skelbimai“.
 */
export const classifieds: Classified[] = [];

