"""update received invoice model

Revision ID: 10b2e42a17e5
Revises: 05851b8a6ba2
Create Date: 2026-03-02 11:26:39.541653

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "10b2e42a17e5"
down_revision: Union[str, Sequence[str], None] = "05851b8a6ba2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use batch_alter_table for SQLite compatibility
    with op.batch_alter_table("received_invoices", schema=None) as batch_op:
        # batch_op.add_column(sa.Column("amount", sa.Integer(), nullable=True))
        batch_op.drop_constraint("fk_received_invoices_users", type_="foreignkey")
        batch_op.drop_column("received_by_id")
        batch_op.drop_column("original_invoice_id")


def downgrade() -> None:
    with op.batch_alter_table("received_invoices", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("original_invoice_id", sa.INTEGER(), nullable=True)
        )
        batch_op.add_column(sa.Column("received_by_id", sa.INTEGER(), nullable=True))
        batch_op.create_foreign_key(
            "fk_received_invoices_users", "users", ["received_by_id"], ["id"]
        )
        batch_op.drop_column("amount")
