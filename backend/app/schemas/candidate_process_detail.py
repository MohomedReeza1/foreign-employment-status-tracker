from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class CandidateProcessDetailBase(BaseModel):
    passport_register_date: Optional[date]
    application_sent_date: Optional[date]
    applied_job: Optional[str]
    office_name: Optional[str]
    visa_status: Optional[str]
    medical: Optional[str]
    agreement: Optional[str]
    embassy: Optional[str]
    slbfe_approval: Optional[str]
    departure_date: Optional[date]
    remarks: Optional[str]

class CandidateProcessDetailUpdate(CandidateProcessDetailBase):
    pass

class CandidateProcessDetailResponse(CandidateProcessDetailBase):
    passport_register_date_updated_at: Optional[datetime]
    application_sent_date_updated_at: Optional[datetime]
    applied_job_updated_at: Optional[datetime]
    office_name_updated_at: Optional[datetime]
    visa_status_updated_at: Optional[datetime]
    medical_updated_at: Optional[datetime]
    agreement_updated_at: Optional[datetime]
    embassy_updated_at: Optional[datetime]
    slbfe_approval_updated_at: Optional[datetime]
    departure_date_updated_at: Optional[datetime]

    class Config:
        orm_mode = True
