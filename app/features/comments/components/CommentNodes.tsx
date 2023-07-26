/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { CommentView } from "lemmy-js-client";

import CommentNode from "./CommentNode";

type CommentNodesProps = {
  comments: CommentView[];
};

export default function CommentNodes({ comments }: CommentNodesProps) {
  return (
    <ul className="flex flex-col gap-8">
      {comments.map((commentView) => (
        <CommentNode key={commentView.comment.id} commentView={commentView} />
      ))}

      {comments.length === 0 && (
        <p className="text-gray-800 dark:text-gray-100">No comments yet.</p>
      )}
    </ul>
  );
}
