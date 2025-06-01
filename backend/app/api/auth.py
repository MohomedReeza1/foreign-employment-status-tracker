from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserLogin, Token, UserCreate
from app.database import SessionLocal
from app.crud.user import authenticate_user, create_user_from_schema, get_user_by_username
from app.core.security import create_access_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    created_user = create_user_from_schema(db, user)
    return {
        "id": created_user.id,
        "username": created_user.username,
        "role": created_user.role
    }

@router.post("/login", response_model=Token)
def login(form: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role
    }
