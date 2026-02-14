from db.core import get_session
from db.models import Attachment
from utils.api_response import APIResponse


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
                    data=[attachment],
                )
            else:
                return APIResponse(message="Could not find attachment with given id")
