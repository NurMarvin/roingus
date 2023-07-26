/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { json, type V2_MetaArgs, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { GetCommentsResponse, GetPostResponse } from "lemmy-js-client";

import type { loader as siteLoader } from "../($domain)";

import Sidebar from "~/components/Sidebar";

import CommentNodes from "~/features/comments/components/CommentNodes";
import PostCard from "~/features/posts/components/PostCard";

import { apiRequest } from "~/lib/api.server";

export async function loader({ params }: LoaderArgs) {
  const { postId } = params;

  const postSearchParams = new URLSearchParams();

  postSearchParams.set("id", postId as string);

  const { post_view } = await apiRequest<GetPostResponse>(
    `/post?${postSearchParams}`,
    params
  );

  const commentsSearchParams = new URLSearchParams();

  commentsSearchParams.set("post_id", postId as string);

  const { comments } = await apiRequest<GetCommentsResponse>(
    `/comment/list?${commentsSearchParams}`,
    params
  );

  return json({
    post_view,
    comments,
  });
}

export function meta({
  data,
  matches,
}: V2_MetaArgs<typeof loader, { "routes/($domain)": typeof siteLoader }>) {
  if (!data) {
    return [];
  }

  const { post_view } = data;

  const title = `${post_view.post.name} - Lemmy`;

  const parent = matches.find((match) => match.id === "routes/($domain)");

  if (!parent) {
    throw new Error("No parent route found");
  }

  const favicon = parent.meta.find(
    (meta) => "rel" in meta && meta.rel === "icon"
  );

  const description = post_view.post.body || "";

  return [
    { title },
    {
      name: "description",
      content: description,
    },
    {
      name: "og:title",
      content: title,
    },
    {
      name: "og:description",
      content: description,
    },
    {
      name: "og:image",
      content: post_view.post.thumbnail_url,
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "twitter:description",
      content: description,
    },
    {
      name: "twitter:image",
      content: post_view.post.thumbnail_url,
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    favicon,
  ];
}

export default function PostView() {
  const { post_view, comments } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="grid grid-cols-4 gap-8">
        <div className="flex flex-col col-span-3">
          <PostCard postView={post_view} />

          <div id="comments" className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Comments
            </h2>
            <div className="mt-4">
              <CommentNodes comments={comments} />
            </div>
          </div>
        </div>

        <Sidebar />
      </div>
    </>
  );
}
