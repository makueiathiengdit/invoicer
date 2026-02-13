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
    model_config = ConfigDict(from_attributes=True)


class InvoiceListSchema(InvoiceBase):
    """Schema for returning a LIST of invoices (fast)."""

    id: int
    attachment: Optional[AttachmentRead] = None  # Shows Name and Size, NO file


class InvoiceDetailSchema(InvoiceBase):
    """Schema for returning a SINGLE invoice with its file."""

    id: int
    attachment: Optional[AttachmentFull] = None  # Shows Name, Size, AND the Base64 file
