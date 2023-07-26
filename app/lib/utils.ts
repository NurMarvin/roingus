/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { Person } from "lemmy-js-client";

import type { Locale } from "date-fns";
import enUsLocale from "date-fns/locale/en-US";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the display name of a person.
 * @param person the person to get the display name of
 * @returns the display name of the person
 */
export function getDisplayName(person: Person) {
  const { display_name, local } = person;

  if (display_name) {
    return display_name;
  }

  const username = getUsername(person);

  return local ? username : "@" + username;
}

/**
 * Get the username of a person.
 * @param person the person to get the username of
 * @returns the username of the person
 */
export function getUsername(person: Person) {
  const { actor_id, name, local } = person;

  if (local) {
    return name;
  }

  const url = new URL(actor_id);

  return `${name}@${url.hostname}`;
}

const dateFnsLocales: Record<string, Locale> = {
  "en-US": enUsLocale,
};

export function getDateLocale(request: Request) {
  const locale = request.headers.get("Accept-Language") || "en-US";

  return dateFnsLocales[locale] || enUsLocale;
}
