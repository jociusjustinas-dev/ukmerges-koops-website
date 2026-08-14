"use client";

import * as React from "react";

const valueFeatures = [
  {
    title: "Parduotuvės",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon.svg",
    body: "Kasdienės prekės ir vietos gamintojų produkcija Ukmergės mieste bei rajone.",
  },
  {
    title: "Restoranas",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon-1.svg",
    body: "„Vilkmergė“ – erdvė šventėms, renginiams ir jaukiems susitikimams.",
  },
  {
    title: "Darbo vietos",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/Service-Icon-2.svg",
    body: "Galimybės dirbti arti namų parduotuvėse, restorane ir logistikoje.",
  },
  {
    title: "Vietos tiekėjai",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon-3.svg",
    body: "Bendradarbiaujame su gamintojais, norinčiais pasiekti KOOPS pirkėjus.",
  },
  {
    title: "Bendruomenė",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/ServiceIcon.svg",
    body: "Esame šalia vietos žmonių, jų kasdienybės ir svarbiausių progų.",
  },
  {
    title: "Kasdienės paslaugos",
    icon: "https://byqsupply-components.netlify.app/Terra-Tory/images/Service-Icon-2.svg",
    body: "Patogios paslaugos ir pažįstamas aptarnavimas ten, kur gyvenate.",
  },
];

export function KoopsValueFeaturesSection() {
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
    <section className="tt-about" id="apie" aria-labelledby="apie-antraste" data-byq-component="terra-tory-services-1">
      <div className="tt-container">
        <div className="about-marquee-header">
          <p className="section-label">APIE KOOPS</p>
          <h2 id="apie-antraste">Vietos žmonėms. Vietos verslui.</h2>
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
              {valueFeatures.map((feature) => (
                <article className="about-feature-card" key={`${copyIndex}-${feature.title}`}>
                  <h3>{feature.title}</h3>
                  <img loading="lazy" src={feature.icon} alt="" />
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
