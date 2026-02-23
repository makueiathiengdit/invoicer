import React from "react";

const ReceivedInvoiceItem = ({ item = {} }) => {
  return (
    <div className="flex justify-between gap-2 border border-gray-300 rounded p-4 mt-1">
      <div>
        <div className="flex gap-2 text-gray-700 font-semibold">
          <span>PR : {item?.pr_number || "N/A"}</span> |
          <span>PO : {item?.po_number || "N/A"}</span>
        </div>
        <div className="text-gray-600 flex gap-2">
          <span className="">
            Submited: {new Date(item.created_at).toDateString()}
          </span>{" "}
          -<span>{item.description}</span>
        </div>
      </div>
      <div className="flex gap-2 text-gray-700 ">
        <span>{item.currency}</span>
        <span className="font-semibold">{item.amount}</span>
      </div>
    </div>
  );
};

export default ReceivedInvoiceItem;
