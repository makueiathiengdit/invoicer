"use client";

import React, { useState } from "react";

const SideBarItem = ({
  item = {
    title: "",
    icon: "",
    link: "",
    submenu: [],
  },
}) => {
  const [show, setShow] = useState(false);

  return (
    <>
      {item.submenu.length > 0 ? (
        <li>
          <button
            type="button"
            className="flex items-center p-2 w-full text-base font-medium  rounded-lg transition duration-75 group  text-white hover:bg-gray-700"
            aria-controls="dropdown-pages"
            data-collapse-toggle="dropdown-pages"
            onClick={() => {
              setShow(!show);
            }}
          >
            {item.icon}
            <span className="flex-1 ml-3 text-left whitespace-nowrap">
              {item.title}
            </span>
            <svg
              aria-hidden="true"
              className="w-6 h-6"
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
            id="dropdown-pages"
            className={`${show ? "" : "hidden"} py-2 space-y-2`}
          >
            {item.submenu.map((si, id) => (
              <li key={id}>
                <a
                  href={si.link}
                  className="flex items-center p-2 pl-11 w-full text-base font-medium  rounded-lg transition duration-75 group  text-white hover:bg-gray-700"
                >
                  {si.title}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ) : (
        <li>
          <a
            href={item.link}
            className="flex items-center p-2 text-base font-medium  rounded-lg text-white  hover:bg-gray-700 group"
          >
            {item.icon}

            <span className="ml-3">{item.title}</span>
          </a>
        </li>
      )}
    </>
  );
};

export default SideBarItem;
