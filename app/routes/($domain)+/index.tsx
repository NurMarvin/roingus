/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { GetPostsResponse } from "lemmy-js-client";

import Sidebar from "~/components/Sidebar";

import PostList from "~/features/posts/containers/PostList";

import { apiRequest } from "~/lib/api.server";

export async function loader({ params }: LoaderArgs) {
  const { posts } = await apiRequest<GetPostsResponse>(
    "/post/list?limit=20",
    params
  );

  return json(posts);
}

export default function DomainHomepage() {
  const posts = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Latest Posts
      </h1>

      <div className="grid grid-cols-4 gap-8">
        <PostList posts={posts} />

        <Sidebar />
      </div>
    </>
  );
}
