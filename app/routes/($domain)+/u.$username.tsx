/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { json, type V2_MetaArgs, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { GetPersonDetailsResponse } from "lemmy-js-client";

import { format } from "date-fns";

import Avatar from "~/components/Avatar";
import Image from "~/components/Image";
import Sidebar from "~/components/Sidebar";

import type { loader as siteLoader } from "../($domain)";

import PostList from "~/features/posts/containers/PostList";

import { apiRequest } from "~/lib/api.server";

import { getDateLocale, getDisplayName, getUsername } from "~/lib/utils";

export async function loader({ request, params }: LoaderArgs) {
  const { username } = params;

  const searchParams = new URLSearchParams();

  searchParams.set("username", username as string);

  const {
    person_view: { person, counts },
    posts,
  } = await apiRequest<GetPersonDetailsResponse>(
    `/user?${searchParams}`,
    params
  );

  const locale = getDateLocale(request);
  const cakeDay = new Date(person.published);

  return json({
    person,
    counts,
    cakeDay: {
      exact: format(cakeDay, "PPpp", {
        locale,
      }),
      relative: format(cakeDay, "MMMM d, yyyy", {
        locale,
      }),
      iso: cakeDay.toISOString(),
    },
    posts,
  });
}

export function meta({
  data,
  matches,
}: V2_MetaArgs<typeof loader, { "routes/($domain)": typeof siteLoader }>) {
  if (!data) {
    return [];
  }

  const { person } = data;

  const name = person.display_name || person.name;
  const title = `@${name} - Lemmy`;

  const parent = matches.find((match) => match.id === "routes/($domain)");

  if (!parent) {
    throw new Error("No parent route found");
  }

  const favicon = parent.meta.find(
    (meta) => "rel" in meta && meta.rel === "icon"
  );

  const description =
    person.bio ||
    parent.meta.find((meta) => "name" in meta && meta.name === "description");

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
      content: person.avatar,
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
      content: person.avatar,
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    favicon,
  ];
}

export default function UserView() {
  const { person, counts, cakeDay, posts } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex flex-col gap-4">
        {person.banner && (
          <div className="relative h-48">
            <Image
              src={person.banner}
              alt={`${getDisplayName(person)}'s banner`}
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        )}

        <div className="flex flex-row items-center gap-4">
          <Avatar person={person} className="w-24 h-24" />

          <div className="flex flex-col gap-1">
            <h1 className="flex items-center text-3xl font-bold text-gray-800 dark:text-gray-200">
              {getDisplayName(person)}

              {person.admin && (
                <span className="flex bg-red-500 text-red-100 text-xs px-2 py-1 rounded-full ml-2">
                  Admin
                </span>
              )}

              {person.bot_account && (
                <span className="flex bg-blue-500 text-blue-100 text-xs px-2 py-1 rounded-full ml-2">
                  Bot
                </span>
              )}
            </h1>
            <h2 className="text-xl font-bold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              <a
                href={person.actor_id}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{getUsername(person)}
              </a>
            </h2>
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-gray-600 dark:text-gray-400">Cake Day</span>
            <span className="text-gray-800 dark:text-gray-200">
              <time dateTime={cakeDay.iso} title={cakeDay.exact}>
                {cakeDay.relative}
              </time>
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-600 dark:text-gray-400">Posts</span>
            <span className="text-gray-800 dark:text-gray-200">
              {counts.post_count}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-600 dark:text-gray-400">Comments</span>
            <span className="text-gray-800 dark:text-gray-200">
              {counts.comment_count}
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
