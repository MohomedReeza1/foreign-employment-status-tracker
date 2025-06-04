from sqlalchemy.orm import Session
from app.models.candidate import Candidate, CandidateProcess
from app.schemas.candidate import CandidateCreate, CandidateProcessCreate

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

    # Ordered list of process steps
    process_order = [
        ("passport_register_date", "Passport Registered"),
        ("application_sent_date", "Application Sent"),
        ("applied_job", "Job Applied"),
        ("office_name", "Office Selected"),
        ("visa_status", "Visa Processed"),
        ("medical", "Medical Done"),
        ("agreement", "Agreement Signed"),
        ("embassy", "Embassy Visit"),
        ("slbfe_approval", "SLBFE Approved"),
        ("departure_date", "Departed")
    ]
    results = []

    for c in candidates:
        detail = c.process_detail
        latest_status = None
        if detail:
            for field, label in reversed(process_order):  # Check from last to first
                value = getattr(detail, field, None)
                if value not in [None, "", False]:  # Consider filled if not blank/false
                    latest_status = label
                    break
        results.append({
            "id": c.id,
            "full_name": c.full_name,
            "passport_number": c.passport_number,
            "nic": c.nic,
            "reference_number": c.reference_number,
            "status": latest_status
        })
    return results

# Process Detail Functions
def get_process_detail_by_candidate(db: Session, candidate_id: int):
    return db.query(CandidateProcessDetail).filter_by(candidate_id=candidate_id).first()

def create_candidate_process_detail(db: Session, candidate_id: int):
    existing = get_process_detail_by_candidate(db, candidate_id)
    if existing:
        return existing
    new_detail = CandidateProcessDetail(candidate_id=candidate_id)
    db.add(new_detail)
    db.commit()
    db.refresh(new_detail)
    return new_detail

def update_process_detail(db: Session, candidate_id: int, update_data: dict):
    detail = get_process_detail_by_candidate(db, candidate_id)
    if not detail:
        return None
    for field, value in update_data.items():
        if hasattr(detail, field) and getattr(detail, field) != value:
            setattr(detail, field, value)
            if hasattr(detail, f"{field}_updated_at"):
                setattr(detail, f"{field}_updated_at", datetime.utcnow())
    db.commit()
    db.refresh(detail)
    return detail

# Pagination
def get_candidates_with_latest_status_paginated(db: Session, page: int = 1, limit: int = 10):
    skip = (page - 1) * limit
    candidates = db.query(Candidate).offset(skip).limit(limit).all()
    total = db.query(Candidate).count()

    process_order = [
        ("passport_register_date", "Passport Registered"),
        ("application_sent_date", "Application Sent"),
        ("applied_job", "Job Applied"),
        ("office_name", "Office Selected"),
        ("visa_status", "Visa Status"),
        ("medical", "Medical Status"),
        ("agreement", "Agreement Status"),
        ("embassy", "Embassy Status"),
        ("slbfe_approval", "SLBFE Status"),
        ("departure_date", "Departed")
    ]

    results = []

    for c in candidates:
        detail = c.process_detail
        latest_stage = None
        status_value = "-"

        if detail:
            for field, label in reversed(process_order):
                value = getattr(detail, field, None)
                if value not in [None, "", False]:
                    latest_stage = label
                    status_value = str(value) if not isinstance(value, bool) else ("Approved" if value else "Not Approved")
                    break

        results.append({
            "id": c.id,
            "full_name": c.full_name,
            "passport_number": c.passport_number,
            "nic": c.nic,
            "reference_number": c.reference_number,
            "latest_stage": latest_stage or "Not Started",
            "status": status_value
        })

    return {
        "data": results,
        "total": total,
        "page": page,
        "limit": limit
    }
