import { Attachment } from "../db/models.js";

export async function getAttachmentById(id) {
  return Attachment.findById(id);
}

// mongoose hands back a Binary or a Buffer depending on how the doc was written
export function toBuffer(file) {
  if (Buffer.isBuffer(file)) {
    return file;
  }

  if (file?.buffer) {
    return Buffer.from(file.buffer);
  }

  return Buffer.from(file, "base64");
}
