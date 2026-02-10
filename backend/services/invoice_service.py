from schemas.invoice_schema import InvoiceSchema
from db.core import get_session
from db.models import Invoice
from utils.api_response import APIResponse


class InvoiceService:
    @classmethod
    def create_invoice(cls, invoice: InvoiceSchema) -> APIResponse:
        with get_session() as db:
            db_invoice = Invoice(**invoice.dict())
            db.add(db_invoice)
            db.commit()
            db.refresh(db_invoice)

            response = APIResponse()
            if db_invoice:
                response.success = True
                response.message = "invoice created successfully"
                response.data = [db_invoice]
            else:
                response.message = "failed to create invoice"

            return response

    @classmethod
    def get_invoices(cls) -> APIResponse:
        with get_session() as db:
            invoices = db.query(Invoice).all()
            return APIResponse(
                success=True, message="found invoices", data=invoices or []
            )

    @classmethod
    def update_invoice(cls, id, invoice: InvoiceSchema) -> APIResponse:
        with get_session() as db:
            db_invoice = db.query(Invoice).filter_by(id=id).first()
            response = APIResponse()

            if db_invoice is None:
                response.message = f"Could not find invoice with id: {id}"
                response.status_code = 404

            else:
                db_invoice.invoice_id = invoice.invoice_id
                db_invoice.invoice_date = invoice.invoice_date
                db_invoice.amount = invoice.amount
                db_invoice.currency = invoice.currency
                db_invoice.description = invoice.description

                db.add(db_invoice)
                db.commit()
                db.refresh(db_invoice)
                response.success = True
                response.message = "Invoice updated successfully"

            return response
