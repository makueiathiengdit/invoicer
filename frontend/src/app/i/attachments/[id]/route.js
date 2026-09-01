import { cookies } from "next/headers";
import { API_URL } from "@/lib/api-server";

export const runtime = "nodejs";

/*
  the invoice detail links straight at this route, so it stays same-origin and
  streams the file through from the express api with the session attached.
*/
export async function GET(_request, { params }) {
  const { id } = await params;

  if (!id) {
    return new Response("Attachment Not found", { status: 404 });
  }

  const token = (await cookies()).get("token")?.value;

  try {
    const upstream = await fetch(`${API_URL}/attachments/${id}`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!upstream.ok) {
      return new Response("Attachment Not found", { status: upstream.status });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "application/pdf",
        "Content-Disposition":
          upstream.headers.get("content-disposition") || "inline",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("GET /i/attachments/:id error:", error);
    return new Response("Server error", { status: 500 });
  }
}
