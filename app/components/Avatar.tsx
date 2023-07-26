/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { Person } from "lemmy-js-client";

import Image from "./Image";

import { cx } from "~/lib/utils";

type AvatarProps = {
  person: Person;
  className?: string;
};

export default function Avatar({ person, className }: AvatarProps) {
  return (
    <Image
      src={person.avatar || "/default_avatar.png"}
      alt="Avatar"
      className={cx("rounded-full bg-gray-200 dark:bg-gray-800", className)}
    />
  );
}
