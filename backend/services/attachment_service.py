from db.core import get_session
from db.models import Attachment
from utils.api_response import APIResponse
from fastapi import Response


class AttachmentService:
    @classmethod
    def get_attachment_all(cls):
        with get_session() as db:

            attacments = db.query(Attachment).all()
            response = APIResponse()

            if attacments:
                response.success = True
                response.message = "attachments found"
                response.data = [
                    {
                        "id": attachment.id,
                        "name": attachment.name,
                        "size": attachment.size,
                    }
                    for attachment in attacments
                ]
            else:
                response.message = "could not find attachments"

            return response

    @classmethod
    def get_attachment_by_id(cls, id: int):

        with get_session() as db:
            attachment = db.query(Attachment).filter_by(id=id).first()

            if attachment:
                return APIResponse(
                    success=True,
                    message="found attacment",
                    data=[attachment.to_dict()],
                )
            else:
                return APIResponse(message="Could not find attachment with given id")

    @classmethod
    def get_attachment_pdf(cls, id: int):
        with get_session() as db:
            pdf_record = db.query(Attachment).filter_by(id=id).first()

            if not pdf_record:
                return {"error": "File not found"}, 404

            # pdf_record.content assumes your DB column stores the BLOB/Bytes
            return Response(
                content=pdf_record.file,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename={pdf_record.name}.pdf"
                },
            )
