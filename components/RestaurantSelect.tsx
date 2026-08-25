"use client";

import * as React from "react";

type Props = {
  id?: string;
  name?: string;
  options: readonly string[];
  placeholder?: string;
};

export function RestaurantSelect({
  id = "rest-type",
  name = "tipas",
  options,
  placeholder = "Pasirinkite",
}: Props) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

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

  const label = value || placeholder;

  return (
    <div className="koops-select" ref={rootRef}>
      <input type="hidden" id={id} name={name} value={value} />
      <button
        type="button"
        className="koops-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={value ? "koops-select-value" : "koops-select-placeholder"}>
          {label}
        </span>
        <span className={`koops-select-chevron${open ? " is-open" : ""}`} aria-hidden="true">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open ? (
        <ul
          className="koops-select-menu"
          id={`${id}-listbox`}
          role="listbox"
          aria-label="Renginio tipas"
        >
          {options.map((option) => {
            const selected = value === option;
            return (
              <li key={option} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`koops-select-option${selected ? " is-selected" : ""}`}
                  onClick={() => {
                    setValue(option);
                    setOpen(false);
                  }}
                >
                  <span className="koops-select-check" aria-hidden="true">
                    {selected ? "✓" : ""}
                  </span>
                  <span>{option}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
