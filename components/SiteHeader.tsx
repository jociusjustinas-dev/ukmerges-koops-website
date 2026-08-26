"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { primaryNav, socialLinks } from "../lib/site";
import { RollingLabel } from "./RollingLabel";

export function SiteHeader({ variant = "transparent" }: { variant?: "transparent" | "solid" }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(variant === "solid");

  React.useEffect(() => {
    if (variant === "solid") {
      setScrolled(true);
      return;
    }

    let cancelled = false;
    let scrollTrigger: { kill: () => void } | null = null;

    const updateScrolled = () => setScrolled(window.scrollY > 32);
    updateScrolled();

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      updateScrolled();
      scrollTrigger = ScrollTrigger.create({
        start: 32,
        end: "max",
        onEnter: () => setScrolled(true),
        onEnterBack: () => setScrolled(true),
        onLeave: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
        onRefresh: updateScrolled,
      });
    });

    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", updateScrolled);
      scrollTrigger?.kill();
    };
  }, [variant]);

  return (
    <header className={`floating-nav${scrolled ? " is-scrolled" : ""}`} data-byq-adaptation="terra-tory-design-system-navigation">
      <div className="nav-shell">
        <div className="nav-left">
          <a className="brand" href="/" aria-label="KOOPS – į pradžią">
            <img src="/koops-logo.png" alt="KOOPS prekybos sistema" />
          </a>
          <span className="nav-divider" aria-hidden="true" />
          <nav className="desktop-nav" aria-label="Pagrindinė navigacija">
            {primaryNav.map((item) => (
              <a
                href={item.href}
                key={item.href}
                aria-current={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "page" : undefined}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <a className="pill-button dark nav-cta" href="/parduotuves" aria-label="Rasti parduotuvę">
          <RollingLabel>Rasti parduotuvę</RollingLabel>
        </a>
        <details className="mobile-menu">
          <summary aria-label="Atverti pagrindinį meniu"><span className="menu-hamburger" aria-hidden="true"><i /><i /></span></summary>
          <nav aria-label="Mobilioji navigacija">
            <div className="mobile-nav-links">
              {primaryNav.map((item) => (
                <a href={item.href} key={`mobile-${item.href}`}>{item.label}</a>
              ))}
            </div>
            <div className="mobile-nav-footer">
              <p className="section-label">SUSISIEKIME</p>
              <div className="mobile-nav-contact">
                <a href="tel:+37034053235">0 340 53235</a>
                <a href="mailto:direktore@urvk.lt">direktore@urvk.lt</a>
              </div>
              <div className="mobile-nav-socials" aria-label="KOOPS socialiniai tinklai">
                {socialLinks.map((social) => {
                  const SocialIcon = social.icon;
                  return (
                    <a href={social.href} key={social.label} target="_blank" rel="noreferrer" aria-label={social.label}>
                      <SocialIcon aria-hidden="true" />
                      <span>{social.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
