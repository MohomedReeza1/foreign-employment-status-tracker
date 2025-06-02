from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class CandidateBase(BaseModel):
    full_name: str
    passport_number: str
    nic: str
    reference_number: str

class CandidateCreate(CandidateBase):
    pass

class CandidateOut(CandidateBase):
    id: int
    class Config:
        orm_mode = True

class CandidateWithStatusOut(CandidateBase):
    id: int
    status: Optional[str]

    class Config:
        orm_mode = True

class CandidateProcessBase(BaseModel):
    stage: str
    status: str
    updated_at: date

class CandidateProcessCreate(CandidateProcessBase):
    candidate_id: int

class CandidateProcessOut(CandidateProcessBase):
    id: int
    candidate_id: int
    class Config:
        orm_mode = True

class ProcessUpdate(BaseModel):
    status: Optional[str] = None
    updated_at: Optional[date] = None

class PaginatedCandidateResponse(BaseModel):
    data: List[CandidateWithStatusOut]
    total: int
    page: int
    limit: int