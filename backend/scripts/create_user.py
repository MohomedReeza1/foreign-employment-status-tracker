from app.database import SessionLocal
from app.crud.user import create_user

# Create a new DB session
db = SessionLocal()

# Create the user (change username/password as needed)
create_user(db, username="admin", password="admin123")

print("✅ User 'admin' created successfully.")

db.close()
