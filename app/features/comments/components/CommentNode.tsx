/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { Link } from "@remix-run/react";

import type { CommentView } from "lemmy-js-client";

import { format, formatDistance } from "date-fns";

import Avatar from "~/components/Avatar";

import { useSiteContext } from "~/contexts/SiteContext";

import { getDisplayName, getUsername } from "~/lib/utils";

type CommentNodeProps = {
  commentView: CommentView;
};

export default function CommentNode({ commentView }: CommentNodeProps) {
  const { base, domain } = useSiteContext();

  const publicationDateDistance = formatDistance(
    new Date(commentView.post.published),
    new Date(),
    {
      addSuffix: true,
    }
  );
  const publicationDate = format(new Date(commentView.post.published), "PPpp");

  const urlPrefix = base ? "" : `/${domain}`;

  return (
    <li className="flex flex-col gap-2">
      {/* Author */}
      <div className="flex items-center gap-2">
        <Link
          to={`${urlPrefix}/u/${getUsername(commentView.creator)}`}
          className="inline-flex items-center gap-2 text-blue-500 hover:underline"
        >
          <Avatar person={commentView.creator} className="w-6 h-6" />
          {getDisplayName(commentView.creator)}
        </Link>
        <span className="text-gray-500">•</span>
        <time
          className="text-gray-500"
          dateTime={commentView.comment.published}
          title={publicationDate}
        >
          {publicationDateDistance}
        </time>
      </div>
      <p className="text-gray-800 dark:text-gray-100">
        {commentView.comment.content}
      </p>
    </li>
  );
}
