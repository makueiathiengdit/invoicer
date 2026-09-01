import { cookies } from "next/headers";

/*
  api client for server components.

  a fetch made on the server carries no browser cookie jar, so the session token
  is read off the incoming request and forwarded as a bearer token.
  never import this from a "use client" file.
*/

export const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

export const API_URL = `${API_BASE_URL}/api`;

export async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const token = (await cookies()).get("token")?.value;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      cache: "no-store", // invoice data changes constantly
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => null);

    if (!payload) {
      return {
        success: false,
        message: `request failed (${response.status})`,
        data: [],
        errors: {},
      };
    }

    return payload;
  } catch (error) {
    console.log("api request failed", error);

    return {
      success: false,
      message: "could not reach the server",
      data: [],
      errors: {},
    };
  }
}

export const getInvoices = () => apiFetch("/invoices");

export const getInvoiceById = (id) => apiFetch(`/invoices/${id}`);

export const getReceivedInvoices = () => apiFetch("/received-invoices");

export const getUsers = () => apiFetch("/users");
