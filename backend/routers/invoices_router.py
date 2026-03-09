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


@router.get("/received")
def get_received_invoices():
    return InvoiceService.get_received_invoices()


@router.put("/{id}")
def update_invoice(id: int, invoice: InvoiceDetailSchema):
    return InvoiceService.update_invoice(id, invoice)


@router.delete("/{id}")
def delete_invoice_by_id(id: int):
    return InvoiceService.delete_invoice_by_id(id)


@router.put("/{id}/prpo")
def update_prpo(id: int, prpo: UpdatePRPOSchema):
    return InvoiceService.update_prpo(id, prpo)


@router.get("/{id}")
def get_invoice_by_id(id: int):
    return InvoiceService.get_invoice_by_id(id)


@router.put("/{id}/complete")
def mark_invoice_complete(id: int):
    return InvoiceService.mark_invoice_complete(id)


@router.get("/po/{po_number}")
def get_inovice_by_po_number(po_number):
    return InvoiceService.get_invoice_by_po_number(po_number)
