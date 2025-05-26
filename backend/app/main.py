from fastapi import FastAPI
from app.database import engine, Base
from app.api import auth
from app.api import candidate

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Backend API is running"}

app.include_router(auth.router)
app.include_router(candidate.router)
