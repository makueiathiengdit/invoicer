from db.core import get_session
from db.models import ReceivedInvoice, Invoice
from schemas.invoice_schema import ReceivedInvoiceSchema
from utils.api_response import APIResponse
from constants.constants import INVOICE_STATUS
import datetime


class ReceivedInvoiceService:
    @classmethod
    def create_received_invoice(cls, invoice: ReceivedInvoiceSchema):
        with get_session() as db:

            original_invoice = (
                db.query(Invoice).filter_by(po_number=invoice.po_number).first()
            )

            received_invoice = ReceivedInvoice(**invoice.dict())
            db.add(received_invoice)

            if original_invoice.balance is None:
                original_invoice.balance = original_invoice.amount

            if original_invoice.balance - invoice.amount >= 0:
                original_invoice.balance -= invoice.amount

            if original_invoice.balance == 0:
                original_invoice.status = INVOICE_STATUS["COMPLETED"]
                original_invoice.completed_date = datetime.datetime.now()

            db.add(original_invoice)
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
            invoices = (
                db.query(ReceivedInvoice)
                .filter_by(po_number=po_number)
                .order_by(ReceivedInvoice.created_at.desc())
                .all()
            )
            return APIResponse(success=True, message="fetched invoices", data=invoices)
