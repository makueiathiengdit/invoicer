from pydantic import BaseModel
from datetime import date


class InvoiceSchema(BaseModel):
    invoice_id: str
    description: str
    amount: float
    currency: str | None = "SSP"
    invoice_date: date
