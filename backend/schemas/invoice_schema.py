from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from schemas.attachment_schema import (
    AttachmentRead,
    AttachmentFull,
)


class InvoiceBase(BaseModel):
    invoice_id: Optional[str] = Field(None, max_length=24)
    description: Optional[str] = Field(None, max_length=255)
    amount: float = Field(default=0.0, ge=0)
    currency: str = "SSP"
    invoice_date: date
    processed_at: Optional[datetime] = None
    vendor: Optional[str] = Field(None, max_length=60)
    model_config = ConfigDict(from_attributes=True)


class InvoiceListSchema(InvoiceBase):
    """Schema for returning a list of invoices (fast)."""

    id: int | None = None
    attachment: Optional[AttachmentRead] = None


class InvoiceDetailSchema(InvoiceBase):
    """Schema for returning a single invoice with its file."""

    id: int | None = None
    attachment: Optional[AttachmentFull] = None


class UpdatePRPOSchema(BaseModel):
    pr_number: str | None = None
    po_number: str | None = None


class ReceivedInvoiceSchema(BaseModel):
    invoice_id: str | None = None
    pr_number: str | None = None
    po_number: str | None = None
    receipt_id: str
    # received_by_id: int | None = None
    # original_invoice_id: int
    amount: int = 0
    description: str | None = None
