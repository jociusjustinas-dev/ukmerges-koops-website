import type { Metadata } from "next";

const DEFAULT_OG_IMAGE = {
  url: "/koops-hero-market.jpg",
  width: 1672,
  height: 941,
  alt: "KOOPS parduotuvės Ukmergėje ir rajone",
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
  image,
}: PageMetadataInput): Metadata {
  const images = image
    ? [{ url: image, alt: title }]
    : [DEFAULT_OG_IMAGE];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "lt_LT",
      siteName: "KOOPS",
      title,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((item) => item.url),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
