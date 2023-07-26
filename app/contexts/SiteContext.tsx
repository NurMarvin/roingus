/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */

import { createContext, useContext } from "react";

import type { GetSiteResponse } from "lemmy-js-client";

type SiteContextType = {
  site: GetSiteResponse;
  base: boolean;
  domain: string;
};

const SiteContext = createContext<SiteContextType | null>(null);

type SiteContextProviderProps = {
  children: React.ReactNode;
  site: GetSiteResponse;
  base: boolean;
};

export function SiteContextProvider({
  children,
  site,
  base,
}: SiteContextProviderProps) {
  const url = new URL(site.site_view.site.actor_id);

  const domain = url.hostname;

  return (
    <SiteContext.Provider
      value={{
        site,
        base,
        domain,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteContext() {
  const context = useContext(SiteContext);

  if (!context) {
    throw new Error("useSiteContext must be used within a SiteContextProvider");
  }

  return context;
}
