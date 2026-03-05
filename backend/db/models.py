from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Float, BLOB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.core import Base
import datetime
from typing import Optional


class Timed:
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.now
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.now, nullable=True
    )
    deleted_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True)


class User(Base, Timed):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(40), nullable=False)
    last_name: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(60), nullable=False)
    role: Mapped[str] = mapped_column(String(10), default="USER")
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    assigned_invoices: Mapped[list["Invoice"]] = relationship(
        "Invoice",
        back_populates="assigned_user",
        foreign_keys="[Invoice.assigned_user_id]",
    )

    processed_invoices: Mapped[list["Invoice"]] = relationship(
        "Invoice",
        back_populates="processed_by",
        foreign_keys="[Invoice.processed_by_id]",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "assigned_invoices": self.assigned_invoices,
            "proccessed_invoices": self.processed_invoices,
            "updated_at": self.updated_at,
        }


class Attachment(Base, Timed):
    __tablename__ = "attachments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    size: Mapped[float] = mapped_column(Float)
    file = mapped_column(BLOB)

    # backpopulate to find the invoice from an attachment
    invoice: Mapped["Invoice"] = relationship(back_populates="attachment")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "size": self.size,
            # "file": str(self.file),
        }


class Invoice(Base, Timed):
    __tablename__ = "invoices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    invoice_id: Mapped[Optional[str]] = mapped_column(String(24))
    invoice_date: Mapped[str] = mapped_column(String(25))
    description: Mapped[Optional[str]] = mapped_column(String(255))
    amount: Mapped[float] = mapped_column(Float(precision=2), default=0.0)
    currency: Mapped[Optional[str]] = mapped_column(String(5), default="SSP")
    balance: Mapped[Optional[float]] = mapped_column(nullable=True, default=0.0)
    processed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    attachment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("attachments.id"))
    attachment: Mapped[Optional["Attachment"]] = relationship(back_populates="invoice")
    vendor: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    po_number: Mapped[Optional[str]] = mapped_column(
        String(20), nullable=True, index=True
    )
    pr_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    pr_date: Mapped[Optional[datetime.datetime]] = mapped_column(nullable=True)
    po_date: Mapped[Optional[datetime.datetime]] = mapped_column(nullable=True)
    completed_date: Mapped[Optional[datetime.datetime]] = mapped_column(nullable=True)

    assigned_user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    assigned_user: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="assigned_invoices",
        foreign_keys=[assigned_user_id],
    )
    processed_by_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    processed_by: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="processed_invoices",
        foreign_keys=[processed_by_id],
    )

    status: Mapped[Optional[str]] = mapped_column(String(25), default="PENDING")

    receipt_id: Mapped[Optional[str]] = mapped_column(nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "invoice_id": self.invoice_id,
            "invoice_date": self.invoice_date,
            "description": self.description,
            "amount": self.amount,
            "currency": self.currency,
            "balance": self.balance,
            "attachment_id": self.attachment_id,
            "vendor": self.vendor,
            "processed_at": self.processed_at,
            "pr_number": self.pr_number,
            "po_number": self.po_number,
            "assigned_user_id": self.assigned_user_id,
            "assigned_user": self.assigned_user,
            "processed_by_id": self.processed_by_id,
            "processed_by": self.processed_by,
            "status": self.status,
            "updated_at": self.updated_at,
            "created_at": self.created_at,
            "receipt_id": self.receipt_id,
            "pr_date": self.pr_date,
            "po_date": self.po_date,
        }


# for proccessed invoices that need to be sent to finance for payment
class ReceivedInvoice(Base, Timed):
    __tablename__ = "received_invoices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    invoice_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    pr_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    po_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    receipt_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    amount: Mapped[Optional[int]] = mapped_column(Integer, default=0)
    currency: Mapped[Optional[str]] = mapped_column(
        String, nullable=True, default="SSP"
    )
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    # received_by_id: Mapped[Optional[int]] = mapped_column(
    #     ForeignKey("users.id"), nullable=True
    # )
    # original_invoice_id: Mapped[Optional["Invoice"]] = mapped_column(
    #     ForeignKey("invoices.id")
    # )

    # received_by: Mapped[Optional["User"]] = relationship(
    #     "User", back_populates="received_invoices", foreign_keys=[received_by_id]
    # )

    def to_dict(self):
        return {
            "id": self.id,
            "invoice_id": self.invoice_id,
            "pr_number": self.pr_number,
            "po_number": self.po_number,
            "receipt_id": self.receipt_id,
            "amount": self.amount,
            "currency": self.currency,
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
