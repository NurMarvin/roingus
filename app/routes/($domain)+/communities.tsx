/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { json, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import type { ListCommunitiesResponse } from "lemmy-js-client";

import CommunityIcon from "~/components/CommunityIcon";
import Sidebar from "~/components/Sidebar";

import { useSiteContext } from "~/contexts/SiteContext";

import { apiRequest } from "~/lib/api.server";

export async function loader({ params }: LoaderArgs) {
  const { communities } = await apiRequest<ListCommunitiesResponse>(
    `/community/list?limit=20`,
    params
  );

  return json({ communities });
}

export default function CommunitiesView() {
  const { base, domain } = useSiteContext();

  const { communities } = useLoaderData<typeof loader>();

  const urlPrefix = base ? "" : `/${domain}`;

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Communities
      </h1>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-3">
          <div className="grid grid-cols-2 gap-4">
            {communities.map((communityView) => (
              <Link
                to={`${urlPrefix}/c/${communityView.community.name}`}
                key={communityView.community.id}
                className="group flex items-center gap-4 p-4 rounded-md bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="flex-shrink-0">
                  <CommunityIcon
                    community={communityView.community}
                    className="w-12 h-12 bg-gray-100 dark:bg-gray-900 group-hover:bg-gray-200 dark:group-hover:bg-gray-800 transition-colors"
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {communityView.community.name}
                  </h2>
                  <p className="text-gray-500">
                    {communityView.community.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Sidebar />
      </div>
    </>
  );
}
