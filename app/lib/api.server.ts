/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import type { Params } from "@remix-run/react";

import { VERSION } from "lemmy-js-client/dist/types/others";

const domainRegExp = /^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;

export async function apiRequest<TResponse>(
  url: string,
  params: Params,
  init?: RequestInit
): Promise<TResponse> {
  let instanceUrl = process.env.BASE_URL;

  const { domain } = params;

  if (domain && domainRegExp.test(domain)) {
    instanceUrl = `https://${domain}`;
  }

  const apiBaseUrl = `${instanceUrl}/api/${VERSION}`;

  const response = await fetch(`${apiBaseUrl}${url}`, {
    ...init,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
