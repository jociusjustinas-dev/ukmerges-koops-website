"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { Map as LeafletMap, Marker } from "leaflet";
import type { Store, StoreArea } from "../lib/stores";
import { RollingLabel } from "./RollingLabel";
import "leaflet/dist/leaflet.css";

type AreaFilter = "visos" | StoreArea;

function matchesQuery(store: Store, query: string) {
  if (!query) return true;
  const haystack = `${store.name} ${store.city} ${store.address}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function shouldOpenInNewContext(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function StoresFinder({ stores }: { stores: Store[] }) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<AreaFilter>("visos");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<LeafletMap | null>(null);
  const markers = useRef<Record<string, Marker>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const visible = useMemo(
    () => stores.filter((store) => (area === "visos" || store.area === area) && matchesQuery(store, query)),
    [stores, area, query],
  );

  const previewStore = previewSlug ? stores.find((store) => store.slug === previewSlug) ?? null : null;

  const openPreview = (slug: string) => {
    setActiveSlug(slug);
    setPreviewSlug(slug);
  };

  const closePreview = () => setPreviewSlug(null);

  const handleStoreLinkClick = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (shouldOpenInNewContext(event)) return;
    event.preventDefault();
    openPreview(slug);
  };

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void import("leaflet").then((leaflet) => {
      if (cancelled || !mapRef.current || mapInstance.current) return;
      const L = leaflet.default;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([55.25, 24.76], 10);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OSM</a> · <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      const zoomIn = mapRef.current.querySelector(".leaflet-control-zoom-in");
      const zoomOut = mapRef.current.querySelector(".leaflet-control-zoom-out");
      if (zoomIn) {
        zoomIn.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1v12M1 7h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      }
      if (zoomOut) {
        zoomOut.innerHTML =
          '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      }

      mapInstance.current = map;

      const pinSvg =
        '<svg class="store-pin-icon" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6.48 1 2 5.48 2 11c0 7.28 8.4 18.62 9.05 19.48a1.2 1.2 0 0 0 1.9 0C13.6 29.62 22 18.28 22 11 22 5.48 17.52 1 12 1z"/><circle cx="12" cy="11" r="3.25"/></svg>';

      stores.forEach((store) => {
        const label = store.name.replace(/"/g, "&quot;");
        const marker = L.marker([store.lat, store.lng], {
          icon: L.divIcon({
            className: "store-pin",
            html: `<button type="button" class="store-pin-btn" aria-label="${label}">${pinSvg}</button>`,
            iconSize: [28, 38],
            iconAnchor: [14, 36],
          }),
        }).addTo(map);

        marker.on("click", () => openPreview(store.slug));
        markers.current[store.slug] = marker;
      });

      const bounds = L.latLngBounds(stores.map((store) => [store.lat, store.lng]));
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: 12 });
      requestAnimationFrame(() => map.invalidateSize());
      setMapReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [stores]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;

    Object.entries(markers.current).forEach(([slug, marker]) => {
      const isVisible = visible.some((store) => store.slug === slug);
      const el = marker.getElement();
      if (el) el.classList.toggle("is-hidden", !isVisible);
    });

    if (visible.length > 0) {
      void import("leaflet").then((leaflet) => {
        const bounds = leaflet.default.latLngBounds(visible.map((store) => [store.lat, store.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: visible.length === 1 ? 14 : 12 });
      });
    }
  }, [visible, mapReady]);

  useEffect(() => {
    Object.entries(markers.current).forEach(([slug, marker]) => {
      marker.getElement()?.classList.toggle("is-active", slug === activeSlug);
    });
    const map = mapInstance.current;
    const store = stores.find((item) => item.slug === activeSlug);
    if (map && store) {
      map.flyTo([store.lat, store.lng], 13, { duration: 0.45 });
      if (window.matchMedia("(max-width: 991px)").matches && !previewSlug) {
        mapRef.current?.closest(".stores-finder-map-col")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeSlug, stores, previewSlug]);

  useEffect(() => {
    if (!activeSlug || previewSlug) return;
    const card = listRef.current?.querySelector(`[data-store="${activeSlug}"]`);
    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeSlug, previewSlug]);

  useEffect(() => {
    if (!previewStore) return;

    lastFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };
    document.addEventListener("keydown", onKeyDown);
    document.documentElement.classList.add("store-drawer-open");

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("store-drawer-open");
      lastFocusRef.current?.focus();
    };
  }, [previewStore]);

  return (
    <div className="stores-finder">
      <div className="stores-finder-toolbar">
        <label className="stores-finder-search">
          <span className="sr-only">Ieškoti parduotuvės</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ukmergė, Deltuva, gatvė…"
            autoComplete="off"
            enterKeyHint="search"
          />
          {query ? (
            <button
              type="button"
              className="stores-finder-search-clear"
              aria-label="Išvalyti paiešką"
              onClick={() => setQuery("")}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path
                  d="M3 3l6 6M9 3L3 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </label>
        <div className="stores-finder-filters" role="group" aria-label="Filtruoti pagal vietą">
          {(
            [
              ["visos", "Visos"],
              ["miestas", "Ukmergė"],
              ["rajonas", "Rajonas"],
            ] as const
          ).map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={area === value ? "is-active" : ""}
              aria-pressed={area === value}
              onClick={() => setArea(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="stores-finder-count">{visible.length} iš {stores.length}</p>
      </div>

      <div className="stores-finder-split">
        <div className="stores-finder-list" ref={listRef}>
          {visible.length === 0 ? (
            <p className="stores-finder-empty">Tokios parduotuvės neradome. Pabandykite kitą vietovę.</p>
          ) : (
            visible.map((store) => (
              <article
                className={`stores-finder-card${activeSlug === store.slug ? " is-active" : ""}`}
                key={store.slug}
                data-store={store.slug}
              >
                <a
                  className={`stores-finder-image${store.image ? "" : " is-placeholder"}`}
                  href={`/parduotuves/${store.slug}`}
                  aria-label={`Parduotuvė „${store.name}“ – greita peržiūra`}
                  onClick={(event) => handleStoreLinkClick(event, store.slug)}
                >
                  {store.image ? (
                    <img src={store.image} alt={`Parduotuvė „${store.name}“`} />
                  ) : (
                    <img className="store-cover-logo" src="/koops-logo.png" alt="" />
                  )}
                </a>
                <div className="stores-finder-info">
                  <div className="stores-finder-title-row">
                    <h2>
                      <a
                        href={`/parduotuves/${store.slug}`}
                        onClick={(event) => handleStoreLinkClick(event, store.slug)}
                      >
                        {store.name}
                      </a>
                    </h2>
                    <span>{store.city}</span>
                  </div>
                  <p className="stores-finder-address">{store.address}</p>
                  <dl className="stores-finder-facts">
                    <div>
                      <dt>Darbo laikas</dt>
                      <dd>{store.hours}</dd>
                    </div>
                    <div>
                      <dt>Telefonas</dt>
                      <dd>
                        <a href={`tel:${store.phoneHref}`}>{store.phone}</a>
                        {store.extraPhone && store.extraPhoneHref ? (
                          <>
                            {" · "}
                            <a href={`tel:${store.extraPhoneHref}`}>{store.extraPhone}</a>
                          </>
                        ) : null}
                      </dd>
                    </div>
                  </dl>
                  <div className="stores-finder-actions">
                    <a
                      className="text-link"
                      href={`/parduotuves/${store.slug}`}
                      onClick={(event) => handleStoreLinkClick(event, store.slug)}
                    >
                      Apie parduotuvę <span aria-hidden="true">→</span>
                    </a>
                    <button type="button" className="text-link" onClick={() => openPreview(store.slug)}>
                      Rodyti žemėlapyje <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="stores-finder-map-col">
          <div className="stores-finder-map-wrap">
            <div ref={mapRef} className="stores-finder-map" data-lenis-prevent aria-label="KOOPS parduotuvių žemėlapis" />
          </div>
        </aside>
      </div>

      {portalReady
        ? createPortal(
            <div
              className={`store-drawer-root${previewStore ? " is-open" : ""}`}
              aria-hidden={previewStore ? undefined : true}
            >
              <button
                type="button"
                className="store-drawer-backdrop"
                tabIndex={previewStore ? 0 : -1}
                aria-label="Uždaryti parduotuvės peržiūrą"
                onClick={closePreview}
              />
              <aside
                className="store-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby={previewStore ? "store-drawer-title" : undefined}
                data-lenis-prevent
              >
                {previewStore ? (
                  <>
                    <div className="store-drawer-top">
                      <p className="section-label light-label">PARDUOTUVĖ</p>
                      <button
                        type="button"
                        className="store-drawer-close"
                        ref={closeButtonRef}
                        aria-label="Uždaryti"
                        onClick={closePreview}
                      >
                        <svg width="14" height="14" viewBox="0 0 12 12" aria-hidden="true">
                          <path
                            d="M3 3l6 6M9 3L3 9"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className={`store-drawer-media${previewStore.image ? "" : " is-placeholder"}`}>
                      {previewStore.image ? (
                        <img src={previewStore.image} alt={`Parduotuvė „${previewStore.name}“`} />
                      ) : (
                        <img className="store-cover-logo" src="/koops-logo.png" alt="" />
                      )}
                    </div>

                    <div className="store-drawer-body">
                      <p className="store-drawer-city">{previewStore.city}</p>
                      <h2 id="store-drawer-title">Parduotuvė „{previewStore.name}“</h2>

                      <dl className="store-drawer-facts">
                        <div>
                          <dt>Adresas</dt>
                          <dd>{previewStore.address}</dd>
                        </div>
                        <div>
                          <dt>Darbo laikas</dt>
                          <dd>{previewStore.hours}</dd>
                        </div>
                        <div>
                          <dt>Telefonas</dt>
                          <dd>
                            <a href={`tel:${previewStore.phoneHref}`}>{previewStore.phone}</a>
                            {previewStore.extraPhone && previewStore.extraPhoneHref ? (
                              <>
                                {" · "}
                                <a href={`tel:${previewStore.extraPhoneHref}`}>{previewStore.extraPhone}</a>
                              </>
                            ) : null}
                          </dd>
                        </div>
                      </dl>

                      {previewStore.services.length > 0 ? (
                        <div className="store-drawer-services">
                          <p className="section-label light-label">PASLAUGOS</p>
                          <ul>
                            {previewStore.services.map((service) => (
                              <li key={service}>{service}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      <div className="store-drawer-actions">
                        <a
                          className="pill-button accent"
                          href={previewStore.map}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Maršrutas į „${previewStore.name}“ Google Maps`}
                        >
                          <RollingLabel>Maršrutas Google Maps</RollingLabel>
                        </a>
                      </div>
                    </div>
                  </>
                ) : null}
              </aside>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
