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
            db.refresh(db_invoice)

            return db_invoice

    @classmethod
    def get_invoices(cls):
        with get_session() as db:
            invoices = db.query(Invoice).all()
            return invoices or []

    @classmethod
    def update_invoice(cls, id, invoice: InvoiceSchema) -> dict:
        with get_session() as db:
            db_invoice = db.query(Invoice).filter_by(id=id).first()

            if db_invoice is None:
                return {
                    "success": False,
                    "message": "Could not find invoice with given id",
                }

            else:
                db_invoice.invoice_id = invoice.invoice_id
                db_invoice.invoice_date = invoice.invoice_date
                db_invoice.amount = invoice.amount
                db_invoice.currency = invoice.currency
                db_invoice.description = invoice.description

                db.add(db_invoice)
                db.commit()
                db.refresh(db_invoice)

                return db_invoice
