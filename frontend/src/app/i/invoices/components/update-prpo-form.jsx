"use client";

import React, { useState } from "react";
import InputText from "../../components/inputs/input-text";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { updatePRPO } from "@/lib/api-client";

const UpdatePRPOForm = ({ invoice = { id: "" } }) => {
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    pr_number: "",
    po_number: "",
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const router = useRouter();

  const handleCancel = () => {
    const invoice_modal = document.getElementById("edit_invoice_modal");

    if (invoice_modal) {
      invoice_modal.close();
    }

    setSelected("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // only send the field that is actually being updated
    const payload =
      selected === "pr"
        ? { pr_number: formData.pr_number }
        : { po_number: formData.po_number };

    try {
      setSaving(true);

      const res = await updatePRPO(invoice._id, payload);

      if (res.success) {
        toast.success(res.message);

        handleCancel();

        router.refresh();
      } else {
        toast.error(res.message || "could not update the invoice");
      }
    } catch (error) {
      console.log("could not update the invoice", error);
      toast.error("could not update the invoice");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mt-4">
        <button
          className={`btn btn-sm rounded bg-blue-600 text-white ${selected === "pr" ? "outline-2 outline-blue-600" : ""}`}
          onClick={() => setSelected("pr")}
        >
          Update PR
        </button>

        {invoice.pr_number && (
          <button
            className={`btn btn-sm rounded bg-green-600 text-white ${selected === "po" ? "outline-2 outline-green-600" : ""}`}
            onClick={() => setSelected("po")}
          >
            Update PO
          </button>
        )}
      </div>

      <form>
        <div className="mt-6">
          {selected === "pr" && (
            <InputText
              label="PR Number"
              name={"pr_number"}
              value={formData.pr_number}
              placeholder={"e.g 20260223"}
              onChange={handleInputChange}
            />
          )}

          {selected === "po" && (
            <InputText
              label="PO Number"
              name={"po_number"}
              value={formData.po_number}
              placeholder={"e.g 20262302"}
              onChange={handleInputChange}
            />
          )}

          {selected && (
            <div className="mt-2 flex justify-end gap-2">
              <button
                className="btn btn-sm rounded"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm rounded bg-teal-600 text-white"
                onClick={handleSubmit}
                type="button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdatePRPOForm;
