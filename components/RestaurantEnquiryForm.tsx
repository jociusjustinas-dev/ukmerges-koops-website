"use client";

import * as React from "react";
import { restaurantEventTypes } from "../lib/restaurant";
import { RestaurantDatePicker } from "./RestaurantDatePicker";
import { RestaurantSelect } from "./RestaurantSelect";
import { RollingLabel } from "./RollingLabel";

type FormErrors = Partial<Record<"vardas" | "telefonas" | "el_pastas" | "zinute" | "privatumas", string>>;

export function RestaurantEnquiryForm() {
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [sent, setSent] = React.useState(false);

  const clearError = (key: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next: FormErrors = {};

    const name = String(data.get("vardas") ?? "").trim();
    const phone = String(data.get("telefonas") ?? "").trim();
    const email = String(data.get("el_pastas") ?? "").trim();
    const message = String(data.get("zinute") ?? "").trim();
    const privacy = data.get("privatumas");

    if (!name) next.vardas = "Įveskite vardą.";
    if (!phone) next.telefonas = "Įveskite telefoną.";
    if (!email) next.el_pastas = "Įveskite el. paštą.";
    if (!message) next.zinute = "Trumpai aprašykite renginį.";
    if (!privacy) next.privatumas = "Reikalingas privatumo sutikimas.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSent(true);
    form.reset();
  };

  if (sent) {
    return (
      <div className="restaurant-form-success" role="status">
        <h3>Užklausa priimta</h3>
        <p>Tai demonstracinė koncepcija — tikroje svetainėje čia būtų patvirtinimas ir tolesnis kontaktas.</p>
        <button className="pill-button ghost" type="button" onClick={() => setSent(false)}>
          <RollingLabel>Siųsti dar kartą</RollingLabel>
        </button>
      </div>
    );
  }

  return (
    <form className="restaurant-form" onSubmit={onSubmit} noValidate>
      <div className="restaurant-form-grid">
        <label className={`form-field${errors.vardas ? " has-error" : ""}`} htmlFor="rest-name">
          <span>VARDAS</span>
          <input
            id="rest-name"
            name="vardas"
            type="text"
            autoComplete="name"
            placeholder="Pvz., Ona Petraitytė"
            aria-invalid={Boolean(errors.vardas)}
            onChange={() => clearError("vardas")}
            required
          />
          {errors.vardas ? <small className="field-error">{errors.vardas}</small> : null}
        </label>
        <label className={`form-field${errors.telefonas ? " has-error" : ""}`} htmlFor="rest-phone">
          <span>TELEFONAS</span>
          <input
            id="rest-phone"
            name="telefonas"
            type="tel"
            autoComplete="tel"
            placeholder="Pvz., +370 600 00000"
            aria-invalid={Boolean(errors.telefonas)}
            onChange={() => clearError("telefonas")}
            required
          />
          {errors.telefonas ? <small className="field-error">{errors.telefonas}</small> : null}
        </label>
        <label className={`form-field${errors.el_pastas ? " has-error" : ""}`} htmlFor="rest-email">
          <span>EL. PAŠTAS</span>
          <input
            id="rest-email"
            name="el_pastas"
            type="email"
            autoComplete="email"
            placeholder="Pvz., ona@pastas.lt"
            aria-invalid={Boolean(errors.el_pastas)}
            onChange={() => clearError("el_pastas")}
            required
          />
          {errors.el_pastas ? <small className="field-error">{errors.el_pastas}</small> : null}
        </label>
        <label className="form-field" htmlFor="rest-guests">
          <span>SVEČIŲ SKAIČIUS</span>
          <input id="rest-guests" name="sveciai" type="number" min={1} max={200} placeholder="Pvz., 60" />
        </label>
        <div className="form-field">
          <span>DATA</span>
          <RestaurantDatePicker id="rest-date" name="data" />
        </div>
        <div className="form-field">
          <span>RENGINIO TIPAS</span>
          <RestaurantSelect
            id="rest-type"
            name="tipas"
            options={restaurantEventTypes}
            placeholder="Pasirinkite"
          />
        </div>
      </div>
      <label className={`form-field${errors.zinute ? " has-error" : ""}`} htmlFor="rest-message">
        <span>ŽINUTĖ</span>
        <textarea
          id="rest-message"
          name="zinute"
          rows={4}
          placeholder="Trumpai apie renginį, salės poreikį ir pageidaujamą laiką…"
          aria-invalid={Boolean(errors.zinute)}
          onChange={() => clearError("zinute")}
          required
        />
        {errors.zinute ? <small className="field-error">{errors.zinute}</small> : null}
      </label>
      <div className={`privacy-field${errors.privatumas ? " has-error" : ""}`}>
        <span className="privacy-checkbox-control">
          <input
            className="privacy-checkbox-input"
            id="rest-privacy"
            name="privatumas"
            type="checkbox"
            value="patvirtinta"
            aria-invalid={Boolean(errors.privatumas)}
            onChange={() => clearError("privatumas")}
            required
          />
          <span className="privacy-checkbox-mark" aria-hidden="true" />
        </span>
        <div className="privacy-consent-copy">
          <label htmlFor="rest-privacy">Patvirtinu, kad susipažinau su </label>
          <a className="privacy-link" href="https://ukmergeskoops.lt/privatumo-politika/">
            privatumo politika
          </a>
          .
          {errors.privatumas ? <small className="field-error">{errors.privatumas}</small> : null}
        </div>
      </div>
      <button className="pill-button dark" type="submit">
        <RollingLabel>Siųsti užklausą</RollingLabel>
      </button>
    </form>
  );
}
