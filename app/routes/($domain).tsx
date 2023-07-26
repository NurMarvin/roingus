/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { type LoaderArgs, json, type V2_MetaArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import type { GetSiteResponse } from "lemmy-js-client";

import Layout from "~/components/Layout";

import { SiteContextProvider } from "~/contexts/SiteContext";

import { apiRequest } from "~/lib/api.server";

export async function loader({ params }: LoaderArgs) {
  const site = await apiRequest<GetSiteResponse>("/site", params);

  return json({ site, base: params.domain === undefined });
}

export function meta({ data }: V2_MetaArgs<typeof loader>) {
  if (!data) {
    return [];
  }

  const {
    site: { site_view },
  } = data;

  const { name, description } = site_view.site;

  const title = `${name} - ${description}`;

  return [
    { title },
    { name: "description", content: description },
    {
      tagName: "link",
      rel: "icon",
      href: site_view.site.icon,
    },
  ];
}

export default function DomainSiteWrapper() {
  const { site, base } = useLoaderData<typeof loader>();

  return (
    <SiteContextProvider site={site} base={base}>
      <Layout>
        <Outlet />
      </Layout>
    </SiteContextProvider>
  );
}
