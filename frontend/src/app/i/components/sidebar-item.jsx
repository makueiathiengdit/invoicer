"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// "/i/invoices/" and "/i/invoices" are the same place
function normalize(path) {
  const trimmed = String(path || "").replace(/\/+$/, "");

  return trimmed === "" ? "/" : trimmed;
}

function isExactMatch(pathname, link) {
  return normalize(pathname) === normalize(link);
}

/*
  a section also owns everything nested under it, so Invoices stays lit on
  /i/invoices/create. "/i" is the exception: the whole dashboard sits under it,
  so Overview only ever matches itself.
*/
function isSectionMatch(pathname, link) {
  const target = normalize(link);

  if (target === "/i") {
    return isExactMatch(pathname, link);
  }

  return (
    normalize(pathname) === target || normalize(pathname).startsWith(`${target}/`)
  );
}

const SideBarItem = ({
  item = {
    title: "",
    icon: "",
    link: "",
    submenu: [],
  },
}) => {
  const pathname = usePathname();

  const is_active =
    isSectionMatch(pathname, item.link) ||
    item.submenu.some((si) => isSectionMatch(pathname, si.link));

  /*
    null means "follow the route" — the section you are in starts open. once it
    is toggled by hand that choice wins, which is what you want when someone
    opens another section to look around without leaving the page they are on.
  */
  const [open, setOpen] = useState(null);
  const show = open === null ? is_active : open;

  // every item with a submenu needs its own id, or aria-controls points at the
  // first one for all of them
  const dropdown_id = `dropdown-${normalize(item.link).replace(/\W+/g, "-")}`;

  const item_classes = `flex items-center p-2 w-full text-base rounded-lg transition duration-75 group text-white ${
    is_active ? "bg-teal-800 font-semibold" : "font-medium hover:bg-gray-700"
  }`;

  return (
    <>
      {item.submenu.length > 0 ? (
        <li>
          <button
            type="button"
            className={item_classes}
            aria-controls={dropdown_id}
            aria-expanded={show}
            onClick={() => {
              setOpen(!show);
            }}
          >
            {item.icon}
            <span className="flex-1 ml-3 text-left whitespace-nowrap">
              {item.title}
            </span>
            <svg
              aria-hidden="true"
              className={`w-6 h-6 transition-transform ${show ? "" : "-rotate-90"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <ul
            id={dropdown_id}
            className={`${show ? "" : "hidden"} py-2 space-y-2`}
          >
            {item.submenu.map((si, id) => {
              const is_current = isExactMatch(pathname, si.link);

              return (
                <li key={id}>
                  {/* next/link, not <a>: a raw href skips the basePath and 404s */}
                  <Link
                    href={si.link}
                    aria-current={is_current ? "page" : undefined}
                    className={`flex items-center p-2 pl-11 w-full text-base rounded-lg transition duration-75 group text-white ${
                      is_current
                        ? "bg-teal-700 font-semibold"
                        : "font-medium hover:bg-gray-700"
                    }`}
                  >
                    {si.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ) : (
        <li>
          <Link
            href={item.link}
            aria-current={is_active ? "page" : undefined}
            className={item_classes}
          >
            {item.icon}

            <span className="ml-3">{item.title}</span>
          </Link>
        </li>
      )}
    </>
  );
};

export default SideBarItem;
