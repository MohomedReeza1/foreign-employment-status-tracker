from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.candidate import *
from app.crud import candidate as crud

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/candidates", response_model=CandidateOut)
def create_candidate(candidate: CandidateCreate, db: Session = Depends(get_db)):
    return crud.create_candidate(db, candidate)

@router.get("/candidates/{candidate_id}", response_model=CandidateOut)
def read_candidate(candidate_id: int, db: Session = Depends(get_db)):
    db_candidate = crud.get_candidate_by_id(db, candidate_id)
    if not db_candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate

@router.get("/candidates", response_model=List[CandidateOut])
def list_candidates(db: Session = Depends(get_db)):
    return crud.get_all_candidates(db)

@router.post("/candidate-process", response_model=CandidateProcessOut)
def add_process(process: CandidateProcessCreate, db: Session = Depends(get_db)):
    return crud.create_process(db, process)

@router.get("/candidate-process/{candidate_id}", response_model=List[CandidateProcessOut])
def get_processes(candidate_id: int, db: Session = Depends(get_db)):
    return crud.get_processes_by_candidate(db, candidate_id)
