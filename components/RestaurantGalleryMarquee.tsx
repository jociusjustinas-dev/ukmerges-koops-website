import { restaurantGallery } from "../lib/restaurant";

function ImageStrip() {
  return (
    <div className="restaurant-gallery-strip">
      {restaurantGallery.map((img) => (
        <div
          className={`restaurant-gallery-frame${img.big ? " is-big" : ""}`}
          key={img.src}
        >
          <img src={img.src} alt={img.alt} />
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
