from fastapi import APIRouter
from services.attachment_service import AttachmentService

router = APIRouter(prefix="/attachments", tags=["Attachments"])


@router.get("/")
def get_attachments():
    return AttachmentService.get_attachment_all()


@router.get("/{id}")
def get_single_attachment(id: int):
    return AttachmentService.get_attachment_pdf(id)
