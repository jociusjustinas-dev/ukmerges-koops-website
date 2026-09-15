import Image from "next/image";
import { restaurantGallery } from "../lib/restaurant";

type GalleryImage = {
  src: string;
  alt: string;
  big?: boolean;
};

function ImageStrip({ images }: { images: GalleryImage[] }) {
  return (
    <div className="restaurant-gallery-strip">
      {images.map((img) => (
        <div
          className={`restaurant-gallery-frame${img.big ? " is-big" : ""}`}
          key={img.src}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority
            sizes="(max-width: 767px) 240px, (max-width: 1199px) 46vw, 560px"
            quality={78}
            data-cms-field="gallery-item"
          />
        </div>
      ))}
    </div>
  );
}

/** BYQ: terra-tory-gallery-1 — unique-image gallery */
export function RestaurantGalleryMarquee({ galleryUrls }: { galleryUrls?: string[] }) {
  const images: GalleryImage[] = galleryUrls?.filter(Boolean).length
    ? galleryUrls.filter(Boolean).map((src, index) => ({
        src,
        alt: restaurantGallery[index]?.alt || `Restorano nuotrauka ${index + 1}`,
        big: restaurantGallery[index]?.big,
      }))
    : restaurantGallery;

  return (
    <div className="restaurant-gallery-marquee">
      <div className="restaurant-gallery-track">
        <ImageStrip images={images} />
      </div>
    </div>
  );
}
