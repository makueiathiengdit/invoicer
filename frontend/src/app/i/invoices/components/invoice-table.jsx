import React from "react";
import InvoiceTableRow from "./invoice-table-row";
import Link from "next/link";

const InvoiceTable = ({ data = [] }) => {
  return (
    <div>
      <div className="mx-auto px-4 lg:px-12">
        {/* search, filters and more */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2">
            <form className="flex items-center">
              <label htmlFor="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="simple-search"
                  className="bg-teal-50 border border-teal-600 text-gray-800 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2 "
                  placeholder="Search invoices"
                  required=""
                />
              </div>
            </form>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 shrink-0">
            <Link
              href={"/i/invoices/create"}
              className="flex items-center justify-center text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-teal-800"
            >
              <svg
                className="h-3.5 w-3.5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                />
              </svg>
              Add Invoice
            </Link>
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                id="filterDropdownButton"
                data-dropdown-toggle="filterDropdown"
                className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium bg-teal-600 text-white focus:outline-none  rounded-lg border  hover:bg-teal-700  focus:z-10 focus:ring-4 focus:ring-gray-200  dark:bg-teal-600"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-4 w-4 mr-2 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filter
                <svg
                  className="-mr-1 ml-1.5 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
              <div
                id="filterDropdown"
                className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-teal-600"
              >
                <h6 className="mb-3 text-sm font-medium text-white dark:text-white">
                  Status
                </h6>
                <ul
                  className="space-y-2 text-sm"
                  aria-labelledby="filterDropdownButton"
                >
                  <li className="flex items-center">
                    <input
                      id="processed"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-teal-600 focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="processed"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-100"
                    >
                      Processed (56)
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      id="pending"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-teal-600 focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="pending"
                      className="ml-2 text-sm font-medium text-white dark:text-gray-100"
                    >
                      Pending (56)
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md shadow">
          <table className="w-full text-sm text-left text-gray-500 ">
            <thead className="text-xs text-white uppercase bg-teal-600 ">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Ceated At
                </th>
                <th scope="col" className="px-4 py-3">
                  Invoice ID
                </th>
                <th scope="col" className="px-4 py-3">
                  Invoice Date
                </th>
                <th scope="col" className="px-4 py-3">
                  Description
                </th>
                <th scope="col" className="px-4 py-3">
                  Price
                </th>
                <th scope="col" className="px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, id) => (
                <InvoiceTableRow item={item} key={id} />
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {/* <nav
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 ">
          Showing
          <span className="font-semibold text-white dark:text-white">1-10</span>
          of
          <span className="font-semibold text-white dark:text-white">1000</span>
        </span>
        <ul className="inline-flex items-stretch -space-x-px">
          <li>
            <a
              href="#"
              className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-white dark:bg-teal-600 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-white dark:bg-teal-600 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-white dark:bg-teal-600 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-teal-600 bg-teal-50 border border-teal-300 hover:bg-teal-100 hover:text-teal-700 dark:border-gray-700 dark:bg-teal-600 dark:text-white"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-white dark:bg-teal-600 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ...
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-white dark:bg-teal-600 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              100
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-white dark:bg-teal-600 dark:border-gray-700  dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav> */}
      </div>
    </div>
  );
};

export default InvoiceTable;
