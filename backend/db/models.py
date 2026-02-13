from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Float, BLOB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.core import Base
import datetime


class Timed:
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.now
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


from typing import Optional
from sqlalchemy import ForeignKey, Integer, String, Float, BLOB, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Attachment(Base, Timed):
    __tablename__ = "attachments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    size: Mapped[float] = mapped_column(Float)
    file = mapped_column(BLOB)

    # backpopulate to find the invoice from an attachment
    invoice: Mapped["Invoice"] = relationship(back_populates="attachment")


class Invoice(Base, Timed):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    invoice_id: Mapped[Optional[str]] = mapped_column(String(24))
    invoice_date: Mapped[datetime.date]
    description: Mapped[Optional[str]] = mapped_column(String(255))
    amount: Mapped[float] = mapped_column(Float(precision=2), default=0.0)
    currency: Mapped[Optional[str]] = mapped_column(String(5), default="SSP")
    processed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    attachment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("attachments.id"))
    attachment: Mapped[Optional["Attachment"]] = relationship(back_populates="invoice")
