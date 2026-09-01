/*
  api client for "use client" components.

  the browser talks to the express api directly and the session rides in the
  httpOnly cookie the api set at login, so every call needs credentials.
  server components must use api-server.js instead — it forwards the cookie by
  hand because a server side fetch has no browser to attach it.
*/

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const API_URL = `${API_BASE_URL}/api`;

/*
  always resolves to the { success, message, data, errors } envelope so callers
  never have to guess between a failed request and a failed response.
*/
export async function apiFetch(path, { method = "GET", body, headers } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      credentials: "include",
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
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

// auth
export const login = (credentials) =>
  apiFetch("/auth/login", { method: "POST", body: credentials });

export const logout = () => apiFetch("/auth/logout", { method: "POST" });

export const getCurrentUser = () => apiFetch("/auth/me");

// users
export const createUser = (user) =>
  apiFetch("/users", { method: "POST", body: user });

export const getUsers = () => apiFetch("/users");

// invoices
export const createInvoice = (invoice) =>
  apiFetch("/invoices", { method: "POST", body: invoice });

export const getInvoices = () => apiFetch("/invoices");

export const getInvoiceById = (id) => apiFetch(`/invoices/${id}`);

export const getInvoicesByPO = (po_number) =>
  apiFetch(`/invoices/po/${encodeURIComponent(po_number)}`);

export const updatePRPO = (id, prpo) =>
  apiFetch(`/invoices/${id}/prpo`, { method: "PATCH", body: prpo });

// received invoices
export const createReceivedInvoice = (received_invoice) =>
  apiFetch("/received-invoices", { method: "POST", body: received_invoice });

export const getReceivedInvoices = () => apiFetch("/received-invoices");

export const getReceivedInvoicesByPO = (po_number) =>
  apiFetch(`/received-invoices/po/${encodeURIComponent(po_number)}`);
