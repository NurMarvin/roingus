/*
 * Copyright (c) 2023 NurMarvin (Marvin Witt)
 * Licensed under the Open Software License version 3.0
 */
import { NavLink } from "@remix-run/react";

import Image from "./Image";

import { useSiteContext } from "~/contexts/SiteContext";

import { cx } from "~/lib/utils";
import { Github } from "lucide-react";

type NavbarItemProps = {
  href: string;
  children: React.ReactNode;
};

function NavbarItem({ href, children }: NavbarItemProps) {
  const { base, domain } = useSiteContext();

  const urlPrefix = base ? "" : `/${domain}`;

  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          cx(
            "dark:text-gray-300 dark:hover:text-gray-100 px-3 py-2 font-medium text-gray-500 hover:text-gray-900",
            isActive && "text-gray-900 dark:text-gray-100"
          )
        }
        to={`${urlPrefix}${href}`}
      >
        {children}
      </NavLink>
    </li>
  );
}

function Navbar() {
  const {
    site: { site_view },
    base,
    domain,
  } = useSiteContext();

  const homeUrl = base ? "/" : `/${domain}`;

  return (
    <nav className="flex items-end flex-wrap py-6 gap-8">
      <NavLink to={homeUrl} className="flex items-center">
        <div className="flex items-center flex-shrink-0 text-gray-900 dark:text-gray-100 opacity-90 hover:opacity-100">
          {site_view.site.icon && (
            <Image src={site_view.site.icon} className="w-8 h-8 mr-2" />
          )}
          <span className="font-semibold text-xl tracking-tight">
            {site_view.site.name}
          </span>
        </div>
      </NavLink>
      <ul className="flex gap-4">
        <NavbarItem href="/communities">Communities</NavbarItem>
      </ul>
      <ul className="flex gap-4 ml-auto">
        <a
          href="https://github.com/NurMarvin/roingus"
          className="flex items-center gap-2 dark:text-gray-300 dark:hover:text-gray-100 px-3 py-2 font-medium text-gray-500 hover:text-gray-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="w-6 h-6" />
          Source Code
        </a>
      </ul>
    </nav>
  );
}

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  return (
    <>
      <header className="container mx-auto px-4 py-4">
        <Navbar />
      </header>

      <main className={cx("flex-grow container mx-auto px-4 py-4", className)}>
        {children}
      </main>
    </>
  );
}
