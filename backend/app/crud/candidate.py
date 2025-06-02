from sqlalchemy.orm import Session
from app.models.candidate import Candidate, CandidateProcess
from app.schemas.candidate import CandidateCreate, CandidateProcessCreate
from fastapi import HTTPException

from app.models.candidate_process_detail import CandidateProcessDetail
from app.schemas.candidate_process_detail import CandidateProcessDetailUpdate
from datetime import datetime

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

def update_process(db: Session, process_id: int, update_data: dict):
    process = db.query(CandidateProcess).filter(CandidateProcess.id == process_id).first()
    if not process:
        return None
    for key, value in update_data.items():
        setattr(process, key, value)
    db.commit()
    db.refresh(process)
    return process

def get_candidate_by_passport(db: Session, passport_number: str):
    return db.query(Candidate).filter(Candidate.passport_number == passport_number).first()

def get_all_candidates_with_latest_status(db: Session):
    candidates = db.query(Candidate).all()
    stage_priority = {
        "medical": 1,
        "visa": 2,
        "embassy": 3,
        "ticket": 4,
        "departure": 5
    }
    results = []

    for c in candidates:
        # Sort processes by stage priority
        processes = sorted(
            c.processes,
            key=lambda p: stage_priority.get(p.stage.lower(), 0),
            reverse=True
        )
        latest = processes[0] if processes else None

        results.append({
            "id": c.id,
            "full_name": c.full_name,
            "passport_number": c.passport_number,
            "nic": c.nic,
            "reference_number": c.reference_number,
            "status": latest.stage if latest else None
        })

    return results

def get_process_detail_by_candidate(db: Session, candidate_id: int):
    return db.query(CandidateProcessDetail).filter(CandidateProcessDetail.candidate_id == candidate_id).first()

def update_process_detail(db: Session, candidate_id: int, updates: CandidateProcessDetailUpdate):
    detail = get_process_detail_by_candidate(db, candidate_id)
    if not detail:
        return None

    for field, value in updates.dict(exclude_unset=True).items():
        setattr(detail, field, value)
        setattr(detail, f"{field}_updated_at", datetime.utcnow())

    db.commit()
    db.refresh(detail)
    return detail

def create_process_detail_if_not_exists(db: Session, candidate_id: int) -> CandidateProcessDetail:
    existing = db.query(CandidateProcessDetail).filter_by(candidate_id=candidate_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Process detail already exists for this candidate")

    new_detail = CandidateProcessDetail(candidate_id=candidate_id)
    db.add(new_detail)
    db.commit()
    db.refresh(new_detail)
    return new_detail