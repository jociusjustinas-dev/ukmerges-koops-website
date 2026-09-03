"use client";

import { useLayoutEffect } from "react";
import type { CmsPageSection } from "../lib/wordpress";

type Props = {
  page: string;
  sections?: CmsPageSection[];
};

function setText(target: Element | null, value?: string) {
  if (!target || !value?.trim()) return;
  target.textContent = value.trim();
  if (target.matches("h1, h2, .location-headline")) {
    (target as HTMLElement).style.whiteSpace = "pre-line";
  }
}

function applyContent(root: HTMLElement, section: CmsPageSection) {
  setText(root.querySelector("[data-cms-field='eyebrow'], .section-label"), section.eyebrow);
  setText(root.querySelector("[data-cms-field='title'], h1, h2, .location-headline"), section.title);
  setText(
    root.querySelector(
      "[data-cms-field='description'], .body-large, .stores-directory-lead, .classifieds-directory-lead, p:not(.section-label)",
    ),
    section.description,
  );

  const button = root.querySelector<HTMLAnchorElement>(
    "[data-cms-field='primary-link'], a.pill-button, a.text-link",
  );
  if (button && section.primaryUrl?.trim()) button.href = section.primaryUrl.trim();
  if (button && section.primaryLabel?.trim()) {
    const label = button.querySelector<HTMLElement>(".avenir-button-text") || button;
    label.textContent = section.primaryLabel.trim();
  }

  const image = root.querySelector<HTMLImageElement>("[data-cms-field='image'], img");
  if (image && section.imageUrl?.trim()) image.src = section.imageUrl.trim();
}

export function CmsPageController({ page, sections }: Props) {
  useLayoutEffect(() => {
    if (!sections?.length) return;
    const shell = document.querySelector<HTMLElement>(`[data-cms-page="${page}"]`);
    if (!shell) return;

    const byType = new Map(sections.map((section, index) => [section.type, { section, index }]));
    const nodes = Array.from(shell.querySelectorAll<HTMLElement>("[data-cms-section]"));

    nodes.forEach((node) => {
      const entry = byType.get(node.dataset.cmsSection || "");
      node.hidden = !entry || !entry.section.enabled;
      if (entry) {
        node.style.order = String(entry.index);
        applyContent(node, entry.section);
      }
    });

    const parents = new Set(nodes.map((node) => node.parentElement).filter(Boolean));
    parents.forEach((parent) => {
      if (!parent) return;
      const direct = Array.from(parent.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement && child.hasAttribute("data-cms-section"),
      );
      if (direct.length < 2) return;
      direct
        .sort((a, b) => Number(a.style.order || 999) - Number(b.style.order || 999))
        .forEach((node) => parent.appendChild(node));
    });
  }, [page, sections]);

  return null;
}
