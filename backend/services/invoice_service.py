from schemas.invoice_schema import (
    InvoiceDetailSchema,
    InvoiceListSchema,
    UpdatePRPOSchema,
)
from db.core import get_session
from db.models import Invoice, Attachment, User
from utils.api_response import APIResponse
from typing import Union
from sqlalchemy.orm import joinedload
from constants.constants import INVOICE_STATUS, USER_ROLES


import datetime


class InvoiceService:
    @classmethod
    def create_invoice(cls, invoice_data: InvoiceDetailSchema) -> APIResponse:
        """
        Creates an invoice and its associated attachment (if provided)
        handling the Base64 file storage in a single transaction.
        """
        with get_session() as db:
            try:
                # create attachment
                db_attachment = None
                if invoice_data.attachment:
                    db_attachment = Attachment(
                        name=invoice_data.attachment.name,
                        size=invoice_data.attachment.size,
                        file=invoice_data.attachment.file,
                    )
                    db.add(db_attachment)
                    db.flush()

                #  create invoice
                invoice_dict = invoice_data.model_dump(exclude={"attachment", "id"})
                db_invoice = Invoice(**invoice_dict)

                if db_attachment:
                    db_invoice.attachment_id = db_attachment.id

                """
                 assign invoice to proccessor
                
                """

                # get all proccessors
                users = db.query(User).filter_by(role=USER_ROLES["PROCCESSOR"]).all()

                last_invoice = (
                    db.query(Invoice).order_by(Invoice.created_at.desc()).first()
                )

                assigned_user = cls.get_assigned_user_id(
                    last_invoice.assigned_user, users
                )

                db_invoice.assigned_user_id = assigned_user.id
                db_invoice.assigned_user = assigned_user

                db.add(db_invoice)
                db.flush()
                db.commit()

                return APIResponse(
                    success=True,
                    message="Invoice created successfully",
                    data=[db_invoice],
                )
            except Exception as e:

                print("error", e)
                db.rollback()
                return APIResponse(
                    success=False,
                    message=f"Failed to create invoice: {str(e)}",
                    status_code=500,
                )

    @classmethod
    def get_invoices(cls) -> APIResponse:
        """
        Retrieves all invoices. SQLAlchemy will automatically load
        the linked 'attachment' metadata due to the relationship setup.
        """
        with get_session() as db:
            invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).all()
            return APIResponse(
                success=True,
                message="Invoices retrieved successfully",
                data=invoices or [],
            )

    @classmethod
    def update_invoice(cls, id: int, invoice_data: InvoiceDetailSchema) -> APIResponse:
        """
        Updates an existing invoice. If a new attachment is provided,
        it updates the linked file as well.
        """
        with get_session() as db:
            db_invoice = db.query(Invoice).filter_by(id=id).first()

            if not db_invoice:
                return APIResponse(
                    success=False,
                    message=f"Could not find invoice with id: {id}",
                    status_code=404,
                )

            try:
                # Update basic fields
                db_invoice.invoice_id = invoice_data.invoice_id
                db_invoice.invoice_date = invoice_data.invoice_date
                db_invoice.amount = invoice_data.amount
                db_invoice.currency = invoice_data.currency
                db_invoice.description = invoice_data.description

                # Update attachment if provided in the update request
                if invoice_data.attachment:
                    if db_invoice.attachment:
                        # Update existing attachment
                        db_invoice.attachment.name = invoice_data.attachment.name
                        db_invoice.attachment.size = invoice_data.attachment.size
                        db_invoice.attachment.file = invoice_data.attachment.file
                    else:
                        # Create new attachment if none existed
                        new_attachment = Attachment(
                            name=invoice_data.attachment.name,
                            size=invoice_data.attachment.size,
                            file=invoice_data.attachment.file,
                        )
                        db.add(new_attachment)
                        db.flush()
                        db_invoice.attachment_id = new_attachment.id
                db_invoice.updated_at = datetime.datetime.now()
                db.commit()
                db.refresh(db_invoice)

                return APIResponse(
                    success=True,
                    message="Invoice updated successfully",
                    data=[db_invoice],
                )
            except Exception as e:
                db.rollback()
                return APIResponse(
                    success=False,
                    message=f"Error updating invoice: {str(e)}",
                    status_code=500,
                )

    @classmethod
    def get_invoice_by_id(cls, id: int) -> APIResponse:
        """
        fetch single invoice
        """
        with get_session() as db:
            try:

                invoice = (
                    db.query(Invoice)
                    .filter_by(id=id)
                    .options(
                        joinedload(Invoice.attachment),
                        joinedload(Invoice.assigned_user),
                    )
                    .first()
                )

                if invoice:
                    inv = invoice.to_dict()
                    inv["attachment"] = {
                        "id": invoice.attachment.id,
                        "name": invoice.attachment.name,
                        "size": invoice.attachment.size,
                    }

                    return APIResponse(
                        success=True, message="invoice fetched", data=[inv]
                    )
                return APIResponse(success=False, message="Could not find invoice")
            except Exception as e:
                return APIResponse(success=False, message="something went wrong")

    @classmethod
    def update_prpo(cls, id, prpo: UpdatePRPOSchema) -> APIResponse:
        """
        used to update PR and PO numbers after invoice is processed
        """
        with get_session() as db:
            db_inv = db.query(Invoice).filter_by(id=id).first()

            if db_inv is None:
                return APIResponse(
                    success=False, message="could not find invoice with given id"
                )
            else:
                if hasattr(prpo, "pr_number") and prpo.pr_number:
                    db_inv.pr_number = prpo.pr_number
                    db_inv.pr_date = datetime.datetime.now()

                    # make invoice as partially proccessed
                    db_inv.status = INVOICE_STATUS["PARTIAL"]
                if hasattr(prpo, "po_number") and prpo.po_number:
                    db_inv.po_number = prpo.po_number
                    db_inv.po_date = datetime.datetime.now()

                    # make invoice processed
                    db_inv.status = INVOICE_STATUS["PROCESSED"]

                db_inv.updated_at = datetime.datetime.now()
                db.add(db_inv)
                db.flush()
                db.commit()

                return APIResponse(success=True, message="invoice updated successfully")

    @classmethod
    def mark_invoice_complete(cls, id: int) -> APIResponse:
        with get_session() as db:
            db_inv = db.query(Invoice).filter_by(id=id).first()

            if db_inv is None:
                return APIResponse(
                    success=False, message="Could not find invoice with given id"
                )
            else:
                db_inv.status = INVOICE_STATUS["COMPLETED"]
                db_inv.updated_at = datetime.datetime.now()

                db.add(db_inv)
                db.flush()
                db.commit()
                return APIResponse(success=True, message="invoice marked completed")

    @staticmethod
    def get_assigned_user_id(last_assigned_user: dict, users: list) -> int:
        """
        assign user to invoices in round-robin
        """
        assigned_user = last_assigned_user
        for user in users:
            if last_assigned_user and user.id == last_assigned_user.id:
                continue
            assigned_user = user
        return assigned_user

    @classmethod
    def get_invoice_by_po_number(cls, po_number: str):
        with get_session() as db:
            db_inv = db.query(Invoice).filter_by(po_number=po_number).first()

            if db_inv is None:
                return APIResponse(
                    success=False, message="could not find invoice with given PO number"
                )
            else:
                return APIResponse(
                    success=True, message="found inovice", data=[db_inv.to_dict()]
                )

    @classmethod
    def get_received_invoices(cls) -> APIResponse:
        with get_session() as db:
            receieved_invoices = (
                db.query(Invoice).where(Invoice.receipt_id.is_not(None)).all()
            )

            if receieved_invoices:
                return APIResponse(
                    success=True,
                    message="found received invoices",
                    data=receieved_invoices,
                )
            else:
                return APIResponse(message="no received invoices found")

    @classmethod
    def delete_invoice_by_id(cls, id) -> APIResponse:
        with get_session() as db:
            db_inv = db.query(Invoice).filter_by(id=id).first()
            if db_inv:
                db.delete(db_inv)
                db.commit()

                return APIResponse(success=True, message="invoice deleted successfully")
