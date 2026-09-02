"use client";

import * as React from "react";

const WEEKDAYS = ["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"] as const;
const MONTHS = [
  "Sausis",
  "Vasaris",
  "Kovas",
  "Balandis",
  "Gegužė",
  "Birželis",
  "Liepa",
  "Rugpjūtis",
  "Rugsėjis",
  "Spalis",
  "Lapkritis",
  "Gruodis",
] as const;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDisplay(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildDays(view: Date) {
  const first = startOfMonth(view);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: Array<{ date: Date; inMonth: boolean }> = [];

  for (let i = 0; i < startOffset; i += 1) {
    const date = new Date(view.getFullYear(), view.getMonth(), -startOffset + i + 1);
    cells.push({ date, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(view.getFullYear(), view.getMonth(), day), inMonth: true });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const last = cells[cells.length - 1]?.date ?? first;
    const date = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    cells.push({ date, inMonth: date.getMonth() === view.getMonth() });
  }
  return cells.slice(0, 42);
}

type Props = {
  id?: string;
  name?: string;
};

export function RestaurantDatePicker({ id = "rest-date", name = "data" }: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [view, setView] = React.useState(() => startOfMonth(new Date()));

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const days = React.useMemo(() => buildDays(view), [view]);
  const todayIso = toIso(new Date());

  const selectDay = (date: Date) => {
    const iso = toIso(date);
    setValue(iso);
    setView(startOfMonth(date));
    setOpen(false);
  };

  return (
    <div className="koops-date" ref={rootRef}>
      <input type="hidden" id={id} name={name} value={value} />
      <button
        type="button"
        className="koops-date-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-calendar`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={value ? "koops-date-value" : "koops-date-placeholder"}>
          {value ? formatDisplay(value) : "dd/mm/yyyy"}
        </span>
        <span className="koops-date-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          className="koops-date-popover"
          id={`${id}-calendar`}
          role="dialog"
          aria-label="Pasirinkite datą"
        >
          <div className="koops-date-header">
            <p className="koops-date-month">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </p>
            <div className="koops-date-nav">
              <button
                type="button"
                aria-label="Ankstesnis mėnuo"
                onClick={() =>
                  setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
                }
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Kitas mėnuo"
                onClick={() =>
                  setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
                }
              >
                ›
              </button>
            </div>
          </div>

          <div className="koops-date-weekdays" aria-hidden="true">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="koops-date-grid">
            {days.map(({ date, inMonth }) => {
              const iso = toIso(date);
              const selected = value === iso;
              const isToday = iso === todayIso;
              return (
                <button
                  key={iso + String(inMonth)}
                  type="button"
                  className={[
                    "koops-date-day",
                    inMonth ? "" : "is-muted",
                    selected ? "is-selected" : "",
                    isToday ? "is-today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => selectDay(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="koops-date-footer">
            <button type="button" onClick={() => setValue("")}>
              Išvalyti
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                selectDay(now);
              }}
            >
              Šiandien
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
