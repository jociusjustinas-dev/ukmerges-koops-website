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
  const overrides = new Set(section.overrides || []);
  if (overrides.has("eyebrow")) {
    setText(root.querySelector("[data-cms-field='eyebrow'], .section-label"), section.eyebrow);
  }
  if (overrides.has("title")) {
    setText(root.querySelector("[data-cms-field='title'], h1, h2, .location-headline"), section.title);
  }
  if (overrides.has("description")) {
    setText(
      root.querySelector(
        "[data-cms-field='description'], .body-large, .stores-directory-lead, .classifieds-directory-lead, p:not(.section-label)",
      ),
      section.description,
    );
  }

  const button = root.querySelector<HTMLAnchorElement>(
    "[data-cms-field='primary-link'], a.pill-button, a.text-link",
  );
  if (button && overrides.has("primaryUrl") && section.primaryUrl?.trim()) button.href = section.primaryUrl.trim();
  if (button && overrides.has("primaryLabel") && section.primaryLabel?.trim()) {
    const label = button.querySelector<HTMLElement>(".avenir-button-text") || button;
    label.textContent = section.primaryLabel.trim();
  }

  const image = root.querySelector<HTMLImageElement>("[data-cms-field='image'], img");
  if (image && overrides.has("imageUrl") && section.imageUrl?.trim()) image.src = section.imageUrl.trim();
}

type PreviewMessage = {
  source?: string;
  type?: string;
  sectionType?: string;
  changes?: Partial<CmsPageSection>;
  scroll?: boolean;
};

function postPreviewMessage(message: PreviewMessage) {
  const topWindow = window.top;
  if (!topWindow || topWindow === window) return;
  topWindow.postMessage({ source: "koops-cms-preview", ...message }, "*");
}

export function CmsPageController({ page, sections }: Props) {
  useLayoutEffect(() => {
    if (!sections?.length) return;
    const shell = document.querySelector<HTMLElement>(`[data-cms-page="${page}"]`);
    if (!shell) return;

    const editorMode = new URLSearchParams(window.location.search).get("koops-editor") === "1";

    const byType = new Map(sections.map((section, index) => [section.type, { section, index }]));
    const nodes = Array.from(shell.querySelectorAll<HTMLElement>("[data-cms-section]"));

    nodes.forEach((node) => {
      const entry = byType.get(node.dataset.cmsSection || "");
      node.hidden = !entry || (!entry.section.enabled && !editorMode);
      if (entry) {
        node.style.order = String(entry.index);
        applyContent(node, entry.section);
        if (editorMode && !node.classList.contains("tt-hero-spacer")) {
          node.classList.add("koops-cms-editable-section");
          node.classList.toggle("is-cms-disabled", !entry.section.enabled);
          node.dataset.cmsEditorLabel = entry.section.type;
        }
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

    if (!editorMode) return;

    document.documentElement.classList.add("koops-cms-preview");
    document.body.classList.add("koops-cms-preview");

    const editableNodes = nodes.filter((node) => node.classList.contains("koops-cms-editable-section"));
    let selectedType = "";

    const selectType = (sectionType: string, scroll = false) => {
      if (!sectionType) return;
      selectedType = sectionType;
      editableNodes.forEach((node) => {
        node.classList.toggle("is-cms-selected", node.dataset.cmsSection === sectionType);
      });
      const target = editableNodes.find((node) => node.dataset.cmsSection === sectionType);
      if (scroll && target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const section = event.target.closest<HTMLElement>(".koops-cms-editable-section");
      const interactive = event.target.closest("a, button, input, textarea, select, form");
      if (!section && !interactive) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const sectionType = section?.dataset.cmsSection || "";
      if (!sectionType) return;
      selectType(sectionType);
      postPreviewMessage({ type: "select-section", sectionType });
    };

    const onMessage = (event: MessageEvent<PreviewMessage>) => {
      const message = event.data;
      if (!message || message.source !== "koops-gutenberg-editor") return;

      if (message.type === "select-section" && message.sectionType) {
        selectType(message.sectionType, Boolean(message.scroll));
        return;
      }

      if (message.type !== "update-section" || !message.sectionType || !message.changes) return;
      const targets = editableNodes.filter((node) => node.dataset.cmsSection === message.sectionType);
      const changedFields = Object.keys(message.changes);
      targets.forEach((node) => {
        applyContent(node, {
          id: message.sectionType || "preview",
          type: message.sectionType || "",
          enabled: message.changes?.enabled !== false,
          ...message.changes,
          overrides: changedFields,
        });
        if (Object.prototype.hasOwnProperty.call(message.changes, "enabled")) {
          node.classList.toggle("is-cms-disabled", message.changes?.enabled === false);
        }
      });
      if (selectedType === message.sectionType) selectType(selectedType);
    };

    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("message", onMessage);
    postPreviewMessage({ type: "ready", sectionType: selectedType });

    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("message", onMessage);
      document.documentElement.classList.remove("koops-cms-preview");
      document.body.classList.remove("koops-cms-preview");
      editableNodes.forEach((node) => {
        node.classList.remove("koops-cms-editable-section", "is-cms-selected", "is-cms-disabled");
        delete node.dataset.cmsEditorLabel;
      });
    };
  }, [page, sections]);

  return null;
}
