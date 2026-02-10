from schemas.invoice_schema import InvoiceSchema
from db.core import get_session
from db.models import Invoice


class InvoiceService:
    @classmethod
    def create_invoice(cls, invoice: InvoiceSchema):
        with get_session() as db:
            db_invoice = Invoice(**invoice.dict())
            db.add(db_invoice)
            db.commit()

            return db_invoice

    @classmethod
    def get_invoices(cls):
        with get_session() as db:
            invoices = db.query(Invoice).all()
            return invoices
