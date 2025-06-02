from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    passport_number = Column(String, unique=True, index=True)
    nic = Column(String, unique=True)
    reference_number = Column(String, unique=True)

    # Relationship to process tracker
    processes = relationship("CandidateProcess", back_populates="candidate")
    process_detail = relationship("CandidateProcessDetail", back_populates="candidate", uselist=False)


class CandidateProcess(Base):
    __tablename__ = "candidate_processes"
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    stage = Column(String)  # e.g., "medical", "visa"
    status = Column(String)  # e.g., "pending", "complete"
    updated_at = Column(Date)

    candidate = relationship("Candidate", back_populates="processes")
