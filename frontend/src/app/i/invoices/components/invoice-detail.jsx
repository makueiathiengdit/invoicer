"use client";

import { formatCurrentDate } from "@/app/utils/utils";
import { Calendar, User, Hash, Paperclip } from "lucide-react";
import UpdatePRPOForm from "./update-prpo-form";

export const sampleInvoice = {
  id: 1,
  invoice_id: "INV-2026-00124",
  invoice_date: "2026-02-12",
  description:
    "Supply and installation of office networking equipment including routers, switches, and structured cabling for Head Office IT upgrade project.",
  amount: 4850000.0,
  currency: "SSP",
  processed_at: "2026-02-13T10:45:00",
  vendor: "NileTech Solutions Ltd",
  po_number: "PO-45892",
  pr_number: "PR-77451",
  attachment: {
    id: 23,
    file_name: "network_upgrade_invoice.pdf",
  },
};

export default function InvoiceDetail({ invoice = sampleInvoice }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency || "SSP",
    }).format(amount);

  return (
    <div className="min-h-screen print:bg-white print:p-0 p-6">
      <div className="flex  gap-3 justify-end mb-2 max-w-4xl mx-auto">
        <span className="text-gray-500">Actions:</span>
        <button
          className="text-blue-600 hover:underline hover:cursor-pointer"
          onClick={() =>
            document.getElementById("edit_invoice_modal").showModal()
          }
        >
          Process
        </button>
        |
        <span className="text-red-600 hover:underline hover:cursor-pointer">
          Delete
        </span>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl print:shadow-none rounded-2xl print:rounded-none  print:border-none">
        <div className="bg-teal-600 text-white print:bg-white print:text-black p-6  print:border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
              <p className="bg-amber-50 text-gray-700 px-1 font-mono text-sm mt-1 opacity-90 print:opacity-100">
                Invoice ID: {invoice.invoice_id || "N/A"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm uppercase tracking-wide">Total Amount</p>
              <p className="text-3xl font-extrabold">
                {formatCurrency(invoice.amount)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <InfoItem
              icon={<Calendar size={18} />}
              label="Invoice Date"
              value={invoice.invoice_date}
            />

            <InfoItem
              icon={<User size={18} />}
              label="Vendor"
              value={invoice.vendor || "Not specified"}
            />

            <InfoItem
              icon={<Hash size={18} />}
              label="PR Number"
              value={invoice.pr_number || "—"}
            />

            <InfoItem
              icon={<Hash size={18} />}
              label="PO Number"
              value={invoice.po_number || "—"}
            />

            <InfoItem
              icon={<Calendar size={18} />}
              label="Processed At"
              value={invoice.processed_at ? formatCurrentDate() : "Pending"}
            />
            {/* <InfoItem
              icon={<User size={18} />}
              label="Assigned to"
              value={"Nyibol Deng"}
            /> */}
            <InfoItem
              icon={<User size={18} />}
              label="Processed By"
              value={"Nyibol Deng"}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Description
            </h3>
            <div className="border border-gray-200 rounded-xl p-5 leading-relaxed text-gray-700">
              {invoice.description || "No description provided."}
            </div>
          </div>

          {invoice.attachment && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                Attachment
              </h3>
              <div className="flex justify-between gap-3 border border-gray-200 rounded-xl p-4">
                <div className="flex justify-center gap-3">
                  <Paperclip
                    size={18}
                    className="text-teal-600 print:text-black"
                  />
                  <span>{invoice.attachment.name}</span>

                  <span className="text-gray-400 ">
                    {(invoice.attachment.size / (1024 * 1024)).toFixed(1)}MB
                  </span>
                </div>

                <div className="flex justify-end items-end">
                  <a
                    href={`/i/files/${invoice?.attachment.id}`}
                    target="_blank"
                    className="btn btn-primary btn-sm rounded-md text-white"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* update invoice modal */}
      <dialog id="edit_invoice_modal" className="modal">
        <div className="modal-box">
          <h3 className="text-gray-600 font-semibold text-lg border-b border-gray-300">
            Update Invoice
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => {
              document.getElementById("edit_invoice_modal").close();
            }}
          >
            ✕
          </button>
          <UpdatePRPOForm invoice={invoice} />
        </div>
      </dialog>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-teal-600 print:text-black mt-1">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}
