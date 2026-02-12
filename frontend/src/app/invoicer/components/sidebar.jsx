import React from "react";
import { FileText, Folder, Home } from "lucide-react";
const SideBar = () => {
  return (
    <>
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full  border-r border-teal-200 md:translate-x-0 bg-teal-600 "
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div className="overflow-y-auto py-5 px-3 h-full  bg-teal-600">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-base font-medium  rounded-lg text-white  hover:bg-gray-700 group"
              >
                <Home />
                <span className="ml-3">Overview</span>
              </a>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center p-2 w-full text-base font-medium  rounded-lg transition duration-75 group  text-white hover:bg-gray-700"
                aria-controls="dropdown-pages"
                data-collapse-toggle="dropdown-pages"
              >
                <FileText />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Invoices
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
              <ul id="dropdown-pages" className="hidden py-2 space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 pl-11 w-full text-base font-medium  rounded-lg transition duration-75 group  text-white hover:bg-gray-700"
                  >
                    Pending
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 pl-11 w-full text-base font-medium  rounded-lg transition duration-75 group  text-white hover:bg-gray-700"
                  >
                    Processed
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <a
                href="/invoicer/purchase-orders"
                className="flex items-center p-2 text-base font-medium  rounded-lg text-white  hover:bg-gray-700 group"
              >
                <Folder />

                <span className="ml-3">Purchase Orders</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
