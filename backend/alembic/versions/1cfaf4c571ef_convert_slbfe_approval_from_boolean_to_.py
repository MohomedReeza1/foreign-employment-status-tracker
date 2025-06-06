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
