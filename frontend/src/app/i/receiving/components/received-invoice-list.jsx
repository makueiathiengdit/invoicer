"use client";

import React from "react";
import ReceivedInvoiceItem from "./received-invoice-item";
import ReceivedInvoiceForm from "./received-invoice-form";

const ReceivedInvoiceList = ({ data = [] }) => {
  return (
    <div>
      {/* header */}
      <div className="flex justify-between">
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
        <div>
          <button
            className="btn btn-sm rounded bg-teal-600 text-white"
            onClick={() => {
              document.getElementById("received_invoice_modal").showModal();
            }}
          >
            Receive
          </button>
        </div>
      </div>

      {/* table */}
      {data.length > 0 ? (
        data.map((invoice, id) => (
          <ReceivedInvoiceItem item={invoice} key={id} />
        ))
      ) : (
        <p>No received invoices</p>
      )}

      {/* received invoice modal */}

      <dialog id="received_invoice_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-gray-600 font-semibold text-lg border-b border-gray-300">
            Receive Invoice
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              document.getElementById("received_invoice_modal").close();
            }}
          >
            ✕
          </button>
          <ReceivedInvoiceForm />
        </div>
      </dialog>
    </div>
  );
};

export default ReceivedInvoiceList;
