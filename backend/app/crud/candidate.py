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
