from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class CandidateProcessDetail(Base):
    __tablename__ = "candidate_process_details"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), unique=True, nullable=False)

    passport_register_date = Column(Date)
    passport_register_date_updated_at = Column(DateTime)

    application_sent_date = Column(Date)
    application_sent_date_updated_at = Column(DateTime)

    applied_job = Column(String)
    applied_job_updated_at = Column(DateTime)

    office_name = Column(String)
    office_name_updated_at = Column(DateTime)

    visa_status = Column(String)
    visa_status_updated_at = Column(DateTime)

    medical = Column(String)
    medical_updated_at = Column(DateTime)

    agreement = Column(String)
    agreement_updated_at = Column(DateTime)

    embassy = Column(String)
    embassy_updated_at = Column(DateTime)

    slbfe_approval = Column(Boolean)
    slbfe_approval_updated_at = Column(DateTime)

    departure_date = Column(Date)
    departure_date_updated_at = Column(DateTime)

    remarks = Column(Text)

    candidate = relationship("Candidate", back_populates="process_detail")
