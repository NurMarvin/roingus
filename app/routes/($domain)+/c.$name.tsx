/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { GetCommunityResponse, GetPostsResponse } from "lemmy-js-client";

import { format } from "date-fns";

import Image from "~/components/Image";
import Sidebar from "~/components/Sidebar";

import PostList from "~/features/posts/containers/PostList";

import { apiRequest } from "~/lib/api.server";

import CommunityIcon from "~/components/CommunityIcon";
import { getDateLocale } from "~/lib/utils";

export async function loader({ request, params }: LoaderArgs) {
  const { name } = params;

  const communitySearchParams = new URLSearchParams();

  communitySearchParams.set("name", name as string);

  const {
    community_view: { community, counts },
  } = await apiRequest<GetCommunityResponse>(
    `/community?${communitySearchParams}`,
    params
  );

  const postSearchParams = new URLSearchParams();

  postSearchParams.set("community_name", community.name);
  postSearchParams.set("limit", "20");

  const { posts } = await apiRequest<GetPostsResponse>(
    `/post/list?${postSearchParams}`,
    params
  );

  const creationDay = new Date(community.published);
  const locale = getDateLocale(request);

  return json({
    community,
    counts,
    created: {
      exact: format(creationDay, "PPpp", {
        locale,
      }),
      relative: format(creationDay, "MMMM d, yyyy", {
        locale,
      }),
      iso: creationDay.toISOString(),
    },
    posts,
  });
}

export default function CommunityView() {
  const { community, created, counts, posts } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-col gap-4">
        {community.banner && (
          <div className="relative h-48">
            <Image
              src={community.banner}
              alt={`${community.title}'s banner`}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        )}

        <div className="flex flex-row items-center gap-4">
          <CommunityIcon community={community} className="w-24 h-24" />

          <div className="flex flex-col gap-1">
            <h1 className="flex items-center text-3xl font-bold text-gray-800 dark:text-gray-200">
              {community.title}
            </h1>
            <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <a
                href={community.actor_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                !{community.name}
              </a>
            </h2>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-gray-600 dark:text-gray-400">Created</span>
            <span className="text-gray-800 dark:text-gray-200">
              <time dateTime={created.iso} title={created.exact}>
                {created.relative}
              </time>
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-600 dark:text-gray-400">Posts</span>
            <span className="text-gray-800 dark:text-gray-200">
              {counts.posts}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-600 dark:text-gray-400">Comments</span>
            <span className="text-gray-800 dark:text-gray-200">
              {counts.comments}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-600 dark:text-gray-400">
              Subscribers
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {counts.subscribers}
            </span>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-8">
        Latest Posts
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <PostList posts={posts} />

        <Sidebar />
      </div>
    </>
  );
}
