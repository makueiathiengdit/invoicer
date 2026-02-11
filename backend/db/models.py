from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, Float
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


class Invoice(Base, Timed):
    __tablename__ = "invoices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    invoice_id: Mapped[str] = mapped_column(String(24), nullable=True)
    invoice_date: Mapped[datetime.date]
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    amount: Mapped[float] = mapped_column(Float(precision=2), default=0.0)
    currency: Mapped[str] = mapped_column(String(5), nullable=True, default="SSP")
    attachment: Mapped[str] = mapped_column(String(250), nullable=True)
    # processed_by: Mapped[User] = relationship(User)
    processed_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=True)
