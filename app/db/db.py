from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import setting


db_url=f"{setting.DB_URL}"

engine=create_engine(url=db_url)

sessionlocal=sessionmaker(bind=engine,autoflush=False)

def get_db():
    db=sessionlocal()
    try:
        yield db
    finally:
        db.close()

        

