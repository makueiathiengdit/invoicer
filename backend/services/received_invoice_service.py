from db.core import get_session
from db.models import ReceivedInvoice
from schemas.invoice_schema import ReceivedInvoiceSchema
from utils.api_response import APIResponse


class ReceivedInvoiceService:
    @classmethod
    def create_received_invoice(cls, invoice: ReceivedInvoiceSchema):
        with get_session() as db:
            received_invoice = ReceivedInvoice(**invoice.dict())
            db.add(received_invoice)
            db.commit()

            return APIResponse(
                success=True, message="received invoice recorded successfully"
            )

    @classmethod
    def get_received_invoices(cls):
        with get_session() as db:
            r_invoices = (
                db.query(ReceivedInvoice)
                .order_by(ReceivedInvoice.created_at.desc())
                .all()
            )

            return APIResponse(
                success=True, message="found received invoices", data=r_invoices
            )

    @classmethod
    def get_received_invoices_by_po(cls, po_number):
        with get_session() as db:
            invoices = db.query(ReceivedInvoice).filter_by(po_number=po_number).all()
            return APIResponse(success=True, message="fetched invoices", data=invoices)
