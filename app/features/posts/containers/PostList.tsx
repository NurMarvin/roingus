/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { PostView } from "lemmy-js-client";

import PostCard from "../components/PostCard";

type PostListProps = {
  posts: PostView[];
};

export default function PostList({ posts }: PostListProps) {
  return (
    <ul className="flex flex-col gap-4 col-span-3">
      {posts.map((postView) => (
        <PostCard postView={postView} key={postView.post.id} />
      ))}
    </ul>
  );
}
