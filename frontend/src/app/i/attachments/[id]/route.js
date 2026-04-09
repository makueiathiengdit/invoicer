import { connectToDB } from "@/db/connect";
import { Attachment } from "@/db/models";
export const runtime = "nodejs";

export async function GET(request, { params }) {
  await connectToDB();

  const { id } = await params;

  const doc = await Attachment.findById(id);

  if (!doc || !doc.file) {
    return new Response("Attachment Not found", { status: 404 });
  }

  let fileBuffer;

  if (doc.file?.buffer) {
    fileBuffer = Buffer.from(doc.file.buffer);
  } else if (Buffer.isBuffer(doc.file)) {
    fileBuffer = doc.file;
  } else {
    fileBuffer = Buffer.from(doc.file, "base64");
  }

  return new Response(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${doc.name}"`,
    },
  });
}
