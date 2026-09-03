"use client";

import * as React from "react";
import type { WordPressOptions } from "../lib/wordpress";

const CmsContext = React.createContext<WordPressOptions>({});

export function CmsProvider({ options, children }: { options: WordPressOptions; children: React.ReactNode }) {
  return <CmsContext.Provider value={options}>{children}</CmsContext.Provider>;
}

export function useCmsOptions() {
  return React.useContext(CmsContext);
}
