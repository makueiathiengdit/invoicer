"""update

Revision ID: 72f48d68a8d0
Revises: 64735aaefad3
Create Date: 2026-02-20 10:50:40.457748

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import datetime

# revision identifiers, used by Alembic.
revision: str = "72f48d68a8d0"
down_revision: Union[str, Sequence[str], None] = "64735aaefad3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

dt = datetime.datetime.now()


def upgrade() -> None:
    # 1. Handle foreign key on received_invoices
    with op.batch_alter_table("received_invoices", schema=None) as batch_op:
        batch_op.create_foreign_key(
            "fk_received_invoices_users", "users", ["received_by_id"], ["id"]
        )

    # 2. Handle new column on users
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "updated_at", sa.DateTime(), nullable=True, server_default=sa.func.now()
            )
        )


def downgrade() -> None:
    # 1. Remove column from users
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("updated_at")

    # 2. Remove foreign key from received_invoices
    with op.batch_alter_table("received_invoices", schema=None) as batch_op:
        # Note: SQLite requires the constraint name to drop it specifically
        batch_op.drop_constraint("fk_received_invoices_users", type_="foreignkey")
