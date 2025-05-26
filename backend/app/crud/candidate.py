from sqlalchemy.orm import Session
from app.models.candidate import Candidate, CandidateProcess
from app.schemas.candidate import CandidateCreate, CandidateProcessCreate

def create_candidate(db: Session, data: CandidateCreate):
    candidate = Candidate(**data.dict())
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate

def get_candidate_by_id(db: Session, candidate_id: int):
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()

def get_all_candidates(db: Session):
    return db.query(Candidate).all()

def create_process(db: Session, data: CandidateProcessCreate):
    process = CandidateProcess(**data.dict())
    db.add(process)
    db.commit()
    db.refresh(process)
    return process

def get_processes_by_candidate(db: Session, candidate_id: int):
    return db.query(CandidateProcess).filter(CandidateProcess.candidate_id == candidate_id).all()
