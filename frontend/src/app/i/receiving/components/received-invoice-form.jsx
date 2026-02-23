"use client";

import React, { useState } from "react";
import InputText from "../../components/inputs/input-text";
import ReceivedInvoiceItem from "./received-invoice-item";
import { Search } from "lucide-react";
import { delayRequest } from "@/app/utils/utils";
import LoadingSpinner from "../../components/spinner/loading-spinner";

const ReceivedInvoiceForm = ({ invoice = {} }) => {
  const [s_invoice, setInvoice] = useState(null);
  const [po_number, setPoNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleInputChange = (event) => {
    setPoNumber(event.target.value);
  };
  const handleSearch = async (event) => {
    setInvoice(null);

    try {
      setLoading(true);

      await delayRequest(2000);

      let res = await fetch(`http://127.0.0.1:8000/invoices/po/${po_number}`);

      res = await res.json();

      if (res.success) {
        setInvoice(res.data[0]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-2 justify-center items-center">
        <InputText
          label="PO Number"
          name={"po_number"}
          value={po_number}
          placeholder={"e.g 2026798"}
          onChange={handleInputChange}
        />
        <button
          className="btn btn-sm bg-teal-600 text-white rounded mt-8"
          onClick={handleSearch}
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>

      <div className="mt-6">
        <p>Results</p>

        {loading ? (
          <div className="flex gap-2">
            <span className="loading loading-sm loading-spinner text-teal-600"></span>
            <span className="text-teal-600">searching...</span>
          </div>
        ) : s_invoice ? (
          <>
            <ReceivedInvoiceItem item={s_invoice} />
          </>
        ) : (
          <p className="text-red-600">No invoice found</p>
        )}
      </div>
    </div>
  );
};

export default ReceivedInvoiceForm;
