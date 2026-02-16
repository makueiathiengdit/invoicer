"use client";
import Link from "next/link";
import React, { useState } from "react";

const InvoiceTableRow = ({ item = {} }) => {
  const url = "/i/invoices/view/" + item.id;

  return (
    <>
      <tr className="border-b border-gray-300 hover:bg-emerald-50">
        <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap ">
          {new Date(item?.created_at).toLocaleDateString() || item.invoice_date}
        </th>
        <td className="px-4 py-3">{item.invoice_id}</td>
        {/* <td className="px-4 py-3">{item.invoice_date}</td> */}

        <td className="px-4 py-3">{item.description}</td>
        <td className="px-4 py-3 text-gray-700 font-semibold">
          <span
            className={`${item.currency === "SSP" ? "text-teal-600" : "text-blue-600"} mr-1 `}
          >
            {item.currency}
          </span>
          <span>{parseFloat(item.amount).toFixed(2)}</span>
        </td>
        {/* <td className="px-4 py-3">{item?.company}</td> */}
        <td className="px-4 py-3 flex items-center justify-end">
          <Link href={url}>
            <span className="text-blue-600 font-semibold hover:underline">
              View
            </span>
          </Link>
        </td>
      </tr>
    </>
  );
};

export default InvoiceTableRow;
