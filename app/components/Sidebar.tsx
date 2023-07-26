/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */

import Image from "./Image";

import { useSiteContext } from "~/contexts/SiteContext";

export default function Sidebar() {
  const {
    site: {
      site_view: { site },
    },
  } = useSiteContext();

  return (
    <aside className="col-span-1 bg-gray-200 dark:bg-gray-900 rounded-lg p-4 self-start">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
        {site.name}
      </h2>

      {site.banner && <Image src={site.banner} className="mb-4" />}

      {site.description && (
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {site.description}
        </p>
      )}
    </aside>
  );
}
