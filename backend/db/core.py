from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from typing import Generator

load_dotenv()

DB_PATH =os.environ.get("DB_URL")

db_engine = create_engine(DB_PATH)
Base = declarative_base()


SessionLocal = sessionmaker(bind=db_engine, autocommit=False, autoflush=False)


@asynccontextmanager
def get_session()->Generator[Session, None, None]:
    try:
        session = SessionLocal()
        yield session
        
    except Exception as e:
        print("Sesison rollback because of Exception {}", e)
        raise
    finally:
        session.close()    