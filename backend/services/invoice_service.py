from schemas.invoice_schema import InvoiceDetailSchema, InvoiceListSchema
from db.core import get_session
from db.models import Invoice, Attachment
from utils.api_response import APIResponse
from typing import Union


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

                db.add(db_invoice)
                db.commit()
                db.refresh(db_invoice)

                return APIResponse(
                    success=True,
                    message="Invoice created successfully",
                    data=[db_invoice],
                )
            except Exception as e:
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
        with get_session() as db:
            invoice = db.query(Invoice).filter_by(id=id)
            return APIResponse(success=True, message="invoice fetched", data=[invoice])
