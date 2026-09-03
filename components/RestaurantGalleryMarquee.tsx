import Image from "next/image";
import { restaurantGallery } from "../lib/restaurant";

function ImageStrip() {
  return (
    <div className="restaurant-gallery-strip">
      {restaurantGallery.map((img) => (
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
          />
        </div>
      ))}
    </div>
  );
}

/** BYQ: terra-tory-gallery-1 — unique-image gallery */
export function RestaurantGalleryMarquee() {
  return (
    <div className="restaurant-gallery-marquee">
      <div className="restaurant-gallery-track">
        <ImageStrip />
      </div>
    </div>
  );
}
