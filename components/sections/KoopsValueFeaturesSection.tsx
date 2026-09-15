"use client";

import * as React from "react";
import {
  defaultHomeValueFeatures,
  defaultHomeValueParagraphs,
  sectionItemsOrDefault,
  type CmsFeatureItem,
} from "../../lib/cms-items";

const valueIcons = [
  "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon.svg",
  "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon-1.svg",
  "https://byqsupply-components.netlify.app/Terra-Tory/images/Service-Icon-2.svg",
  "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon-3.svg",
  "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon.svg",
  "https://byqsupply-components.netlify.app/Terra-Tory/images/Service-Icon-2.svg",
];

function introParagraphs(description?: string): string[] {
  const fromCms = (description || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  // Vieno sakinio aprašymas neturi užgožti pilno pasakojimo (seni WP įrašai be \n\n).
  if (fromCms.length >= 2) return fromCms;
  return defaultHomeValueParagraphs;
}

export function KoopsValueFeaturesSection({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: CmsFeatureItem[];
} = {}) {
  const features = sectionItemsOrDefault(items, defaultHomeValueFeatures);
  const paragraphs = introParagraphs(description);
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
        positionRef.current -= delta * 0.035;
        renderPosition();
      }
      animationFrame = requestAnimationFrame(moveMarquee);
    };

    animationFrame = requestAnimationFrame(moveMarquee);
    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [renderPosition]);

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
    <section className="tt-about" id="apie" aria-labelledby="apie-antraste" data-byq-component="terra-tory-services-1" data-cms-section="home-values">
      <div className="tt-container">
        <div className="about-marquee-header">
          <p className="section-label" data-cms-field="eyebrow">
            {eyebrow?.trim() || "APIE KOOPS"}
          </p>
          <h2 id="apie-antraste" data-cms-field="title" style={{ whiteSpace: "pre-line" }}>
            {title?.trim() || "Vietos žmonėms. Vietos verslui."}
          </h2>
        </div>
        <div className="about-intro" data-cms-field="description" data-cms-format="paragraphs">
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph.slice(0, 24)}`}
              className={index === paragraphs.length - 1 ? "about-intro-closing" : undefined}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div
        className={`about-marquee${isDragging ? " is-dragging" : ""}`}
        role="region"
        aria-label="KOOPS veiklos ir vertės. Juostą galima tempti horizontaliai."
        onPointerDown={startDragging}
        onPointerMove={dragMarquee}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <div className="about-marquee-track" ref={trackRef}>
          {[0, 1, 2].map((copyIndex) => (
            <div
              className="about-marquee-set"
              aria-hidden={copyIndex === 0 ? undefined : true}
              key={copyIndex}
              ref={copyIndex === 0 ? firstSetRef : undefined}
            >
              {features.map((feature, index) => (
                <article
                  className="about-feature-card"
                  key={`${copyIndex}-${feature.title}-${index}`}
                  data-cms-item={index}
                >
                  <h3 data-cms-item-field="title">{feature.title}</h3>
                  <img loading="lazy" src={valueIcons[index % valueIcons.length]} alt="" />
                  <p data-cms-item-field="body">{feature.body}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
