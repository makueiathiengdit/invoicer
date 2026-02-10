from fastapi import APIRouter
from schemas.invoice_schema import InvoiceSchema
from services.invoice_service import InvoiceService

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.get("/")
def get_invoices():
    return InvoiceService.get_invoices()


@router.post("/")
def create_invoice(invoice: InvoiceSchema):
    return InvoiceService.create_invoice(invoice)
