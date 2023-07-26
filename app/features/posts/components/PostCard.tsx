/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { PostView } from "lemmy-js-client";

import { format, formatDistance } from "date-fns";

import { ArrowDown, ArrowUp, MessagesSquare } from "lucide-react";

import Avatar from "~/components/Avatar";
import CommunityIcon from "~/components/CommunityIcon";
import Image from "~/components/Image";

import { getDisplayName, getUsername } from "~/lib/utils";
import { useSiteContext } from "~/contexts/SiteContext";
import { Link } from "@remix-run/react";

type PostCardProps = {
  postView: PostView;
};

export default function PostCard({ postView }: PostCardProps) {
  const { base, domain } = useSiteContext();

  const publicationDateDistance = formatDistance(
    new Date(postView.post.published),
    new Date(),
    {
      addSuffix: true,
    }
  );
  const publicationDate = format(new Date(postView.post.published), "PPpp");

  let imageUrl = postView.post.thumbnail_url;

  if (!imageUrl && postView.post.url) {
    // Check if the post URL is a valid image
    const url = new URL(postView.post.url);

    if (url.pathname.match(/\.(png|jpe?g|gif|webp)$/i)) {
      imageUrl = postView.post.url;
    }
  }

  const urlPrefix = base ? "" : `/${domain}`;

  return (
    <li
      className="flex items-baseline bg-gray-200 dark:bg-gray-900 p-4 rounded-lg gap-4"
      data-post-id={postView.post.id}
    >
      {/* Upvote/Downvote */}
      <div className="flex flex-col items-center">
        <button className="p-2 text-gray-500 hover:text-blue-500">
          <ArrowUp className="w-6 h-6" />
        </button>
        <span className="text-center text-gray-500">
          {postView.counts.score}
        </span>
        <button className="p-2 text-gray-500 hover:text-blue-500">
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col flex-grow gap-2">
        <div className="flex items-center gap-2">
          <Link
            to={`${urlPrefix}/u/${getUsername(postView.creator)}`}
            className="inline-flex items-center gap-2 text-blue-500 hover:underline"
          >
            <Avatar person={postView.creator} className="w-6 h-6" />
            {getDisplayName(postView.creator)}
          </Link>
          <span className="text-gray-500">to</span>
          <Link
            to={`${urlPrefix}/c/${postView.community.name}`}
            className="inline-flex items-center gap-2 text-blue-500 hover:underline"
          >
            <CommunityIcon community={postView.community} className="w-6 h-6" />
            {postView.community.title}
          </Link>
          <span className="text-gray-500">•</span>
          <time
            className="text-gray-500"
            dateTime={postView.post.published}
            title={publicationDate}
          >
            {publicationDateDistance}
          </time>
        </div>

        <h1 className="text-xl font-bold mb-4">
          <Link
            to={`${urlPrefix}/post/${postView.post.id}`}
            className="text-blue-500 hover:underline"
          >
            {postView.post.name}
          </Link>
        </h1>

        <div className="flex flex-col gap-4">
          {postView.post.body && (
            <p className="text-gray-500 dark:text-gray-400">
              {postView.post.body}
            </p>
          )}

          {imageUrl && (
            <Image
              src={imageUrl}
              alt={imageUrl}
              className="rounded-lg max-h-96 mx-auto"
            />
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <a
            href={`/post/${postView.post.id}#comments`}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <MessagesSquare className="w-5 h-5" />
            <span>
              {postView.counts.comments} Comment
              {postView.counts.comments !== 1 && "s"}
            </span>
          </a>

          {/* <ShareButton post={postView.post} /> */}
        </div>
      </div>
    </li>
  );
}
