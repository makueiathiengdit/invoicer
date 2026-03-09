"use client";
import React, { useState } from "react";
import InputText from "../../components/inputs/input-text";
import InputAmount from "../../components/inputs/input-amount";
import InputFile from "../../components/inputs/input-file";
import InputSelectBox from "../../components/inputs/input-select-box";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/app/constants/constants";
import { InvoiceFormSchema } from "@/app/schema/form-schema";
import { convertZodErrorsToJSON } from "@/app/utils/utils";

const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    invoice_id: "",
    invoice_date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    currency: "SSP",
    balance: 0,
    vendor: "",
    attachment: null,
  });
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [formErrors, setFormErrors] = useState({
    invoice_id: "",
    invoice_date: "",
    description: "",
    amount: "",
    currency: "SSP",
    balance: "",
    vendor: "",
  });

  const router = useRouter();

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFormData({ ...formData, attachment: null });
      return;
    }

    // max file size: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File is too large. Please select a file under 10MB.");
      console.error("File is too large. Please select a file under 10MB.");

      event.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // extra base64 data
      const base64String = reader.result.split(",")[1];

      setFormData({
        ...formData,
        attachment: {
          name: file.name,
          size: file.size,
          file: base64String,
        },
      });
    };

    reader.onerror = () => {
      console.error("Error reading file.");
    };

    reader.readAsDataURL(file);
  };

  // post data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validated_data = InvoiceFormSchema.safeParse({
      ...formData,
      ["amount"]: parseFloat(formData.amount),
    });

    if (!validated_data.success) {
      const errors = convertZodErrorsToJSON(validated_data.error.issues);

      setFormErrors(errors);
      return;
    }

    console.log(validated_data);

    setLoading(true);

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount),
      balance: parseFloat(formData.amount),
    };

    try {
      const url = BASE_API_URL + "/invoices";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Success:", result.message);

        // reset
        setFormData({
          invoice_id: "",
          invoice_date: new Date().toISOString().split("T")[0],
          description: "",
          amount: 0,
          currency: "SSP",
          attachment: null,
        });

        router.push("/i/invoices");
      } else {
        console.log("API Error:", result.message || "Unknown error occurred");
      }
    } catch (error) {
      console.log("Network or Server error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-4" method="POST">
      <InputText
        label="Vendor"
        name={"vendor"}
        value={formData.vendor}
        placeholder={"vendor name"}
        onChange={handleInputChange}
        error_message={formErrors.vendor}
      />
      <br />

      <InputText
        label="Invoice ID"
        name={"invoice_id"}
        value={formData.invoice_id}
        placeholder={"e.g INV-2026-001"}
        onChange={handleInputChange}
        error_message={formErrors.invoice_id}
      />
      <br />
      <InputText
        label="Description"
        name={"description"}
        value={formData.description}
        placeholder={"e.g purchase of spare parts"}
        onChange={handleInputChange}
        error_message={formErrors.description}
      />
      <br />

      <InputAmount
        label={"Amount "}
        name={"amount"}
        value={formData.amount}
        placeholder={"e.g 10000"}
        onChange={handleInputChange}
        error_message={formErrors.amount}
      />
      <InputSelectBox
        label="Currency"
        name="currency"
        value={formData.currency}
        onChange={handleInputChange}
        error_message={formErrors.currency}
      >
        <option>SSP</option>
        <option>USD</option>
      </InputSelectBox>

      <br />
      <InputFile
        label="Attachment"
        name={"attachment"}
        value={formData.attachment?.name}
        onChange={handleFileInputChange}
        error_message={fileError}
      />

      <div className="flex justify-end mt-4 gap-2 ">
        <button className="btn btn-sm btn-soft rounded">Cancel</button>
        <button
          className="btn btn-sm btn-primary text-white rounded"
          onClick={handleSubmit}
        >
          {loading ? "Creating" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
