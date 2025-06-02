# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.database import SessionLocal

# router = APIRouter()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.get("/candidate-details/{candidate_id}", response_model=CandidateProcessDetailOut)
# def get_process_detail(candidate_id: int, db: Session = Depends(get_db)):
#     detail = crud.get_process_detail_by_candidate(db, candidate_id)
#     if not detail:
#         raise HTTPException(status_code=404, detail="Process details not found")
#     return detail

# @router.put("/candidate-details/{candidate_id}", response_model=CandidateProcessDetailOut)
# def update_process_detail(candidate_id: int, data: CandidateProcessDetailUpdate, db: Session = Depends(get_db)):
#     updated = crud.update_process_detail(db, candidate_id, data)
#     if not updated:
#         raise HTTPException(status_code=404, detail="Candidate process detail not found")
#     return updated
