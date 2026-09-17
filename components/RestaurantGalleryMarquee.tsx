"use client";

import Image from "next/image";
import * as React from "react";
import { restaurantGallery } from "../lib/restaurant";

type GalleryImage = {
  src: string;
  alt: string;
  big?: boolean;
};

/** BYQ: terra-tory-gallery-1 — infinite auto marquee with drag */
export function RestaurantGalleryMarquee({ galleryUrls }: { galleryUrls?: string[] }) {
  const images: GalleryImage[] = galleryUrls?.filter(Boolean).length
    ? galleryUrls.filter(Boolean).map((src, index) => ({
        src,
        alt: restaurantGallery[index]?.alt || `Restorano nuotrauka ${index + 1}`,
        big: restaurantGallery[index]?.big ?? index === 0,
      }))
    : restaurantGallery;

  const trackRef = React.useRef<HTMLDivElement>(null);
  const firstSetRef = React.useRef<HTMLDivElement>(null);
  const setWidthRef = React.useRef(0);
  const positionRef = React.useRef(0);
  const dragRef = React.useRef({ active: false, pointerId: -1, startX: 0, startPosition: 0 });
  const [isDragging, setIsDragging] = React.useState(false);

  const renderPosition = React.useCallback(() => {
    const track = trackRef.current;
    const setWidth = setWidthRef.current;
    if (!track || setWidth <= 0) return;

    while (positionRef.current <= -setWidth) positionRef.current += setWidth;
    while (positionRef.current > 0) positionRef.current -= setWidth;
    track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
  }, []);

  React.useEffect(() => {
    const firstSet = firstSetRef.current;
    if (!firstSet) return;

    const updateSetWidth = () => {
      setWidthRef.current = firstSet.getBoundingClientRect().width;
      renderPosition();
    };

    updateSetWidth();
    const resizeObserver = new ResizeObserver(updateSetWidth);
    resizeObserver.observe(firstSet);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let previousTime = performance.now();

    const moveMarquee = (time: number) => {
      const delta = Math.min(time - previousTime, 50);
      previousTime = time;
      if (!dragRef.current.active && !reducedMotion.matches) {
        positionRef.current -= delta * 0.04;
        renderPosition();
      }
      animationFrame = requestAnimationFrame(moveMarquee);
    };

    animationFrame = requestAnimationFrame(moveMarquee);
    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [renderPosition, images.length]);

  const startDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startPosition: positionRef.current,
    };
    setIsDragging(true);
  };

  const dragMarquee = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    positionRef.current = dragRef.current.startPosition + event.clientX - dragRef.current.startX;
    renderPosition();
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  return (
    <div
      className={`restaurant-gallery-marquee${isDragging ? " is-dragging" : ""}`}
      role="region"
      aria-label="Restorano nuotraukų juosta. Galima tempti horizontaliai."
      onPointerDown={startDragging}
      onPointerMove={dragMarquee}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <div className="restaurant-gallery-track" ref={trackRef}>
        {[0, 1, 2].map((copyIndex) => (
          <div
            className="restaurant-gallery-strip"
            aria-hidden={copyIndex === 0 ? undefined : true}
            key={copyIndex}
            ref={copyIndex === 0 ? firstSetRef : undefined}
          >
            {images.map((img) => (
              <div
                className={`restaurant-gallery-frame${img.big ? " is-big" : ""}`}
                key={`${copyIndex}-${img.src}`}
              >
                <Image
                  src={img.src}
                  alt={copyIndex === 0 ? img.alt : ""}
                  fill
                  priority={copyIndex === 0}
                  sizes="(max-width: 767px) 240px, (max-width: 1199px) 46vw, 560px"
                  quality={78}
                  draggable={false}
                  data-cms-field={copyIndex === 0 ? "gallery-item" : undefined}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
