revision = '1cfaf4c571ef'
down_revision = '26cf20b4edbf'

def upgrade():
    from alembic import op
    import sqlalchemy as sa

    op.alter_column(
        'candidate_process_details',
        'slbfe_approval',
        type_=sa.String(),
        postgresql_using="slbfe_approval::text"
    )

def downgrade():
    from alembic import op
    import sqlalchemy as sa

    op.alter_column(
        'candidate_process_details',
        'slbfe_approval',
        type_=sa.Boolean(),
        postgresql_using="slbfe_approval::boolean"
    )
