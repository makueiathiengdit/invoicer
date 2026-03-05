"use client";

import React, { useEffect, useState } from "react";
import InputText from "../../components/inputs/input-text";
import ReceivedInvoiceItem from "./received-invoice-item";
import { Search } from "lucide-react";
import { delayRequest } from "@/app/utils/utils";
import InputAmount from "../../components/inputs/input-amount";
import { useRouter } from "next/navigation";

const ReceivedInvoiceForm = ({ invoice = {} }) => {
  const [formData, setFormData] = useState({
    invoice_id: "",
    po_number: "",
    receipt_id: "",
    amount: 0,
  });
  const [s_invoice, setInvoice] = useState(null);
  const [po_number, setPoNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearchInputChange = (event) => {
    setPoNumber(event.target.value);
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        amount: parseInt(formData.amount),
      };

      const url = "http://127.0.0.1:8000/received/invoices/";
      let res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      res = await res.json();

      if (res.success) {
        router.push("/i/receiving/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (s_invoice) {
      setFormData({
        ...formData,

        ["po_number"]: po_number,
        ["description"]: s_invoice?.description,
      });
    }
  }, [s_invoice]);

  return (
    <div className="mt-4">
      <div className="flex gap-2 justify-center items-center">
        <InputText
          label="PO Number"
          name={"po_number"}
          value={po_number}
          placeholder={"e.g 2026798"}
          onChange={handleSearchInputChange}
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

      <br />
      {/* recevied invoice form */}
      {s_invoice && (
        <div className="border border-gray-300 p-4 rounded">
          <InputText
            label="Invoice ID"
            name={"invoice_id"}
            value={formData.invoice_id}
            placeholder={"e.g INV-2026-01"}
            onChange={handleInputChange}
          />
          <br />

          <InputAmount
            label={"Amount"}
            name={"amount"}
            value={formData.amount}
            placeholder={"e.g 1000"}
            onChange={handleInputChange}
          />
          <br />
          <InputText
            label="Receipt ID"
            name={"receipt_id"}
            value={formData.receipt_id}
            placeholder={"e.g 4759"}
            onChange={handleInputChange}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn btn-sm rounded">Cancel</button>
            <button
              className="btn btn-sm rounded bg-teal-600 text-white"
              onClick={handleSubmit}
            >
              {loading ? <span>Creating...</span> : <span>Create</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedInvoiceForm;
