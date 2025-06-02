# from app.models.candidate_process_detail import CandidateProcessDetail
# from app.schemas.candidate import CandidateProcessDetailUpdate
# from datetime import datetime

# def get_process_detail_by_candidate(db: Session, candidate_id: int):
#     return db.query(CandidateProcessDetail).filter(CandidateProcessDetail.candidate_id == candidate_id).first()

# def update_process_detail(db: Session, candidate_id: int, updates: CandidateProcessDetailUpdate):
#     detail = get_process_detail_by_candidate(db, candidate_id)
#     if not detail:
#         return None

#     for field, value in updates.dict(exclude_unset=True).items():
#         setattr(detail, field, value)
#         setattr(detail, f"{field}_updated_at", datetime.utcnow())

#     db.commit()
#     db.refresh(detail)
#     return detail
