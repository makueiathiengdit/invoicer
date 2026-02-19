from fastapi import APIRouter
from schemas.invoice_schema import InvoiceDetailSchema, UpdatePRPOSchema
from services.invoice_service import InvoiceService

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.get("/")
def get_invoices():
    return InvoiceService.get_invoices()


@router.post("/")
def create_invoice(invoice: InvoiceDetailSchema):
    return InvoiceService.create_invoice(invoice)


@router.put("/{id}")
def update_invoice(id: int, invoice: InvoiceDetailSchema):
    return InvoiceService.update_invoice(id, invoice)


@router.put("/{id}/prpo")
def update_prpo(id: int, prpo: UpdatePRPOSchema):
    return InvoiceService.update_prpo(id, prpo)


@router.get("/{id}")
def get_invoice_by_id(id: int):
    return InvoiceService.get_invoice_by_id(id)
