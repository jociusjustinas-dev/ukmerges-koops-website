"use client";

import * as React from "react";
import { socialLinks } from "../lib/site";
import { RollingLabel } from "./RollingLabel";

type SiteFooterProps = {
  showCta?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
  ctaAriaLabel?: string;
  ctaTitleDesktop?: [string, string];
  ctaTitleMobile?: [string, string, string];
};

export function SiteFooter({
  showCta = true,
  ctaHref = "/parduotuves",
  ctaLabel = "Rasti parduotuvę",
  ctaAriaLabel = "Rasti KOOPS parduotuvę",
  ctaTitleDesktop = ["Parduotuvė gali būti", "arčiau, nei manote"],
  ctaTitleMobile = ["Parduotuvė gali", "būti arčiau,", "nei manote"],
}: SiteFooterProps) {
  const footerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const footer = footerRef.current;
    const footerReveal = footer?.querySelector<HTMLElement>(".footer-reveal");
    if (!footer || !footerReveal) return;

    // Be CTA sticky reveal neveikia — footeris lieka įprastame sraute.
    if (!showCta) {
      footerReveal.classList.add("is-revealed");
      return;
    }

    const stickyReveal = window.matchMedia("(min-width: 992px) and (min-height: 720px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!stickyReveal || reduceMotion) {
      footerReveal.classList.add("is-revealed");
      return;
    }

    const triggerEl = footer.querySelector<HTMLElement>(".footer-cta");
    if (!triggerEl) {
      footerReveal.classList.add("is-revealed");
      return;
    }

    let cancelled = false;
    let revert = () => {};

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const showFooterReveal = () => footerReveal.classList.add("is-revealed");
      const hideFooterReveal = () => footerReveal.classList.remove("is-revealed");

      const trigger = ScrollTrigger.create({
        trigger: triggerEl,
        start: "bottom bottom",
        end: "max",
        onEnter: showFooterReveal,
        onEnterBack: showFooterReveal,
        onLeave: showFooterReveal,
        onLeaveBack: hideFooterReveal,
        onRefresh: (self) => {
          footerReveal.classList.toggle("is-revealed", window.scrollY >= self.start);
        },
      });

      revert = () => {
        hideFooterReveal();
        trigger.kill();
      };
    });

    return () => {
      cancelled = true;
      revert();
    };
  }, [showCta]);

  return (
    <footer
      ref={footerRef}
      className={`tt-footer${showCta ? "" : " is-no-cta"}`}
      id="kontaktai"
      data-byq-component="terra-tory-footer-1"
    >
      {showCta ? (
        <section className="footer-cta" aria-labelledby="footer-cta-title">
          <div className="orbit footer-orbit-one" aria-hidden="true" />
          <div className="orbit footer-orbit-two" aria-hidden="true" />
          <p className="section-label light-label">KOOPS</p>
          <h2 id="footer-cta-title">
            <span className="footer-title-desktop">
              {ctaTitleDesktop.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
            <span className="footer-title-mobile">
              {ctaTitleMobile.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </h2>
          <a className="pill-button accent" href={ctaHref} aria-label={ctaAriaLabel}>
            <RollingLabel>{ctaLabel}</RollingLabel>
          </a>
        </section>
      ) : null}
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
              <div>
                <p className="section-label">PAGRINDINIAI</p>
                <a href="/parduotuves">Parduotuvės</a>
                <a href="/naujienos">Naujienos</a>
                <a href="/restoranas">Restoranas</a>
                <a href="/karjera">Karjera</a>
              </div>
              <div>
                <p className="section-label">KOOPERATYVAS</p>
                <a href="/apie">Apie KOOPS</a>
                <a href="/tiekejams">Tiekėjams</a>
                <a href="/kontaktai">Kontaktai</a>
              </div>
              <div>
                <p className="section-label">KONTAKTAI</p>
                <a href="tel:+37034053235">0 340 53235</a>
                <a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a>
                <a href="https://ukmergeskoops.lt/privatumo-politika/">Privatumo politika</a>
              </div>
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
  );
}
