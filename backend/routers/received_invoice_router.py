from fastapi import APIRouter
from services.received_invoice_service import ReceivedInvoiceService
from schemas.invoice_schema import ReceivedInvoiceSchema

router = APIRouter(prefix="/received/invoices", tags=["Received invoices"])


@router.get("/")
def get_received_invoices():
    return ReceivedInvoiceService.get_received_invoices()


@router.post("/")
def create_received_invoice(invoice: ReceivedInvoiceSchema):
    return ReceivedInvoiceService.create_received_invoice(invoice)
