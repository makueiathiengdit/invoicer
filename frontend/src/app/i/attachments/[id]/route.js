import { connectToDB } from "@/db/connect";
import { Attachment } from "@/db/models";
export async function GET(request, { params }) {
  try {
    await connectToDB();

    const { id } = await params;

    if (!id) {
      return new Response("Not found", { status: 404 });
    }

    const doc = await Attachment.findById(id);
    if (!doc) {
      return new Response("Not found", { status: 404 });
    }

    let fileBuffer;

    if (doc.file) {
      // if it's already a Buffer
      if (Buffer.isBuffer(doc.file)) {
        fileBuffer = doc.file;
      }

      // BSON Binary objects
      else if (
        doc.file.buffer instanceof Uint8Array ||
        Buffer.isBuffer(doc.file.buffer)
      ) {
        fileBuffer = Buffer.from(doc.file.buffer);
      }
      // for other object types
      else {
        fileBuffer = Buffer.from(doc.file.toString(), "base64");
      }
    }

    if (!fileBuffer) {
      return new Response("No file data found", { status: 500 });
    }

    const filename = doc.file_name ? `${doc.file_name}.pdf` : "file.pdf";
    const contentType = "application/pdf";

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": String(fileBuffer.length),
      },
    });
  } catch (err) {
    console.error("GET /files/:id error:", err);
    return new Response("Server error", { status: 500 });
  }
}
