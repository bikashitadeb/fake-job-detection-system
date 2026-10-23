"""Store job salary as human-readable text.

Revision ID: b4a91c8e2d63
Revises: ed87bba87bdc
Create Date: 2026-10-24
"""

from alembic import op
import sqlalchemy as sa


revision = "b4a91c8e2d63"
down_revision = "ed87bba87bdc"
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column(
        "jobs",
        "salary",
        existing_type=sa.Float(),
        type_=sa.Text(),
        existing_nullable=True,
    )


def downgrade():
    bind = op.get_bind()
    salaries = bind.execute(
        sa.text("SELECT salary FROM jobs WHERE salary IS NOT NULL")
    )

    for (salary,) in salaries:
        try:
            float(salary)
        except (TypeError, ValueError):
            raise RuntimeError(
                "Cannot downgrade jobs.salary to Float while nonnumeric salary "
                "text exists. Convert those values before downgrading."
            ) from None

    op.alter_column(
        "jobs",
        "salary",
        existing_type=sa.Text(),
        type_=sa.Float(),
        existing_nullable=True,
    )
