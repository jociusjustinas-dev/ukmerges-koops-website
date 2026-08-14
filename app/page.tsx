"use client";

import * as React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { KoopsBentoSection } from "../components/sections/KoopsBentoSection";
import { KoopsValueFeaturesSection } from "../components/sections/KoopsValueFeaturesSection";
import { AvenirButtonArrow, ByqChevron } from "./byq-icons";

const stores = [
  {
    name: "Papartis",
    address: "Vasario 16-osios g. 30, Ukmergė",
    hours: "I–VI 7:00–20:00 · VII 7:00–16:00",
    phone: "0 340 53562",
    phoneHref: "+37034053562",
    image: "/store-papartis.jpeg",
    map: "https://maps.app.goo.gl/igZB8hHG6RGBJqfZ8",
  },
  {
    name: "Šermukšnėlė",
    address: "A. Smetonos g. 43, Ukmergė",
    hours: "Kasdien 8:00–20:00",
    phone: "0 340 51447",
    phoneHref: "+37034051447",
    image: "/store-sermuksne.jpeg",
    map: "https://maps.app.goo.gl/tcv1vqRoE8HBueLp6",
  },
  {
    name: "Uosis",
    address: "Putinų g. 40, Ukmergė",
    hours: "Kasdien 8:00–20:00",
    phone: "0 340 64551",
    phoneHref: "+37034064551",
    image: "/store-uosis.jpeg",
    map: "https://www.google.com/maps/search/?api=1&query=Putinų+g.+40+Ukmergė",
  },
];

const jobs = [
  { number: "01", type: "PARDUOTUVĖSE", title: "Pardavėjas (-a)", location: "Ukmergė ir rajonas" },
  { number: "02", type: "RESTORANE", title: "Virėjas (-a)", location: "Restoranas „Vilkmergė“" },
  { number: "03", type: "LOGISTIKOJE", title: "Vairuotojas–sandėlininkas (-ė)", location: "Ukmergė" },
];

const heroUpdates = [
  {
    label: "NAUJIENOS",
    title: "Vietos skoniai – arčiau jūsų",
    image: "/local-produce-tomatoes.jpg",
    href: "#naujienos",
  },
  {
    label: "RESTORANAS",
    title: "Planuojate šventę „Vilkmergėje“?",
    image: "/vilkmerge.jpg",
    href: "#restoranas",
  },
  {
    label: "KARJERA",
    title: "Nauji darbo pasiūlymai Ukmergėje",
    image: "/local-produce-customer.jpg",
    href: "#karjera",
  },
];

const restaurantSlides = [
  { src: "/vilkmerge.jpg", alt: "Restorano „Vilkmergė“ lauko erdvė" },
  { src: "/vilkmerge-hall.jpg", alt: "Šventei paruošta restorano „Vilkmergė“ pokylių salė" },
  { src: "/vilkmerge-table.jpg", alt: "Šventiškai serviruotas restorano stalas" },
  { src: "/vilkmerge-menu.jpg", alt: "Restorano „Vilkmergė“ ruošiami užkandžiai" },
];

const socialLinks = [
  { label: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/ukmergeskoops" },
  // Pakeisti, jei klientas pateiks kitą oficialų „Instagram“ paskyros adresą.
  { label: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/ukmergeskoops/" },
];

type SupplierField = "vardas" | "el_pastas" | "pasiulymas" | "privatumas";
type SupplierFormErrors = Partial<Record<SupplierField, string>>;

const supplierFieldOrder: SupplierField[] = ["vardas", "el_pastas", "pasiulymas", "privatumas"];

function validateSupplierForm(form: HTMLFormElement): SupplierFormErrors {
  const data = new FormData(form);
  const name = String(data.get("vardas") ?? "").trim();
  const email = String(data.get("el_pastas") ?? "").trim();
  const proposal = String(data.get("pasiulymas") ?? "").trim();
  const errors: SupplierFormErrors = {};

  if (name.length < 2) errors.vardas = "Įrašykite savo vardą.";
  if (!email) {
    errors.el_pastas = "Įrašykite el. pašto adresą.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.el_pastas = "Patikrinkite el. pašto adreso formatą.";
  }
  if (proposal.length < 10) errors.pasiulymas = "Trumpai aprašykite savo pasiūlymą.";
  if (data.get("privatumas") !== "patvirtinta") {
    errors.privatumas = "Patvirtinkite, kad susipažinote su privatumo politika.";
  }

  return errors;
}

function RollingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="avenir-button-inner">
      <span className="avenir-icon-wrap" aria-hidden="true">
        <span className="avenir-button-icon"><AvenirButtonArrow /></span>
      </span>
      <span className="avenir-button-text">{children}</span>
    </span>
  );
}

export default function Home() {
  const [heroUpdateIndex, setHeroUpdateIndex] = React.useState(0);
  const [heroUpdatesPaused, setHeroUpdatesPaused] = React.useState(false);
  const [restaurantSlide, setRestaurantSlide] = React.useState(0);
  const [supplierFormErrors, setSupplierFormErrors] = React.useState<SupplierFormErrors>({});
  const [supplierFormStatus, setSupplierFormStatus] = React.useState<"idle" | "error" | "ready">("idle");
  const pageRef = React.useRef<HTMLDivElement>(null);
  const heroLineRef = React.useRef<HTMLElement>(null);
  const supplierErrorSummaryRef = React.useRef<HTMLDivElement>(null);

  const clearSupplierError = (field: SupplierField) => {
    setSupplierFormErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (supplierFormStatus === "ready") setSupplierFormStatus("idle");
  };

  const handleSupplierSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const errors = validateSupplierForm(form);

    setSupplierFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setSupplierFormStatus("error");
      window.requestAnimationFrame(() => supplierErrorSummaryRef.current?.focus());
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("vardas") ?? "").trim();
    const email = String(data.get("el_pastas") ?? "").trim();
    const proposal = String(data.get("pasiulymas") ?? "").trim();
    const subject = encodeURIComponent(`Naujo tiekėjo pasiūlymas – ${name}`);
    const body = encodeURIComponent(`Vardas: ${name}\nEl. paštas: ${email}\n\nPasiūlymas:\n${proposal}`);

    setSupplierFormStatus("ready");
    window.setTimeout(() => {
      window.location.href = `mailto:direktore@urvk.lt?subject=${subject}&body=${body}`;
    }, 120);
  };

  React.useEffect(() => {
    const root = pageRef.current;
    const line = heroLineRef.current;
    if (!root || !line) return;

    let cancelled = false;
    let revertAnimation = () => {};

    void Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const media = gsap.matchMedia();

      media.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };
          const titlePushLines = root.querySelectorAll<HTMLElement>(".title-push-line");

          if (isDesktop) {
            const footer = root.querySelector<HTMLElement>(".tt-footer");
            const footerCta = root.querySelector<HTMLElement>(".footer-cta");
            const footerReveal = root.querySelector<HTMLElement>(".footer-reveal");

            if (footer && footerCta && footerReveal) {
              ScrollTrigger.create({
                trigger: footerCta,
                start: "bottom bottom",
                end: "max",
                toggleClass: { targets: footerReveal, className: "is-revealed" },
              });
            }
          }

          if (reduceMotion) {
            titlePushLines.forEach((pushLine) => pushLine.style.removeProperty("width"));
            return;
          }

          const heroLabel = root.querySelector<HTMLElement>(".tt-hero-top > .section-label");
          const heroWords = root.querySelectorAll<HTMLElement>(".tt-hero-top h1 > span:not(.hero-title-break)");
          const heroBody = root.querySelector<HTMLElement>(".tt-hero-top > .body-large");
          const heroCta = root.querySelector<HTMLElement>(".tt-hero-top > .pill-button");
          const heroCard = root.querySelector<HTMLElement>(".hero-update-card");

          line.style.removeProperty("width");
          const targetWidth = line.getBoundingClientRect().width;
          line.style.width = "0px";

          const heroTimeline = gsap.timeline({
            defaults: { duration: 0.8, ease: "power3.out" },
          });

          if (heroLabel) {
            heroTimeline.fromTo(heroLabel, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.08);
          }

          heroTimeline.fromTo(
            heroWords,
            { y: isMobile ? 24 : 42, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.07 },
            0.16,
          );

          heroTimeline.to(
            line,
            {
              width: targetWidth,
              duration: 0.82,
              ease: "power3.inOut",
              clearProps: "width",
            },
            0.68,
          );

          if (heroBody) {
            heroTimeline.fromTo(heroBody, { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.5);
          }

          if (heroCta) {
            heroTimeline.fromTo(heroCta, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.6);
          }

          if (heroCard) {
            heroTimeline.fromTo(
              heroCard,
              { x: isDesktop ? 28 : 0, y: isMobile ? 18 : 0, autoAlpha: 0 },
              { x: 0, y: 0, autoAlpha: 1 },
              0.72,
            );
          }

          const revealSections = [
            {
              trigger: ".koops-bento-section",
              divider: ".koops-bento-header > .dashed-divider",
              headings: ".koops-bento-header > :not(.dashed-divider)",
              items: ".koops-bento-grid > *",
            },
            {
              trigger: ".tt-locations",
              headings: ".location-headline > :not(.title-push-line)",
              pushLine: ".location-headline > .title-push-line",
              items: ".location-grid > *, .section-cta",
            },
            {
              trigger: ".tt-news",
              divider: ".tt-section-header > .dashed-divider",
              headings: ".tt-section-header > :not(.dashed-divider)",
              items: ".news-bento > *",
            },
            {
              trigger: ".tt-story",
              headings: ".story-headline > *",
              items: ".story-grid > *",
            },
            {
              trigger: ".tt-jobs",
              headings: ".jobs-intro > *",
              items: ".job-row",
            },
            {
              trigger: ".tt-about",
              headings: ".about-marquee-header > *",
              items: ".about-marquee",
            },
            {
              trigger: ".tt-contact",
              headings: ".contact-heading > *",
              items: ".contact-details, .supplier-form, .contact-image",
            },
            {
              trigger: ".footer-cta",
              headings: ".footer-cta > :not(.orbit)",
              items: "",
            },
            {
              trigger: ".footer-content",
              headings: ".footer-grid > *",
              items: ".footer-bottom",
            },
          ];

          revealSections.forEach(({ trigger, divider, headings, pushLine, items }) => {
            const section = root.querySelector<HTMLElement>(trigger);
            if (!section) return;

            const dividerElements = divider ? section.querySelectorAll<HTMLElement>(divider) : [];
            const headingElements = section.querySelectorAll<HTMLElement>(headings);
            const pushLineElements = pushLine
              ? Array.from(section.querySelectorAll<HTMLElement>(pushLine))
              : [];
            const pushLineTargets = pushLineElements.map((pushLineElement) => {
              pushLineElement.style.removeProperty("width");
              const width = pushLineElement.getBoundingClientRect().width;
              pushLineElement.style.width = "0px";
              return { element: pushLineElement, width };
            });
            const itemElements = items ? section.querySelectorAll<HTMLElement>(items) : [];
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: isMobile ? "top 88%" : "top 82%",
                once: true,
              },
              defaults: { ease: "power3.out" },
            });

            if (dividerElements.length) {
              timeline.fromTo(
                dividerElements,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 1, duration: 0.72, ease: "power3.inOut" },
                0,
              );
            }

            if (headingElements.length) {
              timeline.fromTo(
                headingElements,
                { y: isMobile ? 20 : 28, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.72, stagger: 0.08 },
                dividerElements.length ? 0.18 : 0,
              );
            }

            pushLineTargets.forEach(({ element, width }) => {
              timeline.to(
                element,
                {
                  width,
                  duration: 0.82,
                  ease: "power3.inOut",
                  clearProps: "width",
                },
                0.55,
              );
            });

            if (itemElements.length) {
              timeline.fromTo(
                itemElements,
                { y: isMobile ? 24 : 40, scale: 0.985, autoAlpha: 0 },
                { y: 0, scale: 1, autoAlpha: 1, duration: 0.88, stagger: 0.1 },
                pushLineTargets.length ? 0.58 : headingElements.length ? 0.34 : 0,
              );
            }
          });

          if (isDesktop) {
            const parallaxImages = root.querySelectorAll<HTMLElement>(
              ".koops-bento-media img, .news-card-large > img, .contact-image img",
            );

            gsap.set(parallaxImages, { willChange: "transform" });

            parallaxImages.forEach((image) => {
              gsap.fromTo(
                image,
                { yPercent: -4, scale: 1.07 },
                {
                  yPercent: 4,
                  scale: 1.07,
                  ease: "none",
                  scrollTrigger: {
                    trigger: image.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                  },
                },
              );
            });
          }

          window.requestAnimationFrame(() => ScrollTrigger.refresh());
        },
        root,
      );

      revertAnimation = () => media.revert();
    });

    return () => {
      cancelled = true;
      revertAnimation();
    };
  }, []);

  React.useEffect(() => {
    if (heroUpdatesPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setHeroUpdateIndex((current) => (current + 1) % heroUpdates.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [heroUpdatesPaused]);

  const activeHeroUpdate = heroUpdates[heroUpdateIndex];

  return (
    <div className="site-shell" ref={pageRef}>
      <a className="skip-link" href="#turinys">Pereiti prie turinio</a>

      <header className="floating-nav" data-byq-adaptation="terra-tory-design-system-navigation">
        <div className="nav-shell">
          <div className="nav-left">
            <a className="brand" href="#pradzia" aria-label="KOOPS – į pradžią">
              <img src="/koops-logo.png" alt="KOOPS prekybos sistema" />
            </a>
            <span className="nav-divider" aria-hidden="true" />
            <nav className="desktop-nav" aria-label="Pagrindinė navigacija">
              <a href="#parduotuves"><span>Parduotuvės</span></a>
              <a href="#naujienos"><span>Naujienos</span></a>
              <a href="#restoranas"><span>Restoranas</span></a>
              <a href="#karjera"><span>Karjera</span></a>
              <a href="#tiekejams"><span>Tiekėjams</span></a>
              <a href="#apie"><span>Apie mus</span></a>
              <a href="#kontaktai"><span>Kontaktai</span></a>
            </nav>
          </div>
          <a className="pill-button dark nav-cta" href="#parduotuves" aria-label="Rasti parduotuvę">
            <RollingLabel>Rasti parduotuvę</RollingLabel>
          </a>
          <details className="mobile-menu">
            <summary aria-label="Atverti pagrindinį meniu"><span className="menu-hamburger" aria-hidden="true"><i /><i /></span></summary>
            <nav aria-label="Mobilioji navigacija">
              <a href="#parduotuves">Parduotuvės</a>
              <a href="#naujienos">Naujienos ir akcijos</a>
              <a href="#restoranas">Restoranas</a>
              <a href="#karjera">Karjera</a>
              <a href="#apie">Apie KOOPS</a>
              <a href="#tiekejams">Tiekėjams</a>
              <a href="#kontaktai">Kontaktai</a>
            </nav>
          </details>
        </div>
      </header>

      <main id="turinys">
        {/* BYQ: terra-tory-hero-1 adapted to KOOPS */}
        <section className="tt-hero" id="pradzia" data-byq-component="terra-tory-hero-1">
          <div className="tt-hero-background" aria-hidden="true">
            <img src="/koops-hero-market.jpg" alt="" />
          </div>
          <div className="tt-hero-overlay" aria-hidden="true" />
          <div className="tt-container tt-hero-stage">
            <div className="tt-hero-content">
              <div className="tt-hero-top">
                <p className="section-label light-label">UKMERGĖJE IR RAJONE</p>
                <h1>
                  <span>KOOPS</span>
                  <span>parduotuvės</span>
                  <span className="hero-title-break" aria-hidden="true" />
                  <i ref={heroLineRef} className="hero-headline-line title-push-line" style={{ width: 0 }} aria-hidden="true" />
                  <span>arčiau</span>
                  <span>jūsų.</span>
                </h1>
                <p className="body-large">Raskite artimiausią parduotuvę, jos darbo laiką ir maršrutą.</p>
                <a className="pill-button accent" href="#parduotuves" aria-label="Rasti artimiausią parduotuvę">
                  <RollingLabel>Rasti parduotuvę</RollingLabel>
                </a>
              </div>
            </div>
          </div>

          <aside
            className="hero-update-card"
            aria-label="Aktualios KOOPS naujienos"
            onMouseEnter={() => setHeroUpdatesPaused(true)}
            onMouseLeave={() => setHeroUpdatesPaused(false)}
            onFocusCapture={() => setHeroUpdatesPaused(true)}
            onBlurCapture={() => setHeroUpdatesPaused(false)}
          >
            <a className="hero-update-link" href={activeHeroUpdate.href} key={activeHeroUpdate.title}>
              <span className="hero-update-media">
                <img src={activeHeroUpdate.image} alt="" />
                <span className="hero-update-kicker">Aktualu</span>
              </span>
              <span className="hero-update-copy">
                <span className="section-label light-label">{activeHeroUpdate.label}</span>
                <strong>{activeHeroUpdate.title}</strong>
                <span className="hero-update-more text-link">Plačiau <span aria-hidden="true">→</span></span>
              </span>
            </a>
            <div className="hero-update-dots" aria-label="Pasirinkti aktualiją">
              {heroUpdates.map((item, index) => (
                <button
                  type="button"
                  className={index === heroUpdateIndex ? "is-active" : ""}
                  onClick={() => setHeroUpdateIndex(index)}
                  aria-label={`Rodyti: ${item.title}`}
                  aria-pressed={index === heroUpdateIndex}
                  key={item.title}
                />
              ))}
            </div>
          </aside>
        </section>

        <div className="tt-hero-spacer" aria-hidden="true" />

        <KoopsBentoSection />

        {/* BYQ: terra-tory-team-1 adapted to location cards */}
        <section className="tt-locations" id="parduotuves" aria-labelledby="parduotuviu-antraste" data-byq-component="terra-tory-team-1">
          <div className="tt-container">
            <div className="location-headline" id="parduotuviu-antraste">
              <span>Raskite</span><span>artimiausią</span><i className="title-push-line" style={{ width: 0 }} aria-hidden="true" /><span>KOOPS</span><span>parduotuvę</span>
            </div>
            <div className="location-grid">
              {stores.map((store) => (
                <article className="location-card" key={store.name}>
                  <a className="location-image" href={store.map} target="_blank" rel="noreferrer" aria-label={`Parduotuvė „${store.name}“ – atverti žemėlapyje`}>
                    <img src={store.image} alt={`Parduotuvė „${store.name}“`} />
                  </a>
                  <div className="location-info">
                    <div><h3>{store.name}</h3><p>{store.address}</p></div>
                    <dl>
                      <div><dt>Darbo laikas</dt><dd>{store.hours}</dd></div>
                      <div><dt>Telefonas</dt><dd><a href={`tel:${store.phoneHref}`}>{store.phone}</a></dd></div>
                    </dl>
                    <a className="text-link" href={store.map} target="_blank" rel="noreferrer">Rodyti žemėlapyje <span aria-hidden="true">→</span></a>
                  </div>
                </article>
              ))}
            </div>
            <a className="pill-button accent section-cta" href="https://ukmergeskoops.lt/parduotuves/">
              <RollingLabel>Visos parduotuvės</RollingLabel>
            </a>
          </div>
        </section>

        {/* BYQ: terra-tory-blog-grid-1 */}
        <section className="tt-news" id="naujienos" aria-labelledby="naujienu-antraste" data-byq-component="terra-tory-blog-grid-1">
          <div className="tt-container">
            <div className="tt-section-header">
              <div className="dashed-divider" />
              <p className="section-label">AKTUALU</p>
              <h2 id="naujienu-antraste">Naujienos ir akcijos</h2>
            </div>
            <div className="news-bento">
              <a className="news-card news-card-large" href="https://ukmergeskoops.lt/naujienos/">
                <img loading="lazy" src="/local-produce-couple.jpg" alt="Pirkėjai su vietos gamintojų produkcija" />
                <div>
                  <span className="section-label light-label">NAUJIENOS</span>
                  <h3>Vietos skoniai – arčiau jūsų</h3>
                  <p>Atraskite Ukmergės krašto gamintojų produkciją mūsų parduotuvėse.</p>
                  <span className="text-link">Skaityti <span aria-hidden="true">→</span></span>
                </div>
              </a>
              <a className="news-card news-card-accent" href="https://ukmergeskoops.lt/naujienos/">
                <div className="news-card-copy"><h3>Naujausi pasiūlymai kasdieniam krepšeliui</h3><span className="text-link">Peržiūrėti <span aria-hidden="true">→</span></span></div>
              </a>
              <a className="news-card news-card-muted" href="https://ukmergeskoops.lt/naujienos/">
                <div className="news-card-copy"><h3>Kas naujo KOOPS parduotuvėse?</h3><span className="text-link">Sužinoti <span aria-hidden="true">→</span></span></div>
              </a>
              <a className="news-card news-card-wide" href="https://ukmergeskoops.lt/naujienos/">
                <div className="news-card-copy"><h3>Naujienos iš Ukmergės krašto</h3><span className="text-link">Skaityti <span aria-hidden="true">→</span></span></div>
              </a>
            </div>
          </div>
        </section>

        {/* BYQ: terra-tory-combo-6 */}
        <section className="tt-story" id="restoranas" aria-labelledby="restorano-antraste" data-byq-component="terra-tory-combo-6">
          <div className="tt-container">
            <div className="story-headline">
              <p className="section-label light-label">RESTORANAS „VILKMERGĖ“ · NUO 1965 METŲ</p>
              <h2 id="restorano-antraste">Vieta jūsų šventėms, renginiams ir jaukiems susitikimams.</h2>
            </div>
            <div className="story-grid">
              <div className="story-image" role="region" aria-roledescription="karuselė" aria-label="Restorano „Vilkmergė“ nuotraukų galerija">
                <img
                  key={restaurantSlides[restaurantSlide].src}
                  src={restaurantSlides[restaurantSlide].src}
                  alt={restaurantSlides[restaurantSlide].alt}
                />
                <div className="story-gallery-controls">
                  <div className="story-gallery-dots" aria-label="Pasirinkti galerijos nuotrauką">
                    {restaurantSlides.map((slide, index) => (
                      <button
                        type="button"
                        className={index === restaurantSlide ? "is-active" : ""}
                        onClick={() => setRestaurantSlide(index)}
                        aria-label={`Rodyti ${index + 1} nuotrauką: ${slide.alt}`}
                        aria-pressed={index === restaurantSlide}
                        key={slide.src}
                      />
                    ))}
                  </div>
                  <div className="story-gallery-arrows">
                    <button
                      type="button"
                      onClick={() => setRestaurantSlide((slide) => (slide - 1 + restaurantSlides.length) % restaurantSlides.length)}
                      aria-label="Ankstesnė restorano nuotrauka"
                    >
                      <span className="control-arrow is-left"><ByqChevron /></span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRestaurantSlide((slide) => (slide + 1) % restaurantSlides.length)}
                      aria-label="Kita restorano nuotrauka"
                    >
                      <span className="control-arrow"><ByqChevron /></span>
                    </button>
                  </div>
                </div>
                <p className="sr-only" aria-live="polite">Nuotrauka {restaurantSlide + 1} iš {restaurantSlides.length}</p>
              </div>
              <div className="story-copy">
                <p>Pačiame Ukmergės centre įsikūręs restoranas tinka jubiliejams, vestuvėms, krikštynoms, oficialiems renginiams ir vakarienėms.</p>
                <dl><div><dt>Pokylių salės</dt><dd>3 salės</dd></div><div><dt>Talpa</dt><dd>Iki 154 svečių</dd></div></dl>
                <div className="story-actions">
                  <a className="pill-button accent" href="https://ukmergeskoops.lt/restoranas-vilkmerge/">
                    <RollingLabel>Apie restoraną</RollingLabel>
                  </a>
                  <a className="pill-button outline-light" href="tel:+37034053235" aria-label="Skambinti restoranui telefonu 0 340 53235">
                    <RollingLabel>Skambinti 0 340 53235</RollingLabel>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BYQ Supply: structured-data-2 careers list, adapted to KOOPS */}
        <section className="tt-jobs" id="karjera" aria-labelledby="karjeros-antraste" data-byq-component="structured-data-2-careers">
          <div className="tt-container jobs-layout">
            <div className="jobs-intro">
              <p className="section-label light-label">KARJERA</p>
              <h2 id="karjeros-antraste">Darbas arti namų</h2>
              <p>Prisijunkite prie KOOPS komandos Ukmergėje ir rajone. Susipažinkite su šiuo metu siūlomomis darbo vietomis.</p>
              <a className="pill-button accent" href="https://ukmergeskoops.lt/skelbimai/">
                <RollingLabel>Visi darbo pasiūlymai</RollingLabel>
              </a>
            </div>
            <div className="jobs-list" aria-label="Naujausi darbo pasiūlymai">
              {jobs.map((job) => (
                <a className="job-row" href="https://ukmergeskoops.lt/skelbimai/" key={job.title}>
                  <div className="job-row-copy">
                    <h3>{job.title}</h3>
                    <div className="job-row-meta">
                      <span>{job.type}</span><span aria-hidden="true">•</span><span>{job.location}</span>
                    </div>
                  </div>
                  <span className="job-row-arrow" aria-hidden="true"><AvenirButtonArrow /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <KoopsValueFeaturesSection />

        {/* BYQ: terra-tory-contact-1 */}
        <section className="tt-contact" id="tiekejams" aria-labelledby="tiekeju-antraste" data-byq-component="terra-tory-contact-1">
          <div className="tt-container contact-grid">
            <div className="contact-content">
              <div className="contact-heading"><p className="section-label">TIEKĖJAMS</p><h2 id="tiekeju-antraste">Auginkime vietos pasiūlą kartu</h2><p>Ieškome patikimų gamintojų ir tiekėjų, norinčių pasiūlyti savo produkciją KOOPS pirkėjams.</p></div>
              <div className="contact-details">
                <div><strong>Adresas</strong><p>Vasario 16-osios g. 30<br />LT-20130 Ukmergė</p></div>
                <div><strong>El. paštas</strong><p><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a></p></div>
              </div>
              <form className="supplier-form" onSubmit={handleSupplierSubmit} noValidate aria-label="Tiekėjo pasiūlymo forma">
                {supplierFormStatus === "error" && Object.keys(supplierFormErrors).length > 0 ? (
                  <div className="supplier-form-alert is-error" role="alert" tabIndex={-1} ref={supplierErrorSummaryRef}>
                    <strong>Patikrinkite pažymėtus laukus</strong>
                    <ul>
                      {supplierFieldOrder.flatMap((field) => supplierFormErrors[field] ? [<li key={field}>{supplierFormErrors[field]}</li>] : [])}
                    </ul>
                  </div>
                ) : null}
                {supplierFormStatus === "ready" ? (
                  <div className="supplier-form-alert is-success" role="status">
                    <strong>Pasiūlymas paruoštas siųsti</strong>
                    <p>Patikrinkite paruoštą laišką ir patvirtinkite jo siuntimą.</p>
                  </div>
                ) : null}
                <div className="form-halves">
                  <label className={`form-field${supplierFormErrors.vardas ? " has-error" : ""}`} htmlFor="supplier-name">
                    <span>JŪSŲ VARDAS</span>
                    <input
                      id="supplier-name"
                      name="vardas"
                      type="text"
                      placeholder="Pvz., Antanas"
                      autoComplete="name"
                      aria-invalid={Boolean(supplierFormErrors.vardas)}
                      aria-describedby={supplierFormErrors.vardas ? "supplier-name-error" : undefined}
                      onChange={() => clearSupplierError("vardas")}
                      required
                    />
                    {supplierFormErrors.vardas ? <small className="field-error" id="supplier-name-error">{supplierFormErrors.vardas}</small> : null}
                  </label>
                  <label className={`form-field${supplierFormErrors.el_pastas ? " has-error" : ""}`} htmlFor="supplier-email">
                    <span>EL. PAŠTAS</span>
                    <input
                      id="supplier-email"
                      name="el_pastas"
                      type="email"
                      inputMode="email"
                      placeholder="Pvz., antanas@ukis.lt"
                      autoComplete="email"
                      aria-invalid={Boolean(supplierFormErrors.el_pastas)}
                      aria-describedby={supplierFormErrors.el_pastas ? "supplier-email-error" : undefined}
                      onChange={() => clearSupplierError("el_pastas")}
                      required
                    />
                    {supplierFormErrors.el_pastas ? <small className="field-error" id="supplier-email-error">{supplierFormErrors.el_pastas}</small> : null}
                  </label>
                </div>
                <label className={`form-field${supplierFormErrors.pasiulymas ? " has-error" : ""}`} htmlFor="supplier-proposal">
                  <span>PASIŪLYMAS</span>
                  <textarea
                    id="supplier-proposal"
                    name="pasiulymas"
                    rows={5}
                    placeholder="Nurodykite produktą, jo kilmę ir kaip galėtume su jumis susisiekti…"
                    aria-invalid={Boolean(supplierFormErrors.pasiulymas)}
                    aria-describedby={supplierFormErrors.pasiulymas ? "supplier-proposal-error" : undefined}
                    onChange={() => clearSupplierError("pasiulymas")}
                    required
                  />
                  {supplierFormErrors.pasiulymas ? <small className="field-error" id="supplier-proposal-error">{supplierFormErrors.pasiulymas}</small> : null}
                </label>
                <div className={`privacy-field${supplierFormErrors.privatumas ? " has-error" : ""}`}>
                  <span className="privacy-checkbox-control">
                    <input
                      className="privacy-checkbox-input"
                      id="supplier-privacy"
                      name="privatumas"
                      type="checkbox"
                      value="patvirtinta"
                      aria-invalid={Boolean(supplierFormErrors.privatumas)}
                      aria-describedby={supplierFormErrors.privatumas ? "supplier-privacy-error" : undefined}
                      onChange={() => clearSupplierError("privatumas")}
                      required
                    />
                    <span className="privacy-checkbox-mark" aria-hidden="true" />
                  </span>
                  <div className="privacy-consent-copy">
                    <label htmlFor="supplier-privacy">Patvirtinu, kad susipažinau su </label>
                    <a className="privacy-link" href="https://ukmergeskoops.lt/privatumo-politika/">privatumo politika</a>.
                    {supplierFormErrors.privatumas ? <small className="field-error" id="supplier-privacy-error">{supplierFormErrors.privatumas}</small> : null}
                  </div>
                </div>
                <button className="pill-button dark" type="submit"><RollingLabel>Siųsti pasiūlymą</RollingLabel></button>
              </form>
            </div>
            <div className="contact-image">
              <img className="contact-image-main" loading="lazy" src="/ukmerge-fields-2.jpg" alt="Lietuvos laukai ir kaimo sodybos" />
            </div>
          </div>
        </section>
      </main>

        {/* BYQ: terra-tory-footer-1 */}
      <footer className="tt-footer" id="kontaktai" data-byq-component="terra-tory-footer-1">
        <section className="footer-cta" aria-labelledby="footer-cta-title">
          <div className="orbit footer-orbit-one" aria-hidden="true" /><div className="orbit footer-orbit-two" aria-hidden="true" />
          <p className="section-label light-label">KOOPS</p>
          <h2 id="footer-cta-title">Parduotuvė gali būti<br />arčiau, nei manote</h2>
          <a className="pill-button accent" href="#parduotuves" aria-label="Rasti KOOPS parduotuvę"><RollingLabel>Rasti parduotuvę</RollingLabel></a>
        </section>
        <div className="footer-reveal">
          <div className="tt-container footer-content">
            <div className="footer-grid">
              <div className="footer-brand">
                <img src="/koops-logo.png" alt="KOOPS prekybos sistema" />
                <p>Arti miesto ir rajono žmonių kasdien.</p>
                <div className="footer-socials" aria-label="KOOPS socialiniai tinklai">
                  {socialLinks.map((social) => {
                    const SocialIcon = social.icon;
                    return (
                      <a
                        className="footer-social-link"
                        href={social.href}
                        key={social.label}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${social.label} – atidaroma naujame lange`}
                      >
                        <span className="footer-social-mark" aria-hidden="true"><SocialIcon /></span>
                        <span>{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
              <nav aria-label="Poraštės navigacija">
                <div><p className="section-label">PAGRINDINIAI</p><a href="#parduotuves">Parduotuvės</a><a href="#naujienos">Naujienos</a><a href="#restoranas">Restoranas</a><a href="#karjera">Karjera</a></div>
                <div><p className="section-label">KOOPERATYVAS</p><a href="#apie">Apie KOOPS</a><a href="#tiekejams">Tiekėjams</a><a href="https://ukmergeskoops.lt/kontaktai/">Kontaktai</a></div>
                <div><p className="section-label">KONTAKTAI</p><a href="tel:+37034053235">0 340 53235</a><a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a><a href="https://ukmergeskoops.lt/privatumo-politika/">Privatumo politika</a></div>
              </nav>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Ukmergės rajono vartotojų kooperatyvas</p>
              <a className="footer-back-to-top" href="#pradzia" aria-label="Grįžti į puslapio viršų">
                <span>Į puslapio viršų</span>
                <span className="footer-back-to-top-icon" aria-hidden="true">↑</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
