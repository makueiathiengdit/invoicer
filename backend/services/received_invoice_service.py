from db.core import get_session
from db.models import ReceivedInvoice


class ReceivedInvoiceService:
    @classmethod
    def create_received_invoice(cls, invoice):
        with get_session() as db:
            received_invoice = ReceivedInvoice(**invoice.dict())

    @classmethod
    def get_received_invoices(cls):
        pass
