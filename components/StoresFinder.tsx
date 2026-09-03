"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { Map as MapboxMap, Marker, StyleSpecification } from "mapbox-gl";
import type { Store, StoreArea } from "../lib/stores";
import { RollingLabel } from "./RollingLabel";
import "mapbox-gl/dist/mapbox-gl.css";

type AreaFilter = "visos" | StoreArea;

const MOBILE_BATCH = 10;
const MOBILE_MQ = "(max-width: 767px)";
const subscribeToMobileViewport = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(MOBILE_MQ);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};
const getMobileViewportSnapshot = () => window.matchMedia(MOBILE_MQ).matches;
const subscribeToClient = () => () => {};
const FALLBACK_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      ],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    },
  },
  layers: [{ id: "carto", type: "raster", source: "carto" }],
};

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
  const [mapRequested, setMapRequested] = useState(false);
  const [mapUnavailable, setMapUnavailable] = useState(false);
  const portalReady = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const isMobile = useSyncExternalStore(subscribeToMobileViewport, getMobileViewportSnapshot, () => false);
  const [shownCount, setShownCount] = useState(MOBILE_BATCH);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapboxMap | null>(null);
  const markers = useRef<Record<string, Marker>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const visible = useMemo(
    () => stores.filter((store) => (area === "visos" || store.area === area) && matchesQuery(store, query)),
    [stores, area, query],
  );

  const displayed = isMobile ? visible.slice(0, shownCount) : visible;
  const hasMore = isMobile && shownCount < visible.length;
  const revealMore = () => {
    setShownCount((current) => Math.min(current + MOBILE_BATCH, visible.length));
  };

  const previewStore = previewSlug ? stores.find((store) => store.slug === previewSlug) ?? null : null;

  const openPreview = (slug: string) => {
    setMapRequested(true);
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
    if (!mapRequested) return;
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    const retryTimers: number[] = [];
    const resizeRetries = [0, 50, 150, 400, 800];

    const scheduleResize = (map: MapboxMap) => {
      const run = () => {
        if (cancelled || mapInstance.current !== map) return;
        map.resize();
      };
      requestAnimationFrame(() => {
        run();
        requestAnimationFrame(run);
      });
      resizeRetries.forEach((ms) => {
        retryTimers.push(window.setTimeout(run, ms));
      });
    };

    const onViewportChange = () => {
      mapInstance.current?.resize();
    };

    void import("mapbox-gl").then((mapboxgl) => {
      if (cancelled || !mapRef.current || mapInstance.current) return;
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!accessToken) {
        console.error("Trūksta NEXT_PUBLIC_MAPBOX_TOKEN aplinkos kintamojo.");
        setMapUnavailable(true);
        return;
      }
      const supportsMapbox = (mapboxgl as unknown as { supported?: () => boolean }).supported;
      if (supportsMapbox && !supportsMapbox()) {
        setMapUnavailable(true);
        return;
      }

      let map: MapboxMap;
      try {
        map = new mapboxgl.Map({
          container: mapRef.current,
          style: "mapbox://styles/mapbox/light-v11",
          center: [24.76, 55.25],
          zoom: 9.5,
          accessToken,
          scrollZoom: false,
          attributionControl: true,
        });
      } catch {
        setMapUnavailable(true);
        return;
      }
      let fallbackApplied = false;
      map.on("error", (event) => {
        const mapError = event.error as Error & { status?: number };
        if (mapError.status === 401 || mapError.status === 403) {
          if (!fallbackApplied) {
            fallbackApplied = true;
            map.setStyle(FALLBACK_MAP_STYLE);
          }
          return;
        }
        console.error("Mapbox:", mapError.message || `HTTP ${mapError.status ?? "klaida"}`);
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      mapInstance.current = map;

      const pinSvg =
        '<svg class="store-pin-icon" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C6.48 1 2 5.48 2 11c0 7.28 8.4 18.62 9.05 19.48a1.2 1.2 0 0 0 1.9 0C13.6 29.62 22 18.28 22 11 22 5.48 17.52 1 12 1z"/><circle cx="12" cy="11" r="3.25"/></svg>';

      stores.forEach((store) => {
        const markerElement = document.createElement("div");
        markerElement.className = "store-pin";
        const markerButton = document.createElement("button");
        markerButton.type = "button";
        markerButton.className = "store-pin-btn";
        markerButton.setAttribute("aria-label", store.name);
        markerButton.innerHTML = pinSvg;
        markerButton.addEventListener("click", () => openPreview(store.slug));
        markerElement.append(markerButton);

        const marker = new mapboxgl.Marker({ element: markerElement, anchor: "bottom" })
          .setLngLat([store.lng, store.lat])
          .addTo(map);
        markers.current[store.slug] = marker;
      });

      const lngs = stores.map((store) => store.lng);
      const lats = stores.map((store) => store.lat);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 32, maxZoom: 12, duration: 0 },
      );

      const container = mapRef.current;
      if (typeof ResizeObserver !== "undefined" && container) {
        resizeObserver = new ResizeObserver(() => {
          map.resize();
        });
        resizeObserver.observe(container);
      }

      window.addEventListener("resize", onViewportChange);
      window.addEventListener("orientationchange", onViewportChange);
      scheduleResize(map);
      map.once("load", () => {
        if (!cancelled) setMapReady(true);
      });

      if (cancelled) {
        window.removeEventListener("resize", onViewportChange);
        window.removeEventListener("orientationchange", onViewportChange);
        retryTimers.forEach((timer) => window.clearTimeout(timer));
        resizeObserver?.disconnect();
        resizeObserver = null;
        map.remove();
        mapInstance.current = null;
        markers.current = {};
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      resizeObserver?.disconnect();
      resizeObserver = null;
      const map = mapInstance.current;
      if (map) {
        map.remove();
        mapInstance.current = null;
      }
      markers.current = {};
    };
  }, [stores, mapRequested]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapReady) return;

    const visibleSlugs = new Set(visible.map((store) => store.slug));
    Object.entries(markers.current).forEach(([slug, marker]) => {
      const isVisible = visibleSlugs.has(slug);
      const el = marker.getElement();
      if (el) el.classList.toggle("is-hidden", !isVisible);
    });

    if (visible.length > 0) {
      if (visible.length === 1) {
        map.easeTo({ center: [visible[0].lng, visible[0].lat], zoom: 14, duration: 500 });
      } else {
        const lngs = visible.map((store) => store.lng);
        const lats = visible.map((store) => store.lat);
        map.fitBounds(
          [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
          ],
          { padding: 40, maxZoom: 12, duration: 500 },
        );
      }
    }
  }, [visible, mapReady]);

  useEffect(() => {
    Object.entries(markers.current).forEach(([slug, marker]) => {
      marker.getElement()?.classList.toggle("is-active", slug === activeSlug);
    });
    const map = mapInstance.current;
    const store = stores.find((item) => item.slug === activeSlug);
    if (map && store) {
      map.flyTo({ center: [store.lng, store.lat], zoom: 13, duration: 450, essential: true });
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
            onChange={(event) => {
              setQuery(event.target.value);
              setShownCount(MOBILE_BATCH);
            }}
            placeholder="Ukmergė, Deltuva, gatvė…"
            autoComplete="off"
            enterKeyHint="search"
          />
          {query ? (
            <button
              type="button"
              className="stores-finder-search-clear"
              aria-label="Išvalyti paiešką"
              onClick={() => {
                setQuery("");
                setShownCount(MOBILE_BATCH);
              }}
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
              onClick={() => {
                setArea(value);
                setShownCount(MOBILE_BATCH);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="stores-finder-count" aria-live="polite">
          {isMobile && visible.length > 0
            ? `Rodoma ${displayed.length} iš ${visible.length}`
            : `${visible.length} iš ${stores.length}`}
        </p>
      </div>

      <div className="stores-finder-split">
        <div className="stores-finder-list" ref={listRef} id="stores-finder-list-items">
          {visible.length === 0 ? (
            <p className="stores-finder-empty">Tokios parduotuvės neradome. Pabandykite kitą vietovę.</p>
          ) : (
            <>
              {displayed.map((store) => (
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
              ))}
              {hasMore ? (
                <div className="stores-finder-more">
                  <button
                    type="button"
                    className="pill-button outline-light stores-finder-more-btn"
                    onClick={revealMore}
                    aria-controls="stores-finder-list-items"
                  >
                    <RollingLabel>Rodyti daugiau</RollingLabel>
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>

        <aside className="stores-finder-map-col">
          <div className="stores-finder-map-wrap">
            <div className="stores-finder-map-stage" role="region" aria-label="KOOPS parduotuvių žemėlapis">
              <div ref={mapRef} className="stores-finder-map" data-lenis-prevent />
              {!mapRequested ? (
                <button type="button" className="stores-finder-map-load" onClick={() => setMapRequested(true)}>
                  <span>Interaktyvus žemėlapis</span>
                  <strong>Rodyti žemėlapį</strong>
                </button>
              ) : mapUnavailable ? (
                <p className="stores-finder-map-status" role="status">
                  Žemėlapio rodyti nepavyko. Maršrutą atidarykite pasirinktos parduotuvės kortelėje.
                </p>
              ) : !mapReady ? (
                <p className="stores-finder-map-status" role="status">Žemėlapis kraunamas…</p>
              ) : null}
            </div>
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
