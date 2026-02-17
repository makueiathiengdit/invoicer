export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response("Not found", { status: 404 });
    }

    const base_url = process.env.API_BASE_URL + "/attachments/" + id;
    let doc = await fetch(base_url);

    if (!doc) {
      return new Response("Not found", { status: 404 });
    }

    let fileBuffer;

    if (doc.file && doc.file.buffer) {
      fileBuffer = doc.file.buffer;
    } else if (Buffer.isBuffer(doc.file)) {
      fileBuffer = doc.file;
    } else if (doc.file && typeof doc.file === "object" && doc.file.toString) {
      fileBuffer = Buffer.from(doc.file);
    } else if (doc.body) {
      fileBuffer = doc.body;
    } else {
      return new Response("No file data", { status: 500 });
    }

    const filename = `${doc.name}.pdf` || "file.pdf";
    const contentType = doc.file_type || "application/pdf";
    const contentLength = doc.size || fileBuffer.length;

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(contentLength),
        "Content-Disposition": `inline; filename="${filename}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("GET /files/:id error:", err);
    return new Response("Server error", { status: 500 });
  }
}
