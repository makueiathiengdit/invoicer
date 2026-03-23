import { formatCurrency, formatCurrentDate } from "@/app/utils/utils";
import Link from "next/link";
import React from "react";

const ReceivedInvoiceItem = ({ item = {} }) => {
  const url = "/i/invoices/view/" + item.id;

  return (
    <Link href={url}>
      <div className="flex justify-between gap-2 border border-gray-300 rounded p-4 mt-1 hover:bg-teal-300 hover:cursor-pointer">
        <div>
          <div className="flex gap-2 text-sm text-gray-700 font-semibold">
            {/* <span>PR : {item?.pr_number || "N/A"}</span> | */}
            <span>PO : {item?.po_number || "N/A"}</span>
          </div>
          <div className="text-gray-600 flex gap-2 text-sm">
            <span className="">
              {formatCurrentDate(new Date(item.createdAt) || null)}
            </span>{" "}
            -<span>{item.description}</span>
          </div>
        </div>
        <div className="flex gap-2 text-gray-700 ">
          <span>{item.currency}</span>
          <span className="font-semibold">{formatCurrency(item.amount)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ReceivedInvoiceItem;
