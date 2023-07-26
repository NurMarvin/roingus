/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { Community } from "lemmy-js-client";

import Image from "./Image";

import { cx } from "~/lib/utils";

export interface CommunityIconProps {
  community: Community;
  className?: string;
}

export default function CommunityIcon({
  community,
  className,
}: CommunityIconProps) {
  return (
    <Image
      src={community.icon || "/default_avatar.png"}
      alt="Avatar"
      className={cx("rounded-full bg-gray-200 dark:bg-gray-800", className)}
    />
  );
}
