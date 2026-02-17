"""update models

Revision ID: 73a8151150e4
Revises: 6e3795a14118
Create Date: 2026-02-17 10:17:24.139229

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "73a8151150e4"
down_revision: Union[str, Sequence[str], None] = "6e3795a14118"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Use batch_alter_table for SQLite compatibility
    with op.batch_alter_table("invoices", schema=None) as batch_op:
        batch_op.create_foreign_key(
            "fk_user_assigned", "users", ["assigned_user_id"], ["id"]
        )
        batch_op.create_foreign_key(
            "fk_user_processed", "users", ["processed_by_id"], ["id"]
        )


def downgrade():
    with op.batch_alter_table("invoices", schema=None) as batch_op:
        batch_op.drop_constraint("fk_user_assigned", type_="foreignkey")
        batch_op.drop_constraint("fk_user_processed", type_="foreignkey")
