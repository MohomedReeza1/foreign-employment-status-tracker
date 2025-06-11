"""Remove NIC and add created_at

Revision ID: 4be62b443df4
Revises: 1cfaf4c571ef
Create Date: 2025-06-07 00:39:25.793375

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4be62b443df4'
down_revision: Union[str, None] = '1cfaf4c571ef'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.drop_column('candidates', 'nic')
    op.add_column('candidates', sa.Column('created_at', sa.DateTime(), nullable=True))

def downgrade():
    op.add_column('candidates', sa.Column('nic', sa.VARCHAR(), nullable=True))
    op.drop_column('candidates', 'created_at')

